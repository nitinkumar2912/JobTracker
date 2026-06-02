import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ApplicationForm } from '../components/ApplicationForm';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { api, getApiError } from '../services/api';

export const ApplicationEdit = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/applications/${id}`);
        setApplication(data.application);
      } catch (error) {
        toast.error(getApiError(error));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      await api.patch(`/applications/${id}`, payload);
      toast.success('Application updated');
      navigate(`/applications/${id}`);
    } catch (error) {
      toast.error(getApiError(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSkeleton rows={6} />;

  return (
    <div className="page-stack">
      <Link className="back-link" to={`/applications/${id}`}>
        <ArrowLeft size={16} />
        Application details
      </Link>
      <div className="page-header">
        <div>
          <p className="eyebrow">Edit application</p>
          <h1>{application?.company}</h1>
        </div>
      </div>
      <ApplicationForm initialData={application} onSubmit={handleSubmit} submitLabel="Save changes" isSubmitting={saving} />
    </div>
  );
};
