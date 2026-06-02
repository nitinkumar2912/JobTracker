export const StatCard = ({ icon: Icon, label, value, detail, tone = 'blue' }) => (
  <article className={`stat-card stat-${tone}`}>
    <div className="stat-icon">{Icon ? <Icon size={20} /> : null}</div>
    <div>
      <p>{label}</p>
      <strong>{value}</strong>
      {detail ? <span>{detail}</span> : null}
    </div>
  </article>
);
