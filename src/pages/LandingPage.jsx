import Footer from "../components/Footer.jsx";
import { Icons } from "../components/icons.jsx";

const modules = [
  { title: "Dashboard Gerencial", icon: Icons.dashboard },
  { title: "Clientes", icon: Icons.customers },
  { title: "Motos", icon: Icons.bike },
  { title: "Estoque Inteligente", icon: Icons.inventory },
  { title: "PDV", icon: Icons.pdv },
  { title: "Orcamentos", icon: Icons.quote },
  { title: "Ordens de Servico", icon: Icons.order },
  { title: "Agenda", icon: Icons.agenda },
  { title: "Financeiro", icon: Icons.finance },
  { title: "Relatorios", icon: Icons.reports },
  { title: "Catalogo Online", icon: Icons.catalog },
  { title: "Usuarios", icon: Icons.users },
  { title: "Integracoes futuras", icon: Icons.integrations }
];

const highlights = [
  "Dashboard Gerencial",
  "Clientes",
  "Motos",
  "Estoque Inteligente",
  "PDV",
  "Orcamentos",
  "Ordens de Servico",
  "Agenda",
  "Financeiro",
  "Relatorios",
  "Catalogo Online",
  "Usuarios",
  "Integracoes futuras"
];

export default function LandingPage({ onEnter }) {
  return (
    <div className="public-shell landing-shell">
      <section className="landing-hero">
        <div className="hero-copy">
          <span className="brand-chip">Neguinho Acessorios</span>
          <span className="kicker">Demo comercial personalizada</span>
          <h1>Neguinho Acessorios</h1>
          <h2>Sistema completo para oficinas e motopecas.</h2>
          <p>
            Controle clientes, motos, estoque, ordens de servico, PDV, financeiro,
            agenda e acompanhe sua empresa em tempo real.
          </p>

          <div className="hero-callout">
            <strong>Gerencie toda sua oficina em um unico sistema.</strong>
            <p>Uma experiencia comercial pronta para apresentar no computador ou no celular.</p>
          </div>

          <button type="button" className="primary-button hero-button" onClick={onEnter}>
            Entrar na Demonstracao
          </button>
        </div>

        <div className="hero-panel">
          <div className="hero-panel-head">
            <span className="kicker">Sistema completo para oficinas e motopecas</span>
            <strong>Fluxo profissional para atender balcao, oficina e gestao em um so lugar.</strong>
          </div>

          <div className="landing-grid">
            {modules.map((module) => (
              <article key={module.title} className="landing-card">
                <span className="landing-icon">{module.icon}</span>
                <strong>{module.title}</strong>
                <p>Modulo pronto para demonstrar rotina real da oficina.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-feature-band">
        <div className="landing-feature-copy">
          <span className="kicker">Percepcao de valor</span>
          <h3>Uma apresentacao com cara de sistema pronto para operar.</h3>
          <p>
            A demonstracao foi organizada para transmitir controle, agilidade e profissionalismo
            desde o primeiro acesso.
          </p>
        </div>

        <div className="landing-feature-list">
          {highlights.map((item) => (
            <div key={item} className="feature-check">
              <span>+</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>

      <Footer compact />
    </div>
  );
}
