import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bell, CalendarClock, CheckCircle2, ExternalLink, Mail, Pencil, Plus, Trash2 } from 'lucide-react';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { PriorityBadge, StatusBadge } from '../components/StatusBadge';
import { api, getApiError } from '../services/api';
import { formatCurrencyRange, formatDate, isOverdue } from '../utils/formatters';

const DetailItem = ({ label, value }) => (
  <div className="detail-item">
    <span>{label}</span>
    <strong>{value || 'Not set'}</strong>
  </div>
);

export const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState({ title: '', type: 'Interview', summary: '', outcome: '' });
  const [task, setTask] = useState({ label: '', dueDate: '' });

  const loadApplication = async () => {
    const { data } = await api.get(`/applications/${id}`);
    setApplication(data.application);
    setActivity(data.activity);
  };

  useEffect(() => {
    const load = async () => {
      try {
        await loadApplication();
      } catch (error) {
        toast.error(getApiError(error));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await api.delete(`/applications/${id}`);
      toast.success('Application deleted');
      navigate('/applications');
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const handleNoteSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post(`/applications/${id}/notes`, note);
      setApplication(data.application);
      setNote({ title: '', type: 'Interview', summary: '', outcome: '' });
      await loadApplication();
      toast.success('Interview note added');
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const handleTaskSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post(`/applications/${id}/tasks`, task);
      setApplication(data.application);
      setTask({ label: '', dueDate: '' });
      await loadApplication();
      toast.success('Task added');
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const toggleTask = async (taskId, done) => {
    try {
      const { data } = await api.patch(`/applications/${id}/tasks/${taskId}`, { done: !done });
      setApplication(data.application);
      await loadApplication();
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  const mockReminder = async () => {
    try {
      await api.post(`/applications/${id}/reminder/mock`, { channel: 'email' });
      await loadApplication();
      toast.success('Mock reminder queued');
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  if (loading) return <LoadingSkeleton rows={6} />;
  if (!application) return <div className="alert alert-danger">Application not found</div>;

  return (
    <div className="page-stack">
      <Link className="back-link" to="/applications">
        <ArrowLeft size={16} />
        Applications
      </Link>

      <div className="detail-hero">
        <div>
          <p className="eyebrow">{application.company}</p>
          <h1>{application.role}</h1>
          <div className="hero-badges">
            <StatusBadge status={application.status} />
            <PriorityBadge priority={application.priority} />
            <span className="source-pill">{application.source}</span>
          </div>
        </div>
        <div className="detail-actions">
          {application.jobUrl ? (
            <a className="btn btn-secondary" href={application.jobUrl} target="_blank" rel="noreferrer">
              <ExternalLink size={16} />
              Job post
            </a>
          ) : null}
          <Link className="btn btn-secondary" to={`/applications/${id}/edit`}>
            <Pencil size={16} />
            Edit
          </Link>
          <button className="btn btn-danger" type="button" onClick={handleDelete}>
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {isOverdue(application.followUpDate) ? (
        <div className="alert alert-warning">
          <CalendarClock size={18} />
          Follow-up was due on {formatDate(application.followUpDate)}.
        </div>
      ) : null}

      <section className="surface detail-grid">
        <DetailItem label="Location" value={application.location || application.workMode} />
        <DetailItem label="Work mode" value={application.workMode} />
        <DetailItem label="Employment type" value={application.employmentType} />
        <DetailItem label="Salary" value={formatCurrencyRange(application)} />
        <DetailItem label="Applied date" value={formatDate(application.appliedDate, 'Not applied')} />
        <DetailItem label="Follow-up date" value={formatDate(application.followUpDate)} />
        <DetailItem label="Resume version" value={application.resumeVersion} />
        <DetailItem label="Cover letter" value={application.coverLetterUsed ? 'Yes' : 'No'} />
      </section>

      <section className="detail-columns">
        <div className="surface">
          <div className="section-title">
            <h2>Recruiter</h2>
            <Mail size={18} />
          </div>
          <div className="detail-grid compact">
            <DetailItem label="Name" value={application.contact?.name} />
            <DetailItem label="Email" value={application.contact?.email} />
            <DetailItem label="LinkedIn or phone" value={application.contact?.linkedInOrPhone} />
          </div>
        </div>

        <div className="surface">
          <div className="section-title">
            <h2>Tags</h2>
            <span>{application.tags?.length || 0}</span>
          </div>
          <div className="tag-list">
            {application.tags?.length ? application.tags.map((tag) => <span key={tag}>{tag}</span>) : <p>No tags added.</p>}
          </div>
        </div>
      </section>

      <section className="detail-columns">
        <div className="surface">
          <div className="section-title">
            <h2>Notes</h2>
          </div>
          <p className="long-text">{application.notes || 'No notes yet.'}</p>
        </div>

        <div className="surface">
          <div className="section-title">
            <h2>Tasks</h2>
            <button className="btn btn-secondary" type="button" onClick={mockReminder}>
              <Bell size={16} />
              Mock reminder
            </button>
          </div>
          <form className="inline-form" onSubmit={handleTaskSubmit}>
            <input
              value={task.label}
              onChange={(event) => setTask((current) => ({ ...current, label: event.target.value }))}
              placeholder="Add follow-up task"
              required
            />
            <input type="date" value={task.dueDate} onChange={(event) => setTask((current) => ({ ...current, dueDate: event.target.value }))} />
            <button className="icon-btn" type="submit" aria-label="Add task">
              <Plus size={18} />
            </button>
          </form>
          <div className="task-list">
            {application.tasks?.map((item) => (
              <button className={`task-item ${item.done ? 'done' : ''}`} type="button" key={item._id} onClick={() => toggleTask(item._id, item.done)}>
                <CheckCircle2 size={18} />
                <span>{item.label}</span>
                <small>{formatDate(item.dueDate, '')}</small>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="detail-columns">
        <div className="surface">
          <div className="section-title">
            <h2>Interview notes</h2>
          </div>
          <form className="note-form" onSubmit={handleNoteSubmit}>
            <div className="form-grid two">
              <label>
                Title
                <input value={note.title} onChange={(event) => setNote((current) => ({ ...current, title: event.target.value }))} required />
              </label>
              <label>
                Type
                <input value={note.type} onChange={(event) => setNote((current) => ({ ...current, type: event.target.value }))} />
              </label>
            </div>
            <label>
              Summary
              <textarea value={note.summary} onChange={(event) => setNote((current) => ({ ...current, summary: event.target.value }))} rows="4" required />
            </label>
            <label>
              Outcome
              <input value={note.outcome} onChange={(event) => setNote((current) => ({ ...current, outcome: event.target.value }))} />
            </label>
            <button className="btn btn-primary" type="submit">
              Add note
            </button>
          </form>
          <div className="note-list">
            {application.interviewNotes?.map((item) => (
              <article key={item._id}>
                <div>
                  <strong>{item.title}</strong>
                  <span>{formatDate(item.date)}</span>
                </div>
                <p>{item.summary}</p>
                {item.outcome ? <small>{item.outcome}</small> : null}
              </article>
            ))}
          </div>
        </div>

        <div className="surface">
          <div className="section-title">
            <h2>Timeline</h2>
          </div>
          <div className="activity-feed">
            {activity.map((item) => (
              <div className="activity-item" key={item._id}>
                <span />
                <div>
                  <strong>{item.message}</strong>
                  <p>{formatDate(item.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
