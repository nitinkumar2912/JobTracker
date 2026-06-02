import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ page, totalPages, total, onPageChange }) => (
  <div className="pagination">
    <span>
      Page {page} of {totalPages} · {total} total
    </span>
    <div>
      <button className="icon-btn" type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page">
        <ChevronLeft size={18} />
      </button>
      <button
        className="icon-btn"
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  </div>
);
