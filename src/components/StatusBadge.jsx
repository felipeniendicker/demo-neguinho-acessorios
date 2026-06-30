export default function StatusBadge({ value }) {
  const slug = String(value || "neutro")
    .toLowerCase()
    .replace(/\s+/g, "-");

  return <span className={`status-badge status-${slug}`}>{value}</span>;
}
