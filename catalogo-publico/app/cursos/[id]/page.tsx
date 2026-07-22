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
      <div className="container text-center py-5" style={{ color: 'var(--slate-500)' }}>
        <i className="bi bi-emoji-frown" style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}></i>
        <h5 style={{ fontWeight: 600 }}>Curso no encontrado</h5>
        <a href="/" className="btn-modern btn-primary-modern mt-3 d-inline-flex">Volver al catálogo</a>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <a href="/" className="d-inline-flex align-items-center gap-1 mb-4" style={{ color: 'var(--slate-500)', fontSize: '.875rem', textDecoration: 'none' }}>
        <i className="bi bi-arrow-left"></i>Volver al catálogo
      </a>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card-modern p-4">
            <span className="badge-modern mb-3" style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '.6875rem' }}>Detalle del curso</span>
            <h2 className="fw-bold mb-3" style={{ color: 'var(--slate-900)', fontSize: '1.75rem', letterSpacing: '-.01em' }}>{course.titulo}</h2>
            <p style={{ color: 'var(--slate-500)', fontSize: '1rem', lineHeight: 1.7 }}>{course.descripcion}</p>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card-modern p-4" style={{ position: 'sticky', top: '5rem' }}>
            <h5 className="fw-bold mb-3" style={{ color: 'var(--slate-900)' }}>Información</h5>
            <hr style={{ borderColor: 'var(--slate-200)', margin: '1rem 0' }} />

            <div className="mb-3">
              <div style={{ color: 'var(--slate-500)', fontSize: '.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em' }}>Profesor</div>
              <div style={{ color: 'var(--slate-900)', fontWeight: 600, fontSize: '.9375rem' }}>{course.profesor?.nombre || 'Por asignar'}</div>
            </div>

            {course.profesor?.especialidad && (
              <div className="mb-3">
                <div style={{ color: 'var(--slate-500)', fontSize: '.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em' }}>Especialidad</div>
                <div style={{ color: 'var(--slate-900)', fontSize: '.9375rem' }}>{course.profesor.especialidad}</div>
              </div>
            )}

            <div className="mb-3">
              <div style={{ color: 'var(--slate-500)', fontSize: '.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em' }}>Inscritos</div>
              <div style={{ color: 'var(--slate-900)', fontWeight: 600, fontSize: '.9375rem' }}>{course.estudiantes?.length || 0} estudiantes</div>
            </div>

            <hr style={{ borderColor: 'var(--slate-200)', margin: '1rem 0' }} />

            <a href={`${PORTAL_URL}/register`} className="btn-modern btn-primary-modern w-100">
              <i className="bi bi-plus-circle me-1"></i>Inscribirme ahora
            </a>
            <p style={{ color: 'var(--slate-500)', fontSize: '.75rem', marginTop: '.75rem', marginBottom: 0, textAlign: 'center' }}>
              ¿Ya tienes cuenta? <a href={`${PORTAL_URL}/login`} style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Inicia sesión</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
