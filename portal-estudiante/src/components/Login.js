import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const fetchWithTimeout = (url, options = {}) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 30000);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(id));
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetchWithTimeout(`${API}/auth/login`, {
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
    } catch {
      setError('Error de conexión. Verifica el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
      <div className="card-modern p-5" style={{ width: '100%', maxWidth: 420 }}>
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 48, height: 48, background: '#0f172a', borderRadius: 12 }}>
            <i className="bi bi-mortarboard-fill text-white" style={{ fontSize: '1.25rem' }}></i>
          </div>
          <h3 className="fw-bold mb-1" style={{ color: 'var(--slate-900)' }}>Portal del Estudiante</h3>
          <p className="mb-0" style={{ color: 'var(--slate-500)', fontSize: '.875rem' }}>Ingresa con tu cuenta para continuar</p>
        </div>

        {error && <div className="alert-modern mb-4" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="label-modern">Correo electrónico</label>
            <input type="email" className="input-modern" placeholder="estudiante@isil.pe" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="label-modern">Contraseña</label>
            <input type="password" className="input-modern" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-modern btn-primary-modern w-100" disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm me-1"></span>}Ingresar
          </button>
        </form>
        <p className="text-center mt-4 mb-0" style={{ color: 'var(--slate-500)', fontSize: '.875rem' }}>
          ¿No tienes cuenta? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
