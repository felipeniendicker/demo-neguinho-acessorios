export default function MetricCard({ icon, label, value, helper, tone = "orange" }) {
  return (
    <article className={`metric-card tone-${tone}`}>
      <div className="metric-icon">{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <p>{helper}</p>
      </div>
    </article>
  );
}
