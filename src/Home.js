import React from "react";
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";



function Home() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4fa' }}>
      {/* Menú lateral */}
      <nav style={{ width: 240, background: '#212529', color: 'white', padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', boxShadow: '2px 0 8px #1976d220' }}>
        <h2 style={{ fontSize: 22, marginBottom: 32, fontWeight: 700 }}>Menú</h2>
        <Link to="/consultar" style={{ color: 'white', textDecoration: 'none', fontWeight: 500, fontSize: 18, marginBottom: 16, padding: '8px 16px', borderRadius: 6, background: '#212529' }}>Consultar Encuesta</Link>
        <button
          onClick={() => { signOut(getAuth()); window.location.reload(); }}
          style={{ marginTop: 32, background: '#fff', color: '#212529', border: 'none', borderRadius: 6, padding: '10px 20px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #1976d220' }}
        >
          Cerrar sesión
        </button>
      </nav>
      {/* Contenido principal */}
      <div style={{ flex: 1, maxWidth: 900, margin: "auto", padding: 32 }}>
        <h2>Bienvenido</h2>
      </div>
    </div>
  );
}

export default Home;
