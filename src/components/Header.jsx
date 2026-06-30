import { formatDate } from "../utils/formatters.js";

export default function Header({ title, subtitle, actions }) {
  return (
    <header className="header">
      <div>
        <span className="kicker">Neguinho Acessórios</span>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <div className="header-actions">
        <div className="date-chip">
          <span>Hoje</span>
          <strong>{formatDate(new Date().toISOString().slice(0, 10))}</strong>
        </div>
        {actions}
      </div>
    </header>
  );
}
