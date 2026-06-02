import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { ApplicationCard } from '../components/ApplicationCard';
import { EmptyState } from '../components/EmptyState';
import { FilterBar } from '../components/FilterBar';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Pagination } from '../components/Pagination';
import { downloadCsv } from '../services/api';
import { useApplications } from '../hooks/useApplications';

const defaultFilters = {
  search: '',
  status: '',
  source: '',
  priority: '',
  from: '',
  to: '',
  sort: 'newest',
  page: 1,
  limit: 10
};

export const Applications = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    ...defaultFilters,
    sort: searchParams.get('sort') || defaultFilters.sort
  });
  const queryFilters = useMemo(() => filters, [filters]);
  const { applications, meta, loading, error } = useApplications(queryFilters);

  const handleExport = () => {
    toast.promise(downloadCsv(), {
      loading: 'Exporting CSV...',
      success: 'CSV exported',
      error: 'CSV export failed'
    });
  };

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Applications</p>
          <h1>Pipeline database</h1>
        </div>
        <Link className="btn btn-primary" to="/applications/new">
          <Plus size={16} />
          New application
        </Link>
      </div>

      <FilterBar filters={filters} onChange={setFilters} onClear={() => setFilters(defaultFilters)} onExport={handleExport} />

      {error ? <div className="alert alert-danger">{error}</div> : null}
      {loading ? <LoadingSkeleton rows={6} /> : null}

      {!loading && applications.length === 0 ? (
        <EmptyState title="No matching applications" message="Try clearing filters or add a new opportunity to your pipeline." actionLabel="Add application" actionTo="/applications/new" />
      ) : null}

      {!loading && applications.length > 0 ? (
        <section className="application-list" aria-label="Applications">
          {applications.map((application) => (
            <ApplicationCard application={application} key={application._id} />
          ))}
        </section>
      ) : null}

      {!loading && meta.totalPages > 1 ? (
        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          total={meta.total}
          onPageChange={(page) => setFilters((current) => ({ ...current, page }))}
        />
      ) : null}
    </div>
  );
};
