import EmptyState from "../components/EmptyState.jsx";
import MetricCard from "../components/MetricCard.jsx";
import MobileModuleHeader from "../components/MobileModuleHeader.jsx";
import Panel from "../components/Panel.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { Icons } from "../components/icons.jsx";
import useIsMobile from "../hooks/useIsMobile.js";
import { formatCurrency, formatDate } from "../utils/formatters.js";

export default function DashboardPage({ db, analytics, helpers }) {
  const isMobile = useIsMobile();
  const essentials = [
    { icon: Icons.finance, label: "Faturamento do mes", value: formatCurrency(analytics.monthlyRevenue), helper: "Receita", tone: "green" },
    { icon: Icons.order, label: "OS em andamento", value: analytics.ordersInProgress, helper: "Oficina", tone: "blue" },
    { icon: Icons.inventory, label: "Estoque baixo", value: analytics.lowStockProducts.length, helper: "Alertas", tone: "red" },
    { icon: Icons.quote, label: "Orcamentos abertos", value: analytics.openQuotes, helper: "Comercial", tone: "orange" }
  ];

  const secondary = [
    { icon: Icons.finance, label: "Faturamento diario", value: formatCurrency(analytics.dailyRevenue), helper: "Hoje", tone: "blue" },
    { icon: Icons.finance, label: "Faturamento semanal", value: formatCurrency(analytics.weeklyRevenue), helper: "Semana", tone: "green" },
    { icon: Icons.reports, label: "Lucro estimado", value: formatCurrency(analytics.monthlyProfit), helper: "Mes", tone: "red" },
    { icon: Icons.order, label: "Ticket medio", value: formatCurrency(analytics.ticketAverage), helper: "OS finalizadas", tone: "blue" }
  ];

  return (
    <div className="page-stack">
      <MobileModuleHeader title="Dashboard" subtitle="Resumo rapido da oficina." />

      {!isMobile && (
        <section className="dashboard-hero">
          <div className="dashboard-hero-copy">
            <span className="kicker">Visao executiva</span>
            <h3>Painel gerencial pronto para impressionar durante a demonstracao.</h3>
            <p>Acompanhamento instantaneo de faturamento, producao da oficina, estoque e comportamento comercial.</p>
          </div>

          <div className="dashboard-hero-strip">
            <div className="hero-stat"><span>Clientes ativos</span><strong>{db.customers.length}</strong></div>
            <div className="hero-stat"><span>Motos cadastradas</span><strong>{db.bikes.length}</strong></div>
            <div className="hero-stat"><span>Itens no estoque</span><strong>{db.inventory.length}</strong></div>
            <div className="hero-stat"><span>Vendas registradas</span><strong>{db.sales.length}</strong></div>
          </div>
        </section>
      )}

      <div className="metrics-grid mobile-essential-metrics">
        {essentials.map((item) => (
          <MetricCard key={item.label} icon={item.icon} label={item.label} value={item.value} helper={item.helper} tone={item.tone} />
        ))}
      </div>

      {!isMobile && (
        <div className="metrics-grid compact">
          {secondary.map((item) => (
            <MetricCard key={item.label} icon={item.icon} label={item.label} value={item.value} helper={item.helper} tone={item.tone} />
          ))}
        </div>
      )}

      <div className="dashboard-grid">
        <Panel title="Ultimas OS" description={isMobile ? "Ordens recentes" : "Acompanhamento operacional em tempo real."}>
          {db.orders.length ? (
            <div className="stack-list">
              {db.orders.slice(0, 4).map((order) => (
                <article key={order.id} className="timeline-card premium">
                  <div>
                    <strong>{order.service}</strong>
                    <p>{helpers.customerName(order.customerId)} - {helpers.bikeName(order.bikeId)}</p>
                    <small>{formatDate(order.entryDate)}</small>
                  </div>
                  <div className="timeline-side">
                    <StatusBadge value={order.status} />
                    <strong>{formatCurrency(order.total)}</strong>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="Sem OS" description="Cadastre ordens para alimentar o painel." />
          )}
        </Panel>

        <Panel title="Ultimos orcamentos" description={isMobile ? "Propostas recentes" : "Visao comercial para aprovacao e conversao."}>
          {db.quotes.length ? (
            <div className="stack-list">
              {db.quotes.slice(0, 4).map((quote) => (
                <article key={quote.id} className="timeline-card premium">
                  <div>
                    <strong>{helpers.customerName(quote.customerId)}</strong>
                    <p>{quote.serviceDescription}</p>
                    <small>Validade: {formatDate(quote.validUntil)}</small>
                  </div>
                  <div className="timeline-side">
                    <StatusBadge value={quote.status} />
                    <strong>{formatCurrency(quote.total)}</strong>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="Sem orcamentos" description="Monte orcamentos para demonstrar a proposta." />
          )}
        </Panel>
      </div>
    </div>
  );
}
