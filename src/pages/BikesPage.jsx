import { useMemo, useState } from "react";
import DataTable from "../components/DataTable.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Panel from "../components/Panel.jsx";
import { formatPlate, normalizeText } from "../utils/formatters.js";

const blank = {
  id: "",
  customerId: "",
  brand: "",
  model: "",
  year: "",
  plate: "",
  color: "",
  mileage: "",
  notes: ""
};

export default function BikesPage({ db, helpers, onSave, onDelete }) {
  const [form, setForm] = useState(blank);
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    const query = normalizeText(search);
    return db.bikes.filter((bike) => {
      if (!query) {
        return true;
      }
      return [bike.brand, bike.model, bike.plate, helpers.customerName(bike.customerId)].some((value) =>
        normalizeText(value).includes(query)
      );
    });
  }, [db.bikes, helpers, search]);

  function reset() {
    setForm(blank);
  }

  function submit(event) {
    event.preventDefault();
    onSave(form);
    reset();
  }

  return (
    <div className="page-stack">
      <Panel title={form.id ? "Editar moto" : "Nova moto"} description="Cadastro tecnico com vinculo ao cliente.">
        <form className="form-grid" onSubmit={submit}>
          <label>Cliente
            <select value={form.customerId} onChange={(e) => setForm((c) => ({ ...c, customerId: e.target.value }))} required>
              <option value="">Selecione</option>
              {db.customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
            </select>
          </label>
          <label>Marca<input value={form.brand} onChange={(e) => setForm((c) => ({ ...c, brand: e.target.value }))} required /></label>
          <label>Modelo<input value={form.model} onChange={(e) => setForm((c) => ({ ...c, model: e.target.value }))} required /></label>
          <label>Ano<input value={form.year} onChange={(e) => setForm((c) => ({ ...c, year: e.target.value }))} required /></label>
          <label>Placa<input value={form.plate} onChange={(e) => setForm((c) => ({ ...c, plate: formatPlate(e.target.value) }))} required /></label>
          <label>Cor<input value={form.color} onChange={(e) => setForm((c) => ({ ...c, color: e.target.value }))} /></label>
          <label>Quilometragem<input value={form.mileage} onChange={(e) => setForm((c) => ({ ...c, mileage: e.target.value }))} /></label>
          <label className="wide">Observacoes<textarea value={form.notes} onChange={(e) => setForm((c) => ({ ...c, notes: e.target.value }))} rows={4} /></label>
          <div className="actions wide">
            {form.id && <button type="button" className="ghost-button" onClick={reset}>Cancelar</button>}
            <button type="submit" className="primary-button">{form.id ? "Salvar alteracoes" : "Cadastrar moto"}</button>
          </div>
        </form>
      </Panel>

      <Panel
        title="Motos cadastradas"
        description="Busca por cliente, placa, modelo ou marca."
        action={<input className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar moto" />}
      >
        <DataTable
          columns={[
            { key: "customer", label: "Cliente", render: (row) => helpers.customerName(row.customerId) },
            { key: "model", label: "Moto", render: (row) => `${row.brand} ${row.model}` },
            { key: "plate", label: "Placa" },
            { key: "mileage", label: "Km" },
            { key: "history", label: "Historico", render: (row) => `${helpers.bikeOrders(row.id).length} OS / ${helpers.bikeQuotes(row.id).length} orc.` },
            {
              key: "actions",
              label: "Acoes",
              render: (row) => (
                <div className="row-actions">
                  <button type="button" className="secondary-button" onClick={() => setForm(row)}>Editar</button>
                  <button type="button" className="danger-button" onClick={() => onDelete(row.id)}>Excluir</button>
                </div>
              )
            }
          ]}
          rows={rows}
          empty={<EmptyState title="Nenhuma moto encontrada" description="Cadastre motos para exibir o historico tecnico." />}
        />
      </Panel>
    </div>
  );
}
