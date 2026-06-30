import Panel from "../components/Panel.jsx";
import { formatCurrency } from "../utils/formatters.js";

export default function ReportsPage({ analytics, onExport }) {
  return (
    <div className="page-stack">
      <Panel
        title="Relatorios avancados"
        description="Resumo financeiro, pecas, servicos e evolucao mensal."
        action={<button type="button" className="primary-button" onClick={onExport}>Exportar relatorio</button>}
      >
        <div className="report-grid">
          <article className="report-card">
            <h4>Financeiro detalhado</h4>
            <p>Fluxo de caixa atual: {formatCurrency(analytics.cashFlow)}</p>
            <p>Lucro do mes: {formatCurrency(analytics.monthlyProfit)}</p>
          </article>
          <article className="report-card">
            <h4>Lucro por servico</h4>
            {analytics.topServices.slice(0, 4).map((item) => (
              <div key={item.name} className="report-row">
                <span>{item.name}</span>
                <strong>{item.quantity}x</strong>
              </div>
            ))}
          </article>
          <article className="report-card">
            <h4>Pecas mais utilizadas</h4>
            {analytics.topProducts.slice(0, 5).map((item) => (
              <div key={item.name} className="report-row">
                <span>{item.name}</span>
                <strong>{item.quantity}</strong>
              </div>
            ))}
          </article>
          <article className="report-card">
            <h4>OS por status</h4>
            {Object.entries(analytics.orderStatus).map(([label, value]) => (
              <div key={label} className="report-row">
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </article>
          <article className="report-card">
            <h4>Orcamentos por status</h4>
            {Object.entries(analytics.quoteStatus).map(([label, value]) => (
              <div key={label} className="report-row">
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </article>
          <article className="report-card">
            <h4>Clientes que mais compram</h4>
            {analytics.topCustomers.slice(0, 5).map((item) => (
              <div key={item.name} className="report-row">
                <span>{item.name}</span>
                <strong>{formatCurrency(item.amount)}</strong>
              </div>
            ))}
          </article>
        </div>
      </Panel>
    </div>
  );
}
