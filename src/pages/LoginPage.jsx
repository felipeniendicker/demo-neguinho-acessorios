import Footer from "../components/Footer.jsx";

export default function LoginPage({ onLogin }) {
  return (
    <div className="public-shell login-shell">
      <section className="login-layout">
        <div className="login-showcase">
          <div className="wordmark-block">
            <span className="wordmark-badge">Neguinho Acessórios</span>
            <h1>Neguinho Acessórios</h1>
            <p>Bem-vindo ao sistema de gestão.</p>
            <p>Controle toda a oficina em um único lugar.</p>
          </div>

          <ul className="benefit-list">
            <li>Dashboard em tempo real</li>
            <li>Gestão completa da oficina</li>
            <li>Estoque inteligente</li>
            <li>Financeiro</li>
            <li>Relatórios</li>
            <li>Catálogo Online</li>
            <li>Preparado para crescimento</li>
          </ul>
        </div>

        <div className="login-card">
          <div>
            <span className="kicker">Versão demonstrativa</span>
            <h2>Acessar sistema</h2>
            <p>Simulação de login para a apresentação comercial.</p>
          </div>

          <form
            className="login-form"
            onSubmit={(event) => {
              event.preventDefault();
              onLogin();
            }}
          >
            <label>
              Usuário
              <input placeholder="Digite seu usuário" />
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

          <small>Versão Demonstrativa</small>
        </div>
      </section>

      <Footer compact />
    </div>
  );
}
