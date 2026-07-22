const API = process.env.API_URL || 'http://localhost:3000/api';
const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:3001';

async function getCourses(search?: string) {
  try {
    const url = search ? `${API}/courses?search=${encodeURIComponent(search)}` : `${API}/courses`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function Catalog({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const courses = await getCourses(q);

  return (
    <div className="bg-light min-vh-100 pb-5">
      <div className="bg-dark text-white py-5 mb-5 shadow-sm">
        <div className="container text-center py-4">
          <h1 className="display-4 fw-bolder tracking-tight">Catálogo de Cursos</h1>
          <p className="lead text-secondary mt-3">Explora nuestros cursos especializados y potencia tu carrera.</p>
        </div>
      </div>

      <div className="container">
        <form className="mb-4" action="/">
          <div className="input-group">
            <input type="text" name="q" className="form-control form-control-lg" placeholder="Buscar cursos por nombre..." defaultValue={q || ''} />
            <button type="submit" className="btn btn-dark px-4">Buscar</button>
            {q && <a href="/" className="btn btn-outline-secondary">Limpiar</a>}
          </div>
        </form>

        <div className="row g-4">
          {courses.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-warning text-center rounded-4 shadow-sm py-4 border-0">
                <h5 className="mb-0">{q ? 'No se encontraron cursos con ese nombre.' : 'Aún no hay cursos disponibles.'}</h5>
              </div>
            </div>
          ) : (
            courses.map((course: any) => (
              <div className="col-md-6 col-lg-4" key={course._id}>
                <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden" style={{ transition: 'transform 0.3s' }}>
                  <div className="card-body p-4">
                    <span className="badge bg-primary bg-opacity-10 text-primary mb-3 px-3 py-2 rounded-pill">Nuevo</span>
                    <h4 className="card-title fw-bold mb-3">{course.titulo}</h4>
                    <p className="card-text text-muted">{course.descripcion}</p>
                    <hr className="text-muted opacity-25" />
                    <small className="text-secondary fw-semibold">
                      {course.profesor?.nombre || 'Profesor por confirmar'}
                    </small>
                  </div>
                  <div className="card-footer bg-white border-0 p-4 pt-0">
                    <div className="d-grid gap-2">
                      <a href={`/cursos/${course._id}`} className="btn btn-outline-dark rounded-pill fw-semibold">
                        Ver Detalle
                      </a>
                      <a href={`${PORTAL_URL}/login`} className="btn btn-dark rounded-pill fw-semibold shadow-sm">
                        Inscribirse Ahora
                      </a>
                    </div>
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