import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    
    if (res.ok) {
      login(data.token, data.user);
      navigate('/dashboard');
    } else {
      setError(data.error || 'Credenciales incorrectas');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm p-4 border-0 bg-light">
            <h2 className="text-center mb-4">Portal del Estudiante</h2>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <form onSubmit={handleSubmit}>
              <input type="email" className="form-control mb-3" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" className="form-control mb-4" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit" className="btn btn-dark w-100">Ingresar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}