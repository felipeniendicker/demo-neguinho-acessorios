import { useMemo, useState } from "react";
import DataTable from "../components/DataTable.jsx";
import EmptyState from "../components/EmptyState.jsx";
import MetricCard from "../components/MetricCard.jsx";
import Panel from "../components/Panel.jsx";
import { Icons } from "../components/icons.jsx";
import { currentMonth, formatCurrency, formatDate, monthKey, sumBy } from "../utils/formatters.js";

const blank = {
  id: "",
  date: new Date().toISOString().slice(0, 10),
  type: "entrada",
  category: "",
  description: "",
  amount: "0",
  status: "Pago"
};

export default function FinancePage({ db, onSave }) {
  const [form, setForm] = useState(blank);
  const [period, setPeriod] = useState(currentMonth());

  const filtered = useMemo(
    () => db.finance.filter((item) => monthKey(item.date) === period),
    [db.finance, period]
  );

  const entradas = filtered.filter((item) => item.type === "entrada");
  const saidas = filtered.filter((item) => item.type === "saida");
  const totalEntradas = sumBy(entradas, (item) => item.amount);
  const totalSaidas = sumBy(saidas, (item) => item.amount);
  const fluxo = totalEntradas - totalSaidas;
  const ticket = db.orders.filter((item) => item.status === "Finalizado").length
    ? totalEntradas / Math.max(db.orders.filter((item) => item.status === "Finalizado").length, 1)
    : 0;

  function submit(event) {
    event.preventDefault();
    onSave(form);
    setForm(blank);
  }

  return (
    <div className="page-stack">
      <Panel title="Lancamento manual" description="Entradas, saidas, contas a pagar e a receber.">
        <form className="form-grid" onSubmit={submit}>
          <label>Data<input type="date" value={form.date} onChange={(e) => setForm((c) => ({ ...c, date: e.target.value }))} required /></label>
          <label>Tipo
            <select value={form.type} onChange={(e) => setForm((c) => ({ ...c, type: e.target.value }))}>
              <option value="entrada">Entrada</option>
              <option value="saida">Saida</option>
            </select>
          </label>
          <label>Categoria<input value={form.category} onChange={(e) => setForm((c) => ({ ...c, category: e.target.value }))} required /></label>
          <label>Status
            <select value={form.status} onChange={(e) => setForm((c) => ({ ...c, status: e.target.value }))}>
              <option>Pago</option>
              <option>Receber</option>
              <option>Pagar</option>
            </select>
          </label>
          <label className="wide">Descricao<input value={form.description} onChange={(e) => setForm((c) => ({ ...c, description: e.target.value }))} required /></label>
          <label>Valor<input type="number" step="0.01" value={form.amount} onChange={(e) => setForm((c) => ({ ...c, amount: e.target.value }))} required /></label>
          <div className="actions wide">
            <button type="submit" className="primary-button">Salvar movimentacao</button>
          </div>
        </form>
      </Panel>

      <Panel
        title="Resumo financeiro"
        description="Fluxo de caixa, faturamento e contas por periodo."
        action={<input type="month" className="search-input" value={period} onChange={(e) => setPeriod(e.target.value)} />}
      >
        <div className="metrics-grid compact">
          <MetricCard icon={Icons.finance} label="Entradas" value={formatCurrency(totalEntradas)} helper="Recebimentos do periodo" tone="green" />
          <MetricCard icon={Icons.finance} label="Saidas" value={formatCurrency(totalSaidas)} helper="Despesas do periodo" tone="red" />
          <MetricCard icon={Icons.reports} label="Fluxo de caixa" value={formatCurrency(fluxo)} helper="Entradas menos saidas" tone="blue" />
          <MetricCard icon={Icons.order} label="Ticket medio" value={formatCurrency(ticket)} helper="Com base nas OS finalizadas" />
        </div>
      </Panel>

      <Panel title="Movimentacoes" description="Lista detalhada para navegacao comercial.">
        <DataTable
          columns={[
            { key: "date", label: "Data", render: (row) => formatDate(row.date) },
            { key: "type", label: "Tipo" },
            { key: "category", label: "Categoria" },
            { key: "description", label: "Descricao" },
            { key: "status", label: "Status" },
            { key: "amount", label: "Valor", render: (row) => formatCurrency(row.amount) }
          ]}
          rows={filtered}
          empty={<EmptyState title="Sem movimentacoes no periodo" description="Escolha outro mes ou cadastre entradas e saidas." />}
        />
      </Panel>
    </div>
  );
}
