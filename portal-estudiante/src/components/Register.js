import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password, rol: 'estudiante' })
    });
    const data = await res.json();

    if (res.ok) {
      setSuccess('Registro exitoso. Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(data.error || 'Error al registrarse');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm p-4 border-0 bg-light">
            <h2 className="text-center mb-4">Crear Cuenta</h2>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            {success && <div className="alert alert-success py-2">{success}</div>}
            <form onSubmit={handleSubmit}>
              <input type="text" className="form-control mb-3" placeholder="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              <input type="email" className="form-control mb-3" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" className="form-control mb-4" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit" className="btn btn-dark w-100">Registrarse</button>
            </form>
            <p className="text-center mt-3 mb-0">
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
