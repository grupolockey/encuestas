
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "./firebaseConfig";

const auth = getAuth(app);

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [firebaseStatus, setFirebaseStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  React.useEffect(() => {
    try {
      if (auth.app.name) {
        setFirebaseStatus("Conectado correctamente a Firebase");
      }
    } catch (e) {
      setFirebaseStatus("Error de conexión con Firebase");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Correo o contraseña incorrectos");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4fa' }}>
      <div style={{ maxWidth: 400, width: '100%', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #1976d220', padding: 32 }}>
        <h2 style={{ textAlign: 'center', color: '#212529', marginBottom: 24 }}>Iniciar sesión</h2>
        {firebaseStatus && (
          <div style={{ color: firebaseStatus.includes('Error') ? 'red' : 'green', marginBottom: 18, textAlign: 'center', fontWeight: 500 }}>
            {firebaseStatus}
          </div>
        )}
        <form onSubmit={handleSubmit} autoComplete="on">
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#333', fontWeight: 500 }}>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #b3d1ea', fontSize: 16 }}
              placeholder="usuario@ejemplo.com"
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#333', fontWeight: 500 }}>Contraseña</label>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #b3d1ea', fontSize: 16 }}
                placeholder="Tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{ position: 'absolute', right: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#212529', fontSize: 20, padding: 0 }}
                tabIndex={-1}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <span role="img" aria-label="Ocultar contraseña">&#128065;&#x20E0;</span> // ojo tachado
                ) : (
                  <span role="img" aria-label="Mostrar contraseña">&#128065;</span> // ojo
                )}
              </button>
            </div>
          </div>
          {error && <div style={{ color: "red", marginBottom: 16, textAlign: 'center' }}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: '#212529', color: 'white', border: 'none', borderRadius: 6, padding: '12px 0', fontWeight: 600, fontSize: 18, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8, boxShadow: '0 1px 4px #1976d220' }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
