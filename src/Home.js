import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "./firebaseConfig";

const auth = getAuth(app);
const db = getFirestore(app);

function Home() {
  const [user, setUser] = useState(null);
  const [encuestas, setEncuestas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const [firebaseStatus, setFirebaseStatus] = useState('');
  useEffect(() => {
    if (user) {
      const fetchEncuestas = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "encuestas"));
          setEncuestas(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setFirebaseStatus('Conectado correctamente a Firebase');
        } catch (e) {
          setFirebaseStatus('Error de conexión con Firebase');
        }
      };
      fetchEncuestas();
    }
  }, [user]);

  if (loading) return <div>Cargando...</div>;
  if (!user) return <div>No has iniciado sesión.</div>;

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Encuestas</h2>
      {firebaseStatus && (
        <div style={{ color: firebaseStatus.includes('Error') ? 'red' : 'green', marginBottom: 10 }}>
          {firebaseStatus}
        </div>
      )}
      {encuestas.length === 0 ? (
        <p>No hay encuestas disponibles.</p>
      ) : (
        <ul>
          {encuestas.map((encuesta) => (
            <li key={encuesta.id}>{encuesta.titulo || encuesta.id}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
