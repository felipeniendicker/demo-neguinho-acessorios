export default function EmptyState({ title, description }) {
  return (
    <div className="empty-state">
      <span className="empty-pill">Sem dados</span>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
}
