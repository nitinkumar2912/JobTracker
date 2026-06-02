import { PRIORITY_COLORS, STATUS_COLORS } from '../utils/constants';

export const StatusBadge = ({ status }) => {
  const tone = STATUS_COLORS[status] || 'neutral';
  return <span className={`badge badge-${tone}`}>{status}</span>;
};

export const PriorityBadge = ({ priority }) => {
  const tone = PRIORITY_COLORS[priority] || 'neutral';
  return <span className={`badge badge-${tone}`}>{priority}</span>;
};
