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
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
      <div className="card-modern p-5" style={{ width: '100%', maxWidth: 420 }}>
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 48, height: 48, background: '#0f172a', borderRadius: 12 }}>
            <i className="bi bi-person-plus-fill text-white" style={{ fontSize: '1.25rem' }}></i>
          </div>
          <h3 className="fw-bold mb-1" style={{ color: 'var(--slate-900)' }}>Crear Cuenta</h3>
          <p className="mb-0" style={{ color: 'var(--slate-500)', fontSize: '.875rem' }}>Regístrate como estudiante</p>
        </div>

        {error && <div className="alert-modern mb-4" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>{error}</div>}
        {success && <div className="alert-modern mb-4" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="label-modern">Nombre completo</label>
            <input type="text" className="input-modern" placeholder="Juan Pérez" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="label-modern">Correo electrónico</label>
            <input type="email" className="input-modern" placeholder="estudiante@isil.pe" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="label-modern">Contraseña</label>
            <input type="password" className="input-modern" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-modern btn-primary-modern w-100">Crear Cuenta</button>
        </form>
        <p className="text-center mt-4 mb-0" style={{ color: 'var(--slate-500)', fontSize: '.875rem' }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
