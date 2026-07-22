import type { Metadata } from "next";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./globals.css";

export const metadata: Metadata = {
  title: "Catálogo de Cursos - ISIL",
  description: "Explora nuestro catálogo de cursos especializados y potencia tu carrera profesional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: '#f8fafc', minHeight: '100vh' }}>
        <nav className="navbar-modern">
          <div className="container d-flex align-items-center justify-content-between">
            <span className="fw-bold" style={{ fontSize: '1.1rem', color: 'var(--slate-900)' }}>
              <i className="bi bi-book-fill me-2" style={{ color: 'var(--primary)' }}></i>ISIL Cursos
            </span>
            <div className="d-flex align-items-center gap-3">
              <a href="/" className="btn-modern btn-outline-modern" style={{ padding: '.375rem .875rem', fontSize: '.8125rem' }}>
                <i className="bi bi-grid me-1"></i>Catálogo
              </a>
            </div>
          </div>
        </nav>
        {children}
        <footer className="text-center py-4" style={{ color: 'var(--slate-500)', fontSize: '.8125rem', borderTop: '1px solid var(--slate-200)', marginTop: '3rem' }}>
          <div className="container">
            &copy; {new Date().getFullYear()} ISIL — Programación Web Avanzada. Todos los derechos reservados.
          </div>
        </footer>
      </body>
    </html>
  );
}
