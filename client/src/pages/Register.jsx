import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { BriefcaseBusiness } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getApiError } from '../services/api';

export const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    headline: 'Software engineering candidate',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/" replace />;

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created');
      navigate('/', { replace: true });
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="brand auth-brand">
          <div className="brand-mark">
            <BriefcaseBusiness size={20} />
          </div>
          <div>
            <strong>JobTrackr</strong>
            <span>Application pipeline</span>
          </div>
        </div>
        <h1>Create account</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input value={form.name} onChange={(event) => update('name', event.target.value)} required />
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={form.password} onChange={(event) => update('password', event.target.value)} minLength="8" required />
          </label>
          <label>
            Headline
            <input value={form.headline} onChange={(event) => update('headline', event.target.value)} />
          </label>
          <label>
            Location
            <input value={form.location} onChange={(event) => update('location', event.target.value)} />
          </label>
          <button className="btn btn-primary full-width" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
};
