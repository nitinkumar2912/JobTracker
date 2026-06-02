import { Download, RotateCcw, Search } from 'lucide-react';
import { APPLICATION_STATUSES, JOB_SOURCES, PRIORITIES, SORT_OPTIONS } from '../utils/constants';

export const FilterBar = ({ filters, onChange, onClear, onExport }) => {
  const update = (field, value) => {
    onChange({
      ...filters,
      [field]: value,
      page: 1
    });
  };

  return (
    <section className="filter-bar" aria-label="Application filters">
      <div className="search-field">
        <Search size={18} />
        <label className="sr-only" htmlFor="search">
          Search by company or role
        </label>
        <input
          id="search"
          value={filters.search}
          onChange={(event) => update('search', event.target.value)}
          placeholder="Search company or role"
        />
      </div>

      <label>
        Status
        <select value={filters.status} onChange={(event) => update('status', event.target.value)}>
          <option value="">All statuses</option>
          {APPLICATION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      <label>
        Source
        <select value={filters.source} onChange={(event) => update('source', event.target.value)}>
          <option value="">All sources</option>
          {JOB_SOURCES.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>
      </label>

      <label>
        Priority
        <select value={filters.priority} onChange={(event) => update('priority', event.target.value)}>
          <option value="">All priorities</option>
          {PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
      </label>

      <label>
        From
        <input type="date" value={filters.from} onChange={(event) => update('from', event.target.value)} />
      </label>

      <label>
        To
        <input type="date" value={filters.to} onChange={(event) => update('to', event.target.value)} />
      </label>

      <label>
        Sort
        <select value={filters.sort} onChange={(event) => update('sort', event.target.value)}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className="filter-actions">
        <button className="btn btn-secondary" type="button" onClick={onClear}>
          <RotateCcw size={16} />
          Clear
        </button>
        <button className="btn btn-secondary" type="button" onClick={onExport}>
          <Download size={16} />
          CSV
        </button>
      </div>
    </section>
  );
};
