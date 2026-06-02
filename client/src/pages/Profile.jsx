import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getApiError } from '../services/api';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: '',
    headline: '',
    location: '',
    portfolioUrl: '',
    linkedInUrl: '',
    githubUrl: '',
    resumeUrl: '',
    targetRoles: '',
    preferredLocations: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || '',
      headline: user.headline || '',
      location: user.location || '',
      portfolioUrl: user.portfolioUrl || '',
      linkedInUrl: user.linkedInUrl || '',
      githubUrl: user.githubUrl || '',
      resumeUrl: user.resumeUrl || '',
      targetRoles: user.targetRoles?.join(', ') || '',
      preferredLocations: user.preferredLocations?.join(', ') || ''
    });
  }, [user]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        ...form,
        targetRoles: form.targetRoles.split(',').map((item) => item.trim()).filter(Boolean),
        preferredLocations: form.preferredLocations.split(',').map((item) => item.trim()).filter(Boolean)
      });
      toast.success('Profile updated');
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Profile</p>
          <h1>Candidate profile</h1>
        </div>
      </div>

      <form className="surface profile-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Name
            <input value={form.name} onChange={(event) => update('name', event.target.value)} required />
          </label>
          <label>
            Headline
            <input value={form.headline} onChange={(event) => update('headline', event.target.value)} />
          </label>
          <label>
            Location
            <input value={form.location} onChange={(event) => update('location', event.target.value)} />
          </label>
          <label>
            Portfolio URL
            <input type="url" value={form.portfolioUrl} onChange={(event) => update('portfolioUrl', event.target.value)} />
          </label>
          <label>
            LinkedIn URL
            <input type="url" value={form.linkedInUrl} onChange={(event) => update('linkedInUrl', event.target.value)} />
          </label>
          <label>
            GitHub URL
            <input type="url" value={form.githubUrl} onChange={(event) => update('githubUrl', event.target.value)} />
          </label>
          <label>
            Resume URL
            <input type="url" value={form.resumeUrl} onChange={(event) => update('resumeUrl', event.target.value)} />
          </label>
          <label>
            Target roles
            <input value={form.targetRoles} onChange={(event) => update('targetRoles', event.target.value)} placeholder="Frontend Engineer, SDE Intern" />
          </label>
          <label>
            Preferred locations
            <input value={form.preferredLocations} onChange={(event) => update('preferredLocations', event.target.value)} placeholder="Remote, Bengaluru" />
          </label>
        </div>
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save profile'}
        </button>
      </form>
    </div>
  );
};
