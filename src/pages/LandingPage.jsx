import Footer from "../components/Footer.jsx";

const highlights = ["PDV", "Estoque", "OS", "Financeiro", "Relatorios"];

export default function LandingPage({ onEnter }) {
  return (
    <div className="public-shell landing-shell">
      <section className="landing-minimal">
        <span className="brand-chip">Neguinho Acessorios</span>
        <h1>Neguinho Acessorios</h1>
        <h2>Sistema completo para oficinas e motopecas</h2>
        <p>
          Controle clientes, motos, estoque, PDV, ordens de servico, financeiro e
          agenda em um unico sistema.
        </p>

        <div className="landing-mini-list">
          {highlights.map((item) => (
            <span key={item} className="landing-mini-pill">{item}</span>
          ))}
        </div>

        <button type="button" className="primary-button hero-button" onClick={onEnter}>
          Entrar na demonstracao
        </button>
      </section>

      <Footer compact />
    </div>
  );
}
