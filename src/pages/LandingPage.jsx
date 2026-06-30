import Footer from "../components/Footer.jsx";
import { Icons } from "../components/icons.jsx";

const modules = [
  { title: "Dashboard Gerencial", icon: Icons.dashboard },
  { title: "Clientes e Motos", icon: Icons.customers },
  { title: "Estoque Inteligente", icon: Icons.inventory },
  { title: "Orçamentos com Impressão", icon: Icons.quote },
  { title: "Ordens de Serviço", icon: Icons.order },
  { title: "Financeiro", icon: Icons.finance },
  { title: "Agenda", icon: Icons.agenda },
  { title: "Relatórios", icon: Icons.reports },
  { title: "Catálogo Online", icon: Icons.catalog }
];

export default function LandingPage({ onEnter }) {
  return (
    <div className="public-shell landing-shell">
      <section className="landing-hero">
        <div className="hero-copy">
          <span className="brand-chip">Neguinho Acessórios</span>
          <h1>Neguinho Acessórios</h1>
          <h2>Sistema completo para gestão de oficinas e motopeças.</h2>
          <p>
            Controle clientes, motos, estoque, ordens de serviço, financeiro,
            agenda e acompanhe sua empresa em tempo real.
          </p>
          <button type="button" className="primary-button hero-button" onClick={onEnter}>
            Entrar na Demonstração
          </button>
        </div>

        <div className="hero-panel">
          <div className="hero-panel-head">
            <span className="kicker">Módulos principais</span>
            <strong>Experiência pensada para a rotina da oficina.</strong>
          </div>
          <div className="landing-grid">
            {modules.map((module) => (
              <article key={module.title} className="landing-card">
                <span className="landing-icon">{module.icon}</span>
                <strong>{module.title}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer compact />
    </div>
  );
}
