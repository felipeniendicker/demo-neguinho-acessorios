import { useEffect, useMemo, useState } from "react";
import DataTable from "../components/DataTable.jsx";
import EmptyState from "../components/EmptyState.jsx";
import MobileFormDrawer from "../components/MobileFormDrawer.jsx";
import MobileModuleHeader from "../components/MobileModuleHeader.jsx";
import Panel from "../components/Panel.jsx";
import PartItemsEditor from "../components/PartItemsEditor.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import useIsMobile from "../hooks/useIsMobile.js";
import { buildWhatsappLink, fileNamesFromList, formatCurrency, formatDate } from "../utils/formatters.js";

const blank = {
  id: "",
  quoteId: null,
  customerId: "",
  bikeId: "",
  service: "",
  mechanic: "",
  entryDate: new Date().toISOString().slice(0, 10),
  dueDate: new Date().toISOString().slice(0, 10),
  completionDate: "",
  status: "Em andamento",
  partItems: [],
  laborValue: "0",
  beforePhotos: [],
  afterPhotos: [],
  documents: [],
  internalNotes: "",
  customerNotes: "",
  notifiedAt: "",
  financialPosted: false
};

export default function OrdersPage({ db, draftOrder, helpers, onConsumeDraft, onSave, onDelete, onStatusChange, onNotify, onPrint }) {
  const [form, setForm] = useState(blank);
  const [selectedId, setSelectedId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [mobileFormOpen, setMobileFormOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (draftOrder) {
      setForm({
        ...blank,
        customerId: draftOrder.customerId,
        bikeId: draftOrder.bikeId,
        quoteId: draftOrder.quoteId,
        service: draftOrder.serviceDescription,
        partItems: draftOrder.partItems,
        laborValue: String(draftOrder.laborValue)
      });
      setMobileFormOpen(true);
      onConsumeDraft();
    }
  }, [draftOrder, onConsumeDraft]);

  const availableBikes = useMemo(
    () => db.bikes.filter((bike) => bike.customerId === form.customerId),
    [db.bikes, form.customerId]
  );

  const partsValue = form.partItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const total = partsValue + Number(form.laborValue || 0);

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

  function openNew() {
    setForm(blank);
    setMobileFormOpen(true);
  }

  function reset() {
    setForm(blank);
    setSelectedId("");
    setQuantity("1");
    setMobileFormOpen(false);
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
      laborValue: String(row.laborValue)
    });
    setMobileFormOpen(true);
  }

  const formContent = (
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
      <label className="wide">Servico<textarea value={form.service} onChange={(e) => setForm((c) => ({ ...c, service: e.target.value }))} rows={3} required /></label>
      <label>Mecanico<input value={form.mechanic} onChange={(e) => setForm((c) => ({ ...c, mechanic: e.target.value }))} required /></label>
      <label>Data de entrada<input type="date" value={form.entryDate} onChange={(e) => setForm((c) => ({ ...c, entryDate: e.target.value }))} required /></label>
      <label>Previsao de entrega<input type="date" value={form.dueDate} onChange={(e) => setForm((c) => ({ ...c, dueDate: e.target.value }))} required /></label>
      <label>Data de finalizacao<input type="date" value={form.completionDate} onChange={(e) => setForm((c) => ({ ...c, completionDate: e.target.value }))} /></label>
      <label>Status
        <select value={form.status} onChange={(e) => setForm((c) => ({ ...c, status: e.target.value }))}>
          <option>Em andamento</option>
          <option>Aguardando peca</option>
          <option>Finalizado</option>
          <option>Cancelado</option>
        </select>
      </label>
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
      <label>Valor de pecas<input value={formatCurrency(partsValue)} readOnly /></label>
      <label>Valor de mao de obra<input type="number" step="0.01" value={form.laborValue} onChange={(e) => setForm((c) => ({ ...c, laborValue: e.target.value }))} required /></label>
      <label>Total<input value={formatCurrency(total)} readOnly /></label>
      <label>Fotos antes<input type="file" multiple onChange={(e) => setForm((c) => ({ ...c, beforePhotos: fileNamesFromList(e.target.files) }))} /></label>
      <label>Fotos depois<input type="file" multiple onChange={(e) => setForm((c) => ({ ...c, afterPhotos: fileNamesFromList(e.target.files) }))} /></label>
      <label>Documentos<input type="file" multiple onChange={(e) => setForm((c) => ({ ...c, documents: fileNamesFromList(e.target.files) }))} /></label>
      <label className="wide">Observacoes internas<textarea value={form.internalNotes} onChange={(e) => setForm((c) => ({ ...c, internalNotes: e.target.value }))} rows={3} /></label>
      <label className="wide">Observacoes para o cliente<textarea value={form.customerNotes} onChange={(e) => setForm((c) => ({ ...c, customerNotes: e.target.value }))} rows={3} /></label>
      <div className="actions wide">
        {form.id && <button type="button" className="ghost-button" onClick={reset}>Cancelar</button>}
        <button type="submit" className="primary-button">{form.id ? "Salvar alteracoes" : "Criar OS"}</button>
      </div>
    </form>
  );

  return (
    <div className="page-stack">
      <MobileModuleHeader
        title="Ordens de Servico"
        subtitle="Acompanhe a producao da oficina."
        actionLabel="+ Nova OS"
        onAction={openNew}
      />

      {!isMobile && (
        <Panel title={form.id ? "Editar OS" : "Nova ordem de servico"} description="Fluxo avancado com anexos, fotos e avisos ao cliente.">
          {formContent}
        </Panel>
      )}

      <Panel title="Ordens de servico" description={isMobile ? "OS cadastradas" : "Execucao, faturamento e contato com o cliente."}>
        <DataTable
          columns={[
            { key: "service", label: "Servico" },
            { key: "customer", label: "Cliente", render: (row) => helpers.customerName(row.customerId) },
            { key: "bike", label: "Moto", render: (row) => helpers.bikeName(row.bikeId) },
            { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status} /> },
            { key: "entryDate", label: "Entrada", render: (row) => formatDate(row.entryDate) },
            { key: "total", label: "Total", render: (row) => formatCurrency(row.total) },
            { key: "actions", label: "Acoes", render: (row) => {
              const customer = db.customers.find((item) => item.id === row.customerId);
              const bike = db.bikes.find((item) => item.id === row.bikeId);
              const link = buildWhatsappLink(
                customer?.whatsapp,
                `Ola, ${customer?.name || "cliente"}! Sua moto ${bike?.model || ""} ${bike?.plate || ""} ja esta pronta para retirada. Qualquer duvida estamos a disposicao.`
              );
              return (
                <div className="row-actions">
                  <button type="button" className="small-button" onClick={() => onStatusChange(row.id, "Finalizado")}>Finalizar</button>
                  <button type="button" className="small-button" onClick={() => onPrint(row)}>Imprimir OS</button>
                  <button type="button" className="secondary-button" onClick={() => edit(row)}>Editar</button>
                  <button type="button" className="small-button success" onClick={() => onNotify(row.id)}>Avisar cliente</button>
                  <a className="small-button link" href={link} target="_blank" rel="noreferrer">WhatsApp</a>
                  <button type="button" className="danger-button" onClick={() => onDelete(row.id)}>Excluir</button>
                </div>
              );
            } }
          ]}
          rows={db.orders}
          mobileCards={(row) => {
            const customer = db.customers.find((item) => item.id === row.customerId);
            const bike = db.bikes.find((item) => item.id === row.bikeId);
            const link = buildWhatsappLink(
              customer?.whatsapp,
              `Ola, ${customer?.name || "cliente"}! Sua moto ${bike?.model || ""} ${bike?.plate || ""} ja esta pronta para retirada. Qualquer duvida estamos a disposicao.`
            );

            return (
              <article className="mobile-record-card">
                <strong>{row.service}</strong>
                <p>{helpers.customerName(row.customerId)}</p>
                <span>{helpers.bikeName(row.bikeId)}</span>
                <div className="mobile-record-status"><StatusBadge value={row.status} /></div>
                <div className="mobile-record-actions">
                  <button type="button" className="small-button" onClick={() => onStatusChange(row.id, "Finalizado")}>Finalizar</button>
                  <button type="button" className="secondary-button" onClick={() => edit(row)}>Editar</button>
                  <button type="button" className="small-button" onClick={() => onPrint(row)}>Imprimir</button>
                  <button type="button" className="small-button success" onClick={() => onNotify(row.id)}>Avisar</button>
                  <a className="small-button link" href={link} target="_blank" rel="noreferrer">WhatsApp</a>
                  <button type="button" className="danger-button" onClick={() => onDelete(row.id)}>Excluir</button>
                </div>
              </article>
            );
          }}
          empty={<EmptyState title="Nenhuma OS cadastrada" description="Crie OS manualmente ou a partir de orcamentos aprovados." />}
        />
      </Panel>

      {isMobile && (
        <MobileFormDrawer open={mobileFormOpen} title={form.id ? "Editar OS" : "Nova OS"} onClose={reset}>
          {formContent}
        </MobileFormDrawer>
      )}
    </div>
  );
}
