import { useMemo, useState } from "react";
import DataTable from "../components/DataTable.jsx";
import EmptyState from "../components/EmptyState.jsx";
import MobileFormDrawer from "../components/MobileFormDrawer.jsx";
import MobileModuleHeader from "../components/MobileModuleHeader.jsx";
import Panel from "../components/Panel.jsx";
import useIsMobile from "../hooks/useIsMobile.js";
import { formatPhone, normalizeText } from "../utils/formatters.js";

const blank = {
  id: "",
  name: "",
  phone: "",
  whatsapp: "",
  taxId: "",
  address: "",
  notes: ""
};

export default function CustomersPage({ db, helpers, onSave, onDelete }) {
  const [form, setForm] = useState(blank);
  const [search, setSearch] = useState("");
  const [mobileFormOpen, setMobileFormOpen] = useState(false);
  const isMobile = useIsMobile();

  const rows = useMemo(() => {
    const query = normalizeText(search);
    return db.customers.filter((item) => {
      if (!query) {
        return true;
      }

      return [item.name, item.phone, item.whatsapp, item.taxId, item.address].some((value) =>
        normalizeText(value).includes(query)
      );
    });
  }, [db.customers, search]);

  function openNew() {
    setForm(blank);
    setMobileFormOpen(true);
  }

  function reset() {
    setForm(blank);
    setMobileFormOpen(false);
  }

  function editCustomer(row) {
    setForm(row);
    setMobileFormOpen(true);
  }

  function submit(event) {
    event.preventDefault();
    onSave(form);
    reset();
  }

  const formContent = (
    <form className="form-grid" onSubmit={submit}>
      <label>Nome<input value={form.name} onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))} required /></label>
      <label>Telefone<input value={form.phone} onChange={(e) => setForm((c) => ({ ...c, phone: formatPhone(e.target.value) }))} required /></label>
      <label>WhatsApp<input value={form.whatsapp} onChange={(e) => setForm((c) => ({ ...c, whatsapp: formatPhone(e.target.value) }))} required /></label>
      <label>CPF/CNPJ<input value={form.taxId} onChange={(e) => setForm((c) => ({ ...c, taxId: e.target.value }))} /></label>
      <label className="wide">Endereco<input value={form.address} onChange={(e) => setForm((c) => ({ ...c, address: e.target.value }))} required /></label>
      <label className="wide">Observacoes<textarea value={form.notes} onChange={(e) => setForm((c) => ({ ...c, notes: e.target.value }))} rows={4} /></label>
      <div className="actions wide">
        {form.id && <button type="button" className="ghost-button" onClick={reset}>Cancelar</button>}
        <button type="submit" className="primary-button">{form.id ? "Salvar alteracoes" : "Cadastrar cliente"}</button>
      </div>
    </form>
  );

  return (
    <div className="page-stack">
      <MobileModuleHeader
        title="Clientes"
        subtitle="Cadastre e consulte clientes."
        actionLabel="+ Novo cliente"
        onAction={openNew}
      />

      {!isMobile && (
        <Panel title={form.id ? "Editar cliente" : "Novo cliente"} description="Cadastro completo com historico e contato.">
          {formContent}
        </Panel>
      )}

      <Panel
        title="Base de clientes"
        description={isMobile ? "Clientes cadastrados" : "Busca rapida, historico de compras e motos vinculadas."}
        action={<input className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar cliente" />}
      >
        <DataTable
          columns={[
            { key: "name", label: "Cliente" },
            { key: "phone", label: "Telefone" },
            {
              key: "bikes",
              label: "Motos",
              render: (row) => helpers.customerBikes(row.id).map((bike) => bike.model).join(", ") || "--"
            },
            {
              key: "history",
              label: "Historico",
              render: (row) => `${helpers.customerOrders(row.id).length} OS / ${helpers.customerQuotes(row.id).length} orc.`
            },
            {
              key: "actions",
              label: "Acoes",
              render: (row) => (
                <div className="row-actions">
                  <button type="button" className="secondary-button" onClick={() => editCustomer(row)}>Editar</button>
                  <button type="button" className="danger-button" onClick={() => onDelete(row.id)}>Excluir</button>
                </div>
              )
            }
          ]}
          rows={rows}
          mobileCards={(row) => (
            <article className="mobile-record-card">
              <strong>{row.name}</strong>
              <p>{row.phone}</p>
              <span>{helpers.customerBikes(row.id).map((bike) => bike.model).join(", ") || "Sem moto vinculada"}</span>
              <div className="mobile-record-actions">
                <button type="button" className="secondary-button" onClick={() => editCustomer(row)}>Editar</button>
                <button type="button" className="danger-button" onClick={() => onDelete(row.id)}>Excluir</button>
              </div>
            </article>
          )}
          empty={<EmptyState title="Nenhum cliente encontrado" description="Ajuste a busca ou cadastre um novo cliente." />}
        />
      </Panel>

      {isMobile && (
        <MobileFormDrawer open={mobileFormOpen} title={form.id ? "Editar cliente" : "Novo cliente"} onClose={reset}>
          {formContent}
        </MobileFormDrawer>
      )}
    </div>
  );
}
