import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [cursos, setCursos] = useState([]);
  const [misCursos, setMisCursos] = useState([]);
  const [tab, setTab] = useState('disponibles');
  const [error, setError] = useState('');
  const [loadingCursos, setLoadingCursos] = useState(true);
  const [loadingMisCursos, setLoadingMisCursos] = useState(true);
  const [errorCursos, setErrorCursos] = useState('');

  const cargarCursos = async () => {
    setLoadingCursos(true);
    setErrorCursos('');
    try {
      const res = await fetch(`${API}/courses`);
      if (!res.ok) throw new Error('Error al cargar cursos');
      const data = await res.json();
      setCursos(data);
    } catch {
      setErrorCursos('No se pudieron cargar los cursos. Verifica la conexión.');
    } finally {
      setLoadingCursos(false);
    }
  };

  const cargarMisCursos = async () => {
    setLoadingMisCursos(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API}/courses/student/my-enrollments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMisCursos(data);
      }
    } catch {
      // silencioso — no bloquear la UI por esto
    } finally {
      setLoadingMisCursos(false);
    }
  };

  useEffect(() => {
    cargarCursos();
    cargarMisCursos();
  }, []);

  const inscribirse = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API}/courses/${id}/enroll`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setError('');
        cargarMisCursos();
      } else {
        setError(data.error || 'Error al inscribirse');
      }
    } catch {
      setError('Error de conexión al inscribirse');
    }
  };

  const cursosDisponibles = cursos.filter(
    c => !misCursos.find(mc => mc._id === c._id)
  );

  return (
    <div style={{ background: 'var(--slate-50)', minHeight: '100vh' }}>
      <nav className="navbar-modern">
        <div className="container d-flex align-items-center justify-content-between">
          <span className="fw-bold" style={{ fontSize: '1.1rem', color: 'var(--slate-900)' }}>
            <i className="bi bi-mortarboard-fill me-2" style={{ color: 'var(--primary)' }}></i>Portal del Estudiante
          </span>
          <div className="d-flex align-items-center gap-3">
            <span style={{ color: 'var(--slate-500)', fontSize: '.875rem' }}>
              <i className="bi bi-person-circle me-1"></i>{user?.nombre || 'Estudiante'}
            </span>
            <button className="btn-modern btn-outline-modern" onClick={logout}>
              <i className="bi bi-box-arrow-right me-1"></i>Salir
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        {error && (
          <div className="alert-modern mb-4 d-flex justify-content-between align-items-center" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
            <span>{error}</span>
            <button type="button" className="btn-close" onClick={() => setError('')} style={{ fontSize: '.75rem' }}></button>
          </div>
        )}

        <div className="d-flex gap-2 mb-4">
          <button className={`tab-modern ${tab === 'disponibles' ? 'active' : ''}`} onClick={() => setTab('disponibles')}>
            <i className="bi bi-book me-1"></i>Cursos Disponibles
          </button>
          <button className={`tab-modern ${tab === 'inscritos' ? 'active' : ''}`} onClick={() => setTab('inscritos')}>
            <i className="bi bi-check-circle me-1"></i>Mis Inscripciones
            {misCursos.length > 0 && (
              <span className="badge-modern ms-1" style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', fontSize: '.6875rem' }}>{misCursos.length}</span>
            )}
          </button>
        </div>

        {tab === 'disponibles' ? (
          <div className="row g-4">
            {loadingCursos ? (
              <div className="col-12">
                <div className="text-center py-5" style={{ color: 'var(--slate-500)' }}>
                  <div className="spinner-border mb-3" role="status" style={{ width: '2rem', height: '2rem' }}></div>
                  <div>Cargando cursos...</div>
                </div>
              </div>
            ) : errorCursos ? (
              <div className="col-12">
                <div className="text-center py-5" style={{ color: 'var(--danger)' }}>
                  <i className="bi bi-exclamation-triangle" style={{ fontSize: '2rem', display: 'block', marginBottom: '.5rem' }}></i>
                  {errorCursos}
                  <button className="btn-modern btn-outline-modern d-inline-flex mt-3" onClick={cargarCursos}>Reintentar</button>
                </div>
              </div>
            ) : cursosDisponibles.length === 0 ? (
              <div className="col-12">
                <div className="text-center py-5" style={{ color: 'var(--slate-500)' }}>
                  <i className="bi bi-emoji-smile" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '.5rem' }}></i>
                  Ya estás inscrito en todos los cursos disponibles
                </div>
              </div>
            ) : (
              cursosDisponibles.map(curso => (
                <div className="col-md-6 col-lg-4" key={curso._id}>
                  <div className="card-modern h-100">
                    <div className="p-4">
                      <span className="badge-modern mb-2" style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '.6875rem' }}>Disponible</span>
                      <h5 className="fw-bold mt-2 mb-2" style={{ color: 'var(--slate-900)' }}>{curso.titulo}</h5>
                      <p style={{ color: 'var(--slate-500)', fontSize: '.875rem', lineHeight: 1.5 }}>{curso.descripcion}</p>
                      {curso.profesor && (
                        <div style={{ color: 'var(--slate-500)', fontSize: '.8125rem' }}>
                          <i className="bi bi-person me-1"></i>{curso.profesor.nombre}
                        </div>
                      )}
                    </div>
                    <div className="p-4 pt-0">
                      <button className="btn-modern btn-primary-modern w-100" onClick={() => inscribirse(curso._id)}>
                        <i className="bi bi-plus-circle me-1"></i>Matricularme
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="row g-4">
            {loadingMisCursos ? (
              <div className="col-12">
                <div className="text-center py-5" style={{ color: 'var(--slate-500)' }}>
                  <div className="spinner-border mb-3" role="status" style={{ width: '2rem', height: '2rem' }}></div>
                  <div>Cargando inscripciones...</div>
                </div>
              </div>
            ) : misCursos.length === 0 ? (
              <div className="col-12">
                <div className="text-center py-5" style={{ color: 'var(--slate-500)' }}>
                  <i className="bi bi-inbox" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '.5rem' }}></i>
                  No estás inscrito en ningún curso aún
                </div>
              </div>
            ) : (
              misCursos.map(curso => (
                <div className="col-md-6 col-lg-4" key={curso._id}>
                  <div className="card-modern h-100" style={{ borderColor: 'var(--success)', background: 'var(--success-light)' }}>
                    <div className="p-4">
                      <span className="badge-modern mb-2" style={{ background: 'var(--success)', color: '#fff', fontSize: '.6875rem' }}>
                        <i className="bi bi-check-circle me-1"></i>Inscrito
                      </span>
                      <h5 className="fw-bold mt-2 mb-2" style={{ color: 'var(--slate-900)' }}>{curso.titulo}</h5>
                      <p style={{ color: 'var(--slate-500)', fontSize: '.875rem', lineHeight: 1.5 }}>{curso.descripcion}</p>
                      {curso.profesor && (
                        <div style={{ color: 'var(--slate-500)', fontSize: '.8125rem' }}>
                          <i className="bi bi-person me-1"></i>{curso.profesor.nombre}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
