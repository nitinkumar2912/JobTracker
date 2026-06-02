import { Link } from 'react-router-dom';

export const NotFound = () => (
  <main className="auth-page">
    <section className="auth-panel">
      <h1>Page not found</h1>
      <p className="muted">The route you opened does not exist.</p>
      <Link className="btn btn-primary full-width" to="/">
        Back to dashboard
      </Link>
    </section>
  </main>
);
