import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, CalendarClock, CheckCircle2, CircleX, Clock3, Layers3, Target, Trophy } from 'lucide-react';
import { api, getApiError } from '../services/api';
import { CHART_COLORS } from '../utils/constants';
import { formatDate, formatShortDate, isOverdue } from '../utils/formatters';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';

export const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const { data } = await api.get('/analytics/summary');
        setSummary(data.summary);
      } catch (err) {
        setError(getApiError(err));
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  if (loading) return <LoadingSkeleton rows={6} />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!summary?.total) {
    return (
      <EmptyState
        title="No applications yet"
        message="Add your first role to start tracking follow-ups, status movement, and analytics."
        actionLabel="Add application"
        actionTo="/applications/new"
      />
    );
  }

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Job search command center</h1>
        </div>
        <Link className="btn btn-primary" to="/applications/new">
          Add application
        </Link>
      </div>

      <section className="stats-grid">
        <StatCard icon={Layers3} label="Total applications" value={summary.total} detail={`${summary.thisMonth} this month`} />
        <StatCard icon={Target} label="In interview loop" value={summary.interviews} tone="amber" detail="OA through final round" />
        <StatCard icon={Trophy} label="Offers" value={summary.offers} tone="green" detail="Active wins" />
        <StatCard icon={CircleX} label="Rejections" value={summary.rejections} tone="red" detail="Learning archive" />
        <StatCard icon={CalendarClock} label="Due soon" value={summary.dueSoon} tone="purple" detail="Next 7 days" />
        <StatCard icon={AlertTriangle} label="Overdue" value={summary.overdue} tone="red" detail="Needs action" />
      </section>

      <section className="dashboard-grid">
        <div className="surface chart-surface">
          <div className="section-title">
            <h2>Status distribution</h2>
            <span>{summary.total} tracked</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={summary.byStatus.filter((item) => item.value > 0)}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} interval={0} angle={-25} textAnchor="end" height={90} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'rgba(37, 99, 235, 0.08)' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="surface chart-surface">
          <div className="section-title">
            <h2>Outcome ratio</h2>
            <span>Offer vs rejection</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Offers', value: summary.offers },
                  { name: 'Rejections', value: summary.rejections }
                ]}
                innerRadius={64}
                outerRadius={92}
                dataKey="value"
                paddingAngle={4}
              >
                {[summary.offers, summary.rejections].map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="surface">
          <div className="section-title">
            <h2>Follow-ups</h2>
            <Link to="/applications?sort=followUpDate">View all</Link>
          </div>
          <div className="followup-list">
            {summary.followUps.map((item) => (
              <Link className={`followup-item ${isOverdue(item.followUpDate) ? 'danger' : ''}`} to={`/applications/${item._id}`} key={item._id}>
                <Clock3 size={18} />
                <div>
                  <strong>{item.company}</strong>
                  <span>{item.role}</span>
                </div>
                <div>
                  <StatusBadge status={item.status} />
                  <span>{formatShortDate(item.followUpDate)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="surface">
          <div className="section-title">
            <h2>Recent activity</h2>
            <CheckCircle2 size={18} />
          </div>
          <div className="activity-feed">
            {summary.recentActivity.map((activity) => (
              <div className="activity-item" key={activity._id}>
                <span />
                <div>
                  <strong>{activity.message}</strong>
                  <p>{formatDate(activity.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
