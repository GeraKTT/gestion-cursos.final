async function getCourses() {
  try {
    const res = await fetch('http://localhost:3000/api/courses', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function Catalog() {
  const courses = await getCourses();

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* Banner Principal Moderno */}
      <div className="bg-dark text-white py-5 mb-5 shadow-sm">
        <div className="container text-center py-4">
          <h1 className="display-4 fw-bolder tracking-tight">Potencia tu Futuro Hoy</h1>
          <p className="lead text-secondary mt-3">Explora nuestro catálogo de cursos especializados y da el siguiente paso en tu carrera.</p>
        </div>
      </div>

      <div className="container">
        <div className="row g-4">
          {courses.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-warning text-center rounded-4 shadow-sm py-4 border-0">
                <h5 className="mb-0">Aún no hay cursos disponibles en el catálogo.</h5>
              </div>
            </div>
          ) : (
            courses.map((course: any) => (
              <div className="col-md-6 col-lg-4" key={course._id}>
                <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden" style={{ transition: 'transform 0.3s' }}>
                  <div className="card-body p-4">
                    <span className="badge bg-primary bg-opacity-10 text-primary mb-3 px-3 py-2 rounded-pill">
                      Nuevo
                    </span>
                    <h4 className="card-title fw-bold mb-3">{course.titulo}</h4>
                    <p className="card-text text-muted line-clamp-3">{course.descripcion}</p>
                    <hr className="text-muted opacity-25" />
                    <small className="text-secondary fw-semibold">
                      <i className="bi bi-person-circle me-1"></i> 
                      {course.profesor?.nombre || 'Profesor por confirmar'}
                    </small>
                  </div>
                  <div className="card-footer bg-white border-0 p-4 pt-0">
                    <a href="http://localhost:3001/login" className="btn btn-dark w-100 rounded-pill py-2 fw-semibold shadow-sm">
                      Inscribirse Ahora
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}