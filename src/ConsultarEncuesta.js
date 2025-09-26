import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "./firebaseConfig";
import * as XLSX from "xlsx";

import { Link } from "react-router-dom";

function ConsultarEncuesta() {
  const [expanded, setExpanded] = useState({});
  const [encuestas, setEncuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchEncuestas = async () => {
      setLoading(true);
      try {
        const encuestasSnap = await getDocs(collection(db, 'encuestas'));
        let agrupadasArr = [];
        for (const encuestaDoc of encuestasSnap.docs) {
          const encuestaId = encuestaDoc.id;
          const encuestaTitulo = encuestaDoc.data().titulo || 'Sin título';
          const encuestaDescripcion = encuestaDoc.data().descripcion || '';
          // Traer preguntas anidadas
          const preguntasSnap = await getDocs(collection(db, 'encuestas', encuestaId, 'preguntas'));
          const preguntasArr = preguntasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // Traer respuestas anidadas
          const respuestasSnap = await getDocs(collection(db, 'encuestas', encuestaId, 'respuestas'));
          const respuestasArr = respuestasSnap.docs.map(respDoc => ({
            ...respDoc.data(),
            fecha: respDoc.data().fecha,
            usuario: respDoc.data().nombre || respDoc.data().usuario || respDoc.data().correo || 'Desconocido',
            respuestas: respDoc.data().respuestas || {},
          }));
          agrupadasArr.push({
            encuestaId,
            encuestaTitulo,
            encuestaDescripcion,
            preguntas: preguntasArr,
            respuestas: respuestasArr,
          });
        }
  setEncuestas(agrupadasArr);
      } catch (e) {
        setEncuestas([]);
      }
      setLoading(false);
    };
    fetchEncuestas();
  }, [db]);

  // Exportar a Excel
  const exportarExcelEncuesta = (encuesta) => {
    let rows = [];
    (encuesta.respuestas || []).forEach(resp => {
      let preguntas = (encuesta.preguntas || []).map(p => p.texto || p.pregunta || p.id);
      let respuestas = (encuesta.preguntas || []).map(p => {
        const r = resp.respuestas?.[p.id];
        if (Array.isArray(r)) return r.map((prod, i) => `${i + 1}. ${prod.nombre || prod}`).join(', ');
        return r || 'Sin respuesta';
      });
      rows.push({
        'Título Encuesta': encuesta.encuestaTitulo || encuesta.titulo || encuesta.id,
        'Usuario': resp.usuario,
        'Tienda': resp.tienda || '-',
        'Preguntas': preguntas.join(' | '),
        'Respuestas': respuestas.join(' | '),
        'Fecha': resp.fecha ? new Date(resp.fecha).toLocaleString() : 'Sin fecha',
      });
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Encuesta");
    XLSX.writeFile(wb, `encuesta_${(encuesta.encuestaTitulo || encuesta.titulo || encuesta.id).replace(/\s+/g, '_')}.xlsx`);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4fa' }}>
      {/* Menú lateral */}
      <nav style={{ width: 240, background: '#212529', color: 'white', padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', boxShadow: '2px 0 8px #1976d220' }}>
        <h2 style={{ fontSize: 22, marginBottom: 32, fontWeight: 700 }}>Menú</h2>
  <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 500, fontSize: 18, marginBottom: 16, padding: '8px 16px', borderRadius: 6, background: '#212529' }}>Home</Link>
      </nav>
      {/* Contenido principal */}
      <div style={{ flex: 1, maxWidth: 900, margin: "auto", padding: 32 }}>
        <h2>Consultar Encuesta</h2>
        {loading ? (
          <p>Cargando encuestas...</p>
        ) : encuestas.length === 0 ? (
          <p>No hay encuestas disponibles.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {encuestas.slice(-6).map((encuesta, idx) => (
              <div key={encuesta.encuestaId || encuesta.id} style={{ border: '1px solid #212529', borderRadius: 10, background: '#f5faff', padding: 20, boxShadow: '0 2px 8px #1976d220', marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <h3
                    style={{ color: '#212529', marginBottom: 8 }}
                    onClick={() => setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }))}
                    title="Mostrar/ocultar detalles"
                  >
                    {encuesta.encuestaTitulo || encuesta.titulo || encuesta.id}
                  </h3>
                  <button onClick={() => exportarExcelEncuesta(encuesta)} style={{ background: '#03811fff', color: 'white', border: 'none', borderRadius: 6, padding: '8px 14px', fontWeight: 500, cursor: 'pointer', marginLeft: 16 }}>Exportar a Excel</button>
                </div>
                {expanded[idx] && (
                  <>
                    {encuesta.encuestaDescripcion && <p style={{ color: '#555', marginTop: 0 }}>{encuesta.encuestaDescripcion}</p>}
                    <div style={{ marginTop: 12 }}>
                      <strong>Preguntas y respuestas:</strong>
                      {Array.isArray(encuesta.preguntas) && encuesta.preguntas.length > 0 && Array.isArray(encuesta.respuestas) && encuesta.respuestas.length > 0 ? (
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12, background: '#fff' }}>
                          <thead>
                            <tr style={{ background: '#e3f0fa' }}>
                              <th style={{ border: '1px solid #b3d1ea', padding: 8 }}>Título Encuesta</th>
                              <th style={{ border: '1px solid #b3d1ea', padding: 8 }}>Usuario</th>
                              <th style={{ border: '1px solid #b3d1ea', padding: 8 }}>Tienda</th>
                              <th style={{ border: '1px solid #b3d1ea', padding: 8 }}>Preguntas</th>
                              <th style={{ border: '1px solid #b3d1ea', padding: 8 }}>Respuestas</th>
                              <th style={{ border: '1px solid #b3d1ea', padding: 8 }}>Fecha</th>
                            </tr>
                          </thead>
                          <tbody>
                            {encuesta.respuestas
                              .map((resp, ridx) => (
                                <tr key={resp.id || ridx}>
                                  <td style={{ border: '1px solid #b3d1ea', padding: 8 }}>{encuesta.encuestaTitulo || encuesta.titulo || encuesta.id}</td>
                                  <td style={{ border: '1px solid #b3d1ea', padding: 8 }}>{resp.usuario}</td>
                                  <td style={{ border: '1px solid #b3d1ea', padding: 8 }}>{resp.tienda || '-'}</td>
                                  <td style={{ border: '1px solid #b3d1ea', padding: 8 }}>
                                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                                      {encuesta.preguntas.map((pregunta, pidx) => (
                                        <li key={pregunta.id || pidx}>{pregunta.texto || pregunta.pregunta || `Pregunta ${pidx + 1}`}</li>
                                      ))}
                                    </ul>
                                  </td>
                                  <td style={{ border: '1px solid #b3d1ea', padding: 8 }}>
                                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                                      {encuesta.preguntas.map((pregunta, pidx) => (
                                        <li key={pregunta.id || pidx}>
                                          {Array.isArray(resp.respuestas?.[pregunta.id])
                                            ? resp.respuestas[pregunta.id].map((prod, i) => `${i + 1}. ${prod.nombre || prod}`).join(', ')
                                            : (resp.respuestas?.[pregunta.id] || 'Sin respuesta')}
                                        </li>
                                      ))}
                                    </ul>
                                  </td>
                                  <td style={{ border: '1px solid #b3d1ea', padding: 8 }}>{resp.fecha ? new Date(resp.fecha).toLocaleString() : 'Sin fecha'}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      ) : (
                        <span style={{ color: '#888' }}>Sin preguntas o respuestas</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ConsultarEncuesta;
