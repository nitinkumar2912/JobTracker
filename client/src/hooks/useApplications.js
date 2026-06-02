import { useCallback, useEffect, useState } from 'react';
import { api, getApiError } from '../services/api';

export const useApplications = (filters) => {
  const [applications, setApplications] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== '' && value !== null && value !== undefined)
      );
      const { data } = await api.get('/applications', {
        params
      });
      setApplications(data.applications);
      setMeta({
        page: data.page,
        totalPages: data.totalPages,
        total: data.total
      });
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    meta,
    loading,
    error,
    refetch: fetchApplications
  };
};
