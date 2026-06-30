import { NavLink } from "react-router-dom";

export default function Sidebar({ items, settings }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo brand-logo-text">{settings.logoText || "Neguinho Acessórios"}</div>
        <div>
          <h1>{settings.shopName}</h1>
          <p>Sistema demonstrativo personalizado</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
          >
            <span className="icon-wrap">{item.icon}</span>
            <span>
              <strong>{item.label}</strong>
              <small>{item.caption}</small>
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-card">
        <span className="kicker">Pronto para apresentar</span>
        <strong>Fluxo completo de oficina, estoque, financeiro e relatórios.</strong>
      </div>
    </aside>
  );
}
