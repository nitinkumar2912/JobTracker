import { CalendarClock, ExternalLink, MapPin, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrencyRange, formatDate, isOverdue } from '../utils/formatters';
import { PriorityBadge, StatusBadge } from './StatusBadge';

export const ApplicationCard = ({ application }) => (
  <article className={`application-row ${isOverdue(application.followUpDate) ? 'is-overdue' : ''}`}>
    <div className="application-main">
      <div>
        <Link to={`/applications/${application._id}`} className="application-title">
          {application.role}
        </Link>
        <p>{application.company}</p>
      </div>
      <div className="application-meta">
        <span>
          <MapPin size={14} />
          {application.location || application.workMode}
        </span>
        <span>{formatCurrencyRange(application)}</span>
      </div>
    </div>

    <div className="application-badges">
      <StatusBadge status={application.status} />
      <PriorityBadge priority={application.priority} />
      <span className="source-pill">{application.source}</span>
    </div>

    <div className="application-dates">
      <span>Applied {formatDate(application.appliedDate, 'Not applied')}</span>
      <strong>
        <CalendarClock size={14} />
        {formatDate(application.followUpDate, 'No follow-up')}
      </strong>
    </div>

    <div className="row-actions">
      {application.jobUrl ? (
        <a className="icon-btn" href={application.jobUrl} target="_blank" rel="noreferrer" aria-label="Open job post">
          <ExternalLink size={17} />
        </a>
      ) : null}
      <Link className="icon-btn" to={`/applications/${application._id}/edit`} aria-label="Edit application">
        <Pencil size={17} />
      </Link>
    </div>
  </article>
);
