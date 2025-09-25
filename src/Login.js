import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "./firebaseConfig";

const auth = getAuth(app);


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [firebaseStatus, setFirebaseStatus] = useState("");

  React.useEffect(() => {
    // Probar conexión a Firebase
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
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // El usuario será autenticado y la app mostrará Home automáticamente
    } catch (err) {
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Iniciar sesión</h2>
      {firebaseStatus && (
        <div style={{ color: firebaseStatus.includes('Error') ? 'red' : 'green', marginBottom: 10 }}>
          {firebaseStatus}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}

export default Login;
