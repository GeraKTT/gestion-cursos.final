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
    <>
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', padding: '5rem 0' }}>
        <div className="container text-center" style={{ maxWidth: 720 }}>
          <span className="badge-modern mb-3" style={{ background: 'rgba(255,255,255,.1)', color: '#94a3b8', fontSize: '.75rem', padding: '.375rem 1rem' }}>
            <i className="bi bi-star me-1" style={{ color: '#facc15' }}></i>Catálogo Académico {new Date().getFullYear()}
          </span>
          <h1 className="fw-bold" style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', letterSpacing: '-.02em', lineHeight: 1.15 }}>
            Explora nuestros cursos y potencia tu carrera
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.125rem', maxWidth: 560, margin: '1rem auto 0', lineHeight: 1.6 }}>
            Formación especializada con los mejores docentes. Encuentra el curso ideal para ti.
          </p>
        </div>
      </section>

      <div className="container" style={{ marginTop: '-1.5rem' }}>
        <div className="card-modern p-3 mb-4" style={{ maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
          <form action="/" className="d-flex gap-2">
            <input type="text" name="q" className="input-modern" placeholder="Buscar cursos..." defaultValue={q || ''} style={{ border: 'none', background: 'transparent', padding: '.5rem .75rem' }} />
            <button type="submit" className="btn-modern btn-primary-modern" style={{ padding: '.5rem 1rem' }}>
              <i className="bi bi-search"></i>
            </button>
            {q && (
              <a href="/" className="btn-modern btn-outline-modern" style={{ padding: '.5rem 1rem' }}>
                <i className="bi bi-x-lg"></i>
              </a>
            )}
          </form>
        </div>

        <div className="row g-4 pb-5">
          {courses.length === 0 ? (
            <div className="col-12">
              <div className="text-center py-5" style={{ color: 'var(--slate-500)' }}>
                <i className="bi bi-inbox" style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}></i>
                <h5 style={{ fontWeight: 600 }}>{q ? 'No encontramos cursos con ese nombre' : 'Aún no hay cursos disponibles'}</h5>
                {q && <a href="/" className="btn-modern btn-outline-modern mt-3">Ver todos los cursos</a>}
              </div>
            </div>
          ) : (
            courses.map((course: any) => (
              <div className="col-md-6 col-lg-4" key={course._id}>
                <div className="card-modern h-100 d-flex flex-column">
                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <span className="badge-modern mb-2" style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '.6875rem', alignSelf: 'flex-start' }}>
                      {course.profesor?.nombre ? 'Con docente' : 'Disponible'}
                    </span>
                    <h5 className="fw-bold mt-2 mb-2" style={{ color: 'var(--slate-900)' }}>{course.titulo}</h5>
                    <p style={{ color: 'var(--slate-500)', fontSize: '.875rem', lineHeight: 1.5, flexGrow: 1 }}>{course.descripcion}</p>
                    {course.profesor?.nombre && (
                      <div className="d-flex align-items-center gap-2 mt-auto mb-3" style={{ color: 'var(--slate-500)', fontSize: '.8125rem' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="bi bi-person" style={{ fontSize: '.75rem', color: 'var(--slate-500)' }}></i>
                        </div>
                        {course.profesor.nombre}
                      </div>
                    )}
                  </div>
                  <div className="p-4 pt-0 d-flex gap-2">
                    <a href={`/cursos/${course._id}`} className="btn-modern btn-outline-modern flex-grow-1">
                      <i className="bi bi-eye me-1"></i>Detalle
                    </a>
                    <a href={`${PORTAL_URL}/register`} className="btn-modern btn-primary-modern flex-grow-1">
                      <i className="bi bi-plus-circle me-1"></i>Inscribirme
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
