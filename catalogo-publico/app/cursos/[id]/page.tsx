const API = process.env.API_URL || 'http://localhost:3000/api';
const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:3001';

async function getCourse(id: string) {
  try {
    const res = await fetch(`${API}/courses/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function CourseDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getCourse(id);

  if (!course) {
    return (
      <div className="container mt-5 text-center">
        <h2>Curso no encontrado</h2>
        <a href="/" className="btn btn-dark mt-3">Volver al catálogo</a>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 pb-5">
      <div className="bg-dark text-white py-5 mb-5 shadow-sm">
        <div className="container">
          <a href="/" className="text-secondary text-decoration-none mb-3 d-inline-block">&larr; Volver al catálogo</a>
          <h1 className="display-5 fw-bolder">{course.titulo}</h1>
        </div>
      </div>

      <div className="container">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-4 p-4">
              <h4 className="fw-bold mb-3">Descripción del Curso</h4>
              <p className="text-muted lead">{course.descripcion}</p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 rounded-4 p-4">
              <h5 className="fw-bold mb-3">Información</h5>
              <hr />
              <p><strong>Profesor:</strong> {course.profesor?.nombre || 'Por asignar'}</p>
              {course.profesor?.especialidad && (
                <p><strong>Especialidad:</strong> {course.profesor.especialidad}</p>
              )}
              <p><strong>Inscritos:</strong> {course.estudiantes?.length || 0}</p>
              <hr />
              <a href={`${PORTAL_URL}/login`} className="btn btn-dark w-100 rounded-pill fw-semibold">
                Inscribirse Ahora
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
