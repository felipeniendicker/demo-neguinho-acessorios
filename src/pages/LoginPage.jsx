import Footer from "../components/Footer.jsx";

const benefits = [
  "Dashboard em tempo real",
  "Gestao completa da oficina",
  "Estoque inteligente",
  "Financeiro",
  "Relatorios",
  "Catalogo Online",
  "Preparado para crescimento"
];

export default function LoginPage({ onLogin }) {
  return (
    <div className="public-shell login-shell">
      <section className="login-layout">
        <div className="login-showcase">
          <div className="wordmark-block">
            <span className="wordmark-badge">Neguinho Acessorios</span>
            <h1>Neguinho Acessorios</h1>
            <p>Bem-vindo ao sistema de gestao.</p>
            <p>Controle toda a oficina em um unico lugar.</p>
          </div>

          <div className="login-highlight-card">
            <strong>Painel pronto para apresentacao comercial</strong>
            <p>Fluxo completo com estoque, PDV, oficina, financeiro e relatorios integrados.</p>
          </div>

          <ul className="benefit-list">
            {benefits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="login-card">
          <div className="login-card-head">
            <span className="kicker">Versao demonstrativa</span>
            <h2>Acessar sistema</h2>
            <p>Simulacao de login para reforcar uma experiencia profissional durante a apresentacao.</p>
          </div>

          <form
            className="login-form"
            onSubmit={(event) => {
              event.preventDefault();
              onLogin();
            }}
          >
            <label>
              Usuario
              <input placeholder="Digite seu usuario" />
            </label>

            <label>
              Senha
              <input type="password" placeholder="Digite sua senha" />
            </label>

            <label className="remember-line">
              <input type="checkbox" />
              <span>Lembrar acesso</span>
            </label>

            <button type="submit" className="primary-button full-button">
              Entrar no Sistema
            </button>
          </form>

          <div className="login-footer-note">
            <strong>Versao Demonstrativa</strong>
            <small>Acesso direto sem validacao real, ideal para navegacao comercial.</small>
          </div>
        </div>
      </section>

      <Footer compact />
    </div>
  );
}
