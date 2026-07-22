import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [cursos, setCursos] = useState([]);
  const [misCursos, setMisCursos] = useState([]);
  const [tab, setTab] = useState('disponibles');
  const [error, setError] = useState('');

  const cargarCursos = async () => {
    const res = await fetch(`${API}/courses`);
    const data = await res.json();
    setCursos(data);
  };

  const cargarMisCursos = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API}/courses/student/my-enrollments`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      setMisCursos(data);
    }
  };

  useEffect(() => {
    cargarCursos();
    cargarMisCursos();
  }, []);

  const inscribirse = async (id) => {
    const token = localStorage.getItem('token');
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
  };

  const cursosDisponibles = cursos.filter(
    c => !misCursos.find(mc => mc._id === c._id)
  );

  return (
    <div className="bg-light min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-bold">Portal del Estudiante</span>
          <div className="d-flex align-items-center">
            <span className="text-white me-3 fw-semibold">Hola, {user?.nombre || 'Estudiante'}</span>
            <button className="btn btn-light btn-sm rounded-pill px-3 fw-bold text-primary" onClick={logout}>
              Salir
            </button>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}

        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button className={`nav-link ${tab === 'disponibles' ? 'active fw-bold' : ''}`} onClick={() => setTab('disponibles')}>
              Cursos Disponibles
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${tab === 'inscritos' ? 'active fw-bold' : ''}`} onClick={() => setTab('inscritos')}>
              Mis Inscripciones ({misCursos.length})
            </button>
          </li>
        </ul>

        {tab === 'disponibles' ? (
          <div className="row g-4">
            {cursosDisponibles.length === 0 ? (
              <div className="col-12">
                <div className="alert alert-info text-center">Ya estás inscrito en todos los cursos disponibles.</div>
              </div>
            ) : (
              cursosDisponibles.map(curso => (
                <div className="col-md-6 col-lg-4" key={curso._id}>
                  <div className="card h-100 border-0 shadow-sm rounded-4">
                    <div className="card-body p-4">
                      <h5 className="card-title fw-bold text-dark mb-2">{curso.titulo}</h5>
                      <p className="card-text text-muted">{curso.descripcion}</p>
                      {curso.profesor && (
                        <small className="text-secondary">Profesor: {curso.profesor.nombre}</small>
                      )}
                    </div>
                    <div className="card-footer bg-transparent border-0 p-4 pt-0">
                      <button className="btn btn-outline-primary w-100 rounded-pill py-2 fw-semibold" onClick={() => inscribirse(curso._id)}>
                        Matricularme
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="row g-4">
            {misCursos.length === 0 ? (
              <div className="col-12">
                <div className="alert alert-warning text-center">No estás inscrito en ningún curso aún.</div>
              </div>
            ) : (
              misCursos.map(curso => (
                <div className="col-md-6 col-lg-4" key={curso._id}>
                  <div className="card h-100 border-0 shadow-sm rounded-4 bg-success bg-opacity-10">
                    <div className="card-body p-4">
                      <span className="badge bg-success mb-2">Inscrito</span>
                      <h5 className="card-title fw-bold text-dark mb-2">{curso.titulo}</h5>
                      <p className="card-text text-muted">{curso.descripcion}</p>
                      {curso.profesor && (
                        <small className="text-secondary">Profesor: {curso.profesor.nombre}</small>
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
