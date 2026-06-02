import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({ title, message, actionLabel, actionTo }) => (
  <div className="empty-state">
    <div className="empty-icon">
      <Plus size={24} />
    </div>
    <h3>{title}</h3>
    <p>{message}</p>
    {actionLabel && actionTo ? (
      <Link className="btn btn-primary" to={actionTo}>
        <Plus size={16} />
        {actionLabel}
      </Link>
    ) : null}
  </div>
);
