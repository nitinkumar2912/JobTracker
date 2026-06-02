import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ApplicationForm } from '../components/ApplicationForm';
import { api, getApiError } from '../services/api';

export const ApplicationCreate = () => {
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      const { data } = await api.post('/applications', payload);
      toast.success('Application added');
      navigate(`/applications/${data.application._id}`);
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-stack">
      <Link className="back-link" to="/applications">
        <ArrowLeft size={16} />
        Applications
      </Link>
      <div className="page-header">
        <div>
          <p className="eyebrow">New application</p>
          <h1>Add opportunity</h1>
        </div>
      </div>
      <ApplicationForm onSubmit={handleSubmit} submitLabel="Create application" isSubmitting={saving} />
    </div>
  );
};
