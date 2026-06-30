import { useMemo, useState } from "react";
import DataTable from "../components/DataTable.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Panel from "../components/Panel.jsx";
import PartItemsEditor from "../components/PartItemsEditor.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { formatCurrency, formatDate } from "../utils/formatters.js";

const blank = {
  id: "",
  customerId: "",
  bikeId: "",
  serviceDescription: "",
  partItems: [],
  laborValue: "0",
  discount: "0",
  status: "Em aberto",
  date: "",
  validUntil: "",
  notes: ""
};

export default function QuotesPage({ db, helpers, onSave, onDelete, onStatusChange, onGenerateOrder, onPrint }) {
  const [form, setForm] = useState({ ...blank, date: new Date().toISOString().slice(0, 10), validUntil: new Date().toISOString().slice(0, 10) });
  const [selectedId, setSelectedId] = useState("");
  const [quantity, setQuantity] = useState("1");

  const availableBikes = useMemo(
    () => db.bikes.filter((bike) => bike.customerId === form.customerId),
    [db.bikes, form.customerId]
  );

  const partsValue = form.partItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const total = partsValue + Number(form.laborValue || 0) - Number(form.discount || 0);

  function addItem() {
    const product = db.inventory.find((item) => item.id === selectedId);
    if (!product) {
      return;
    }
    setForm((current) => ({
      ...current,
      partItems: [
        ...current.partItems,
        {
          inventoryId: product.id,
          name: product.name,
          quantity: Number(quantity || 1),
          unitPrice: Number(product.salePrice)
        }
      ]
    }));
    setSelectedId("");
    setQuantity("1");
  }

  function reset() {
    setForm({ ...blank, date: new Date().toISOString().slice(0, 10), validUntil: new Date().toISOString().slice(0, 10) });
  }

  function submit(event) {
    event.preventDefault();
    onSave({
      ...form,
      partsValue,
      total
    });
    reset();
  }

  function edit(row) {
    setForm({
      ...row,
      laborValue: String(row.laborValue),
      discount: String(row.discount)
    });
  }

  return (
    <div className="page-stack">
      <Panel title={form.id ? "Editar orcamento" : "Novo orcamento"} description="Fluxo comercial com impressao e conversao em OS.">
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
              {availableBikes.map((bike) => <option key={bike.id} value={bike.id}>{bike.brand} {bike.model} - {bike.plate}</option>)}
            </select>
          </label>
          <label className="wide">Descricao do servico<textarea value={form.serviceDescription} onChange={(e) => setForm((c) => ({ ...c, serviceDescription: e.target.value }))} rows={4} required /></label>
          <div className="wide">
            <span className="field-title">Pecas utilizadas</span>
            <PartItemsEditor
              inventory={db.inventory}
              items={form.partItems}
              selectedId={selectedId}
              quantity={quantity}
              onSelectedIdChange={setSelectedId}
              onQuantityChange={setQuantity}
              onAddItem={addItem}
              onRemoveItem={(index) => setForm((current) => ({ ...current, partItems: current.partItems.filter((_, itemIndex) => itemIndex !== index) }))}
            />
          </div>
          <label>Valor das pecas<input value={formatCurrency(partsValue)} readOnly /></label>
          <label>Valor da mao de obra<input type="number" step="0.01" value={form.laborValue} onChange={(e) => setForm((c) => ({ ...c, laborValue: e.target.value }))} required /></label>
          <label>Desconto<input type="number" step="0.01" value={form.discount} onChange={(e) => setForm((c) => ({ ...c, discount: e.target.value }))} /></label>
          <label>Status
            <select value={form.status} onChange={(e) => setForm((c) => ({ ...c, status: e.target.value }))}>
              <option>Em aberto</option>
              <option>Aprovado</option>
              <option>Recusado</option>
            </select>
          </label>
          <label>Data<input type="date" value={form.date} onChange={(e) => setForm((c) => ({ ...c, date: e.target.value }))} required /></label>
          <label>Validade<input type="date" value={form.validUntil} onChange={(e) => setForm((c) => ({ ...c, validUntil: e.target.value }))} required /></label>
          <label className="wide">Observacoes<textarea value={form.notes} onChange={(e) => setForm((c) => ({ ...c, notes: e.target.value }))} rows={3} /></label>
          <label>Total<input value={formatCurrency(total)} readOnly /></label>
          <div className="actions wide">
            {form.id && <button type="button" className="ghost-button" onClick={reset}>Cancelar</button>}
            <button type="submit" className="primary-button">{form.id ? "Salvar alteracoes" : "Salvar orcamento"}</button>
          </div>
        </form>
      </Panel>

      <Panel title="Orcamentos" description="Aprovacao, impressao e geracao de ordem de servico.">
        <DataTable
          columns={[
            { key: "customer", label: "Cliente", render: (row) => helpers.customerName(row.customerId) },
            { key: "bike", label: "Moto", render: (row) => helpers.bikeName(row.bikeId) },
            { key: "date", label: "Data", render: (row) => formatDate(row.date) },
            { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status} /> },
            { key: "total", label: "Total", render: (row) => formatCurrency(row.total) },
            { key: "actions", label: "Acoes", render: (row) => (
              <div className="row-actions">
                <button type="button" className="small-button" onClick={() => onPrint(row)}>Imprimir</button>
                <button type="button" className="secondary-button" onClick={() => edit(row)}>Editar</button>
                <button type="button" className="small-button success" onClick={() => onStatusChange(row.id, "Aprovado")}>Aprovar</button>
                <button type="button" className="small-button warning" onClick={() => onStatusChange(row.id, "Recusado")}>Recusar</button>
                <button type="button" className="primary-button" disabled={row.status !== "Aprovado"} onClick={() => onGenerateOrder(row)}>Gerar OS</button>
                <button type="button" className="danger-button" onClick={() => onDelete(row.id)}>Excluir</button>
              </div>
            ) }
          ]}
          rows={db.quotes}
          empty={<EmptyState title="Nenhum orcamento cadastrado" description="Cadastre orcamentos para iniciar o fluxo comercial." />}
        />
      </Panel>
    </div>
  );
}
