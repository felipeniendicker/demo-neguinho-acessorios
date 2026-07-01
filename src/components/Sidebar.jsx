import { NavLink } from "react-router-dom";

export default function Sidebar({ items, settings, isMobileOpen = false, onClose }) {
  return (
    <>
      <button
        type="button"
        className={`sidebar-backdrop${isMobileOpen ? " is-open" : ""}`}
        onClick={onClose}
        aria-label="Fechar menu"
      />

      <aside className={`sidebar${isMobileOpen ? " is-open" : ""}`}>
        <div className="sidebar-mobile-head">
          <strong>Neguinho Acessorios</strong>
          <button type="button" className="mobile-close-button" onClick={onClose}>
            Fechar
          </button>
        </div>

        <div className="brand">
          <div className="brand-logo brand-logo-text">
            {settings.logoText || "Neguinho Acessorios"}
          </div>
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
              onClick={onClose}
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
          <span className="kicker">Demo comercial</span>
          <strong>Fluxo completo de oficina.</strong>
        </div>
      </aside>
    </>
  );
}
