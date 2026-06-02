import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { api, getApiError } from '../services/api';
import { CHART_COLORS } from '../utils/constants';

const ChartSurface = ({ title, caption, children }) => (
  <section className="surface chart-surface">
    <div className="section-title">
      <h2>{title}</h2>
      <span>{caption}</span>
    </div>
    {children}
  </section>
);

export const Analytics = () => {
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/analytics/trends');
        setTrends(data.trends);
      } catch (err) {
        setError(getApiError(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSkeleton rows={6} />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Analytics</p>
          <h1>Search intelligence</h1>
        </div>
      </div>

      <section className="analytics-grid">
        <ChartSurface title="Applications by month" caption="Last 6 months">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trends.monthlyApplications}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartSurface>

        <ChartSurface title="Source breakdown" caption="Where roles are found">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={trends.sourceBreakdown.filter((item) => item.value > 0)}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'rgba(20, 184, 166, 0.08)' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#14b8a6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartSurface>

        <ChartSurface title="Status distribution" caption="Pipeline shape">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={trends.statusDistribution.filter((item) => item.value > 0)} dataKey="value" innerRadius={70} outerRadius={105} paddingAngle={3}>
                {trends.statusDistribution.map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartSurface>

        <ChartSurface title="Priority mix" caption="Effort focus">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trends.priorityBreakdown.filter((item) => item.value > 0)}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {trends.priorityBreakdown.map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartSurface>
      </section>
    </div>
  );
};
