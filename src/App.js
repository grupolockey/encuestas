
import './App.css';

import Login from './Login';
import Home from './Home';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from './firebaseConfig';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="App">
      {user ? <Home /> : <Login />}
    </div>
  );
}

export default App;
