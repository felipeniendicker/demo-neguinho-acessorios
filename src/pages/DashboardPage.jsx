import EmptyState from "../components/EmptyState.jsx";
import MetricCard from "../components/MetricCard.jsx";
import Panel from "../components/Panel.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { Icons } from "../components/icons.jsx";
import { formatCurrency, formatDate } from "../utils/formatters.js";

export default function DashboardPage({ db, analytics, helpers }) {
  const topProducts = analytics.topProducts.slice(0, 4);
  const topServices = analytics.topServices.slice(0, 4);
  const topCustomers = analytics.topCustomers.slice(0, 4);

  return (
    <div className="page-stack">
      <div className="metrics-grid">
        <MetricCard icon={Icons.finance} label="Faturamento diario" value={formatCurrency(analytics.dailyRevenue)} helper="Entradas do dia" />
        <MetricCard icon={Icons.finance} label="Faturamento semanal" value={formatCurrency(analytics.weeklyRevenue)} helper="Entradas na semana" tone="blue" />
        <MetricCard icon={Icons.finance} label="Faturamento mensal" value={formatCurrency(analytics.monthlyRevenue)} helper="Entradas do mes" tone="green" />
        <MetricCard icon={Icons.reports} label="Lucro estimado do mes" value={formatCurrency(analytics.monthlyProfit)} helper="Receitas menos saidas e custos" tone="red" />
        <MetricCard icon={Icons.order} label="Ticket medio" value={formatCurrency(analytics.ticketAverage)} helper="Media das OS finalizadas" tone="blue" />
        <MetricCard icon={Icons.order} label="OS em andamento" value={analytics.ordersInProgress} helper="Produzindo na oficina" />
        <MetricCard icon={Icons.quote} label="Orcamentos em aberto" value={analytics.openQuotes} helper="Aguardando retorno do cliente" tone="blue" />
        <MetricCard icon={Icons.order} label="Servicos finalizados" value={analytics.finishedOrders} helper="Historico com faturamento" tone="green" />
      </div>

      <div className="dashboard-grid">
        <Panel title="Ultimas ordens de servico" description="Acompanhamento operacional em tempo real.">
          {db.orders.length ? (
            <div className="stack-list">
              {db.orders.slice(0, 5).map((order) => (
                <article key={order.id} className="timeline-card">
                  <div>
                    <strong>{order.service}</strong>
                    <p>
                      {helpers.customerName(order.customerId)} · {helpers.bikeName(order.bikeId)}
                    </p>
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

        <Panel title="Ultimos orcamentos" description="Visao comercial para aprovacao e conversao.">
          {db.quotes.length ? (
            <div className="stack-list">
              {db.quotes.slice(0, 5).map((quote) => (
                <article key={quote.id} className="timeline-card">
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

      <div className="dashboard-grid">
        <Panel title="Alertas importantes" description="Pontos que chamam a atencao do cliente na apresentacao.">
          <div className="alert-list">
            {analytics.lowStockProducts.map((item) => (
              <div key={item.id} className="alert-row warning">
                <strong>Estoque baixo</strong>
                <p>
                  {item.name}: {item.quantity} em estoque, minimo recomendado {item.minStock}.
                </p>
              </div>
            ))}
            {!analytics.lowStockProducts.length && (
              <div className="alert-row success">
                <strong>Estoque sob controle</strong>
                <p>Nenhum item critico no momento.</p>
              </div>
            )}
            <div className="alert-row info">
              <strong>Agenda dos proximos dias</strong>
              <p>{analytics.upcomingSchedule} servicos agendados para os proximos 7 dias.</p>
            </div>
            <div className="alert-row info">
              <strong>Clientes ativos</strong>
              <p>{db.customers.length} clientes com historico navegavel e motos vinculadas.</p>
            </div>
          </div>
        </Panel>

        <Panel title="Ranking de vendas e recorrencia" description="Resumo visual para mostrar inteligencia do sistema.">
          <div className="ranking-grid">
            <div>
              <h4>Produtos mais vendidos</h4>
              {topProducts.map((item) => (
                <div key={item.name} className="ranking-row">
                  <span>{item.name}</span>
                  <strong>{item.quantity}</strong>
                </div>
              ))}
            </div>
            <div>
              <h4>Servicos mais vendidos</h4>
              {topServices.map((item) => (
                <div key={item.name} className="ranking-row">
                  <span>{item.name}</span>
                  <strong>{item.quantity}</strong>
                </div>
              ))}
            </div>
            <div>
              <h4>Clientes que mais compram</h4>
              {topCustomers.map((item) => (
                <div key={item.name} className="ranking-row">
                  <span>{item.name}</span>
                  <strong>{formatCurrency(item.amount)}</strong>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
