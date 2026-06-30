import Panel from "../components/Panel.jsx";

const items = [
  "Emissao de Nota Fiscal",
  "SAT",
  "Integracao com fornecedores",
  "Integracao com pagamentos",
  "Backup automatico",
  "Banco de dados em nuvem",
  "Acesso multiusuario",
  "Novas automacoes"
];

export default function IntegrationsPage() {
  return (
    <div className="page-stack">
      <Panel title="Integracoes futuras" description="Recursos preparados para a evolucao comercial do sistema.">
        <div className="integration-grid">
          {items.map((item) => (
            <article key={item} className="integration-card">
              <span className="future-pill">Preparado para evolucao</span>
              <h4>{item}</h4>
              <p>Fluxo mapeado para uma fase futura da plataforma.</p>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}
