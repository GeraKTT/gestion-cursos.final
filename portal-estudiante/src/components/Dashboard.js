import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [cursos, setCursos] = useState([]);

  const cargarCursos = async () => {
    const res = await fetch('http://localhost:3000/api/courses');
    const data = await res.json();
    setCursos(data);
  };

  useEffect(() => {
    cargarCursos();
  }, []);

  const inscribirse = async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/api/courses/${id}/enroll`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      alert('¡Inscripción exitosa! Tu lugar está asegurado.');
      cargarCursos();
    }
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Navbar */}
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

      <div className="container mt-5">
        <h2 className="fw-bold mb-4">Cursos Disponibles para ti</h2>
        <div className="row g-4">
          {cursos.map(curso => (
            <div className="col-md-6 col-lg-4" key={curso._id}>
              <div className="card h-100 border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title fw-bold text-dark mb-0">{curso.titulo}</h5>
                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill">Abierto</span>
                  </div>
                  <p className="card-text text-muted mt-3">{curso.descripcion}</p>
                </div>
                <div className="card-footer bg-transparent border-0 p-4 pt-0">
                  <button className="btn btn-outline-primary w-100 rounded-pill py-2 fw-semibold" onClick={() => inscribirse(curso._id)}>
                    Matricularme en este curso
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}