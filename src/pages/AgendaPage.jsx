import { useMemo, useState } from "react";
import DataTable from "../components/DataTable.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Panel from "../components/Panel.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { formatDate } from "../utils/formatters.js";

const blank = {
  id: "",
  customerId: "",
  bikeId: "",
  service: "",
  date: new Date().toISOString().slice(0, 10),
  time: "09:00",
  dueDate: new Date().toISOString().slice(0, 10),
  status: "Agendado"
};

export default function AgendaPage({ db, helpers, onSave, onDelete }) {
  const [form, setForm] = useState(blank);

  const calendar = useMemo(() => {
    return [...db.agenda].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  }, [db.agenda]);

  function submit(event) {
    event.preventDefault();
    onSave(form);
    setForm(blank);
  }

  return (
    <div className="page-stack">
      <Panel title={form.id ? "Editar agendamento" : "Novo agendamento"} description="Controle de prazos, entregas e proximos servicos.">
        <form className="form-grid" onSubmit={submit}>
          <label>Cliente
            <select value={form.customerId} onChange={(e) => setForm((c) => ({ ...c, customerId: e.target.value, bikeId: "" }))} required>
              <option value="">Selecione</option>
              {db.customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
            </select>
          </label>
          <label>Moto
            <select value={form.bikeId} onChange={(e) => setForm((c) => ({ ...c, bikeId: e.target.value }))} required disabled={!form.customerId}>
              <option value="">Selecione</option>
              {db.bikes.filter((bike) => bike.customerId === form.customerId).map((bike) => <option key={bike.id} value={bike.id}>{bike.brand} {bike.model} - {bike.plate}</option>)}
            </select>
          </label>
          <label className="wide">Servico<input value={form.service} onChange={(e) => setForm((c) => ({ ...c, service: e.target.value }))} required /></label>
          <label>Data<input type="date" value={form.date} onChange={(e) => setForm((c) => ({ ...c, date: e.target.value }))} required /></label>
          <label>Horario<input type="time" value={form.time} onChange={(e) => setForm((c) => ({ ...c, time: e.target.value }))} required /></label>
          <label>Previsao<input type="date" value={form.dueDate} onChange={(e) => setForm((c) => ({ ...c, dueDate: e.target.value }))} required /></label>
          <label>Status
            <select value={form.status} onChange={(e) => setForm((c) => ({ ...c, status: e.target.value }))}>
              <option>Agendado</option>
              <option>Em andamento</option>
              <option>Finalizado</option>
              <option>Cancelado</option>
            </select>
          </label>
          <div className="actions wide">
            <button type="submit" className="primary-button">{form.id ? "Salvar alteracoes" : "Criar agendamento"}</button>
          </div>
        </form>
      </Panel>

      <Panel title="Agenda da oficina" description="Lista e calendario simples para a demonstracao.">
        <DataTable
          columns={[
            { key: "date", label: "Data", render: (row) => formatDate(row.date) },
            { key: "time", label: "Horario" },
            { key: "service", label: "Servico" },
            { key: "customer", label: "Cliente", render: (row) => helpers.customerName(row.customerId) },
            { key: "bike", label: "Moto", render: (row) => helpers.bikeName(row.bikeId) },
            { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status} /> },
            { key: "actions", label: "Acoes", render: (row) => (
              <div className="row-actions">
                <button type="button" className="secondary-button" onClick={() => setForm(row)}>Editar</button>
                <button type="button" className="danger-button" onClick={() => onDelete(row.id)}>Excluir</button>
              </div>
            ) }
          ]}
          rows={calendar}
          empty={<EmptyState title="Sem agenda" description="Crie agendamentos para mostrar previsao e entregas." />}
        />
      </Panel>
    </div>
  );
}
