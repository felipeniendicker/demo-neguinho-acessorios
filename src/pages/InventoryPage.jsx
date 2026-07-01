import { useMemo, useState } from "react";
import DataTable from "../components/DataTable.jsx";
import EmptyState from "../components/EmptyState.jsx";
import MobileFormDrawer from "../components/MobileFormDrawer.jsx";
import MobileModuleHeader from "../components/MobileModuleHeader.jsx";
import Panel from "../components/Panel.jsx";
import useIsMobile from "../hooks/useIsMobile.js";
import { formatCurrency, normalizeText } from "../utils/formatters.js";

const blank = {
  id: "",
  name: "",
  sku: "",
  category: "",
  quantity: "0",
  minStock: "0",
  costPrice: "0",
  salePrice: "0",
  supplier: "",
  location: ""
};

export default function InventoryPage({ db, onSave, onDelete, onMove }) {
  const [form, setForm] = useState(blank);
  const [search, setSearch] = useState("");
  const [mobileFormOpen, setMobileFormOpen] = useState(false);
  const isMobile = useIsMobile();

  const rows = useMemo(() => {
    const query = normalizeText(search);
    return db.inventory.filter((item) => {
      if (!query) {
        return true;
      }
      return [item.name, item.sku, item.category, item.supplier].some((value) =>
        normalizeText(value).includes(query)
      );
    });
  }, [db.inventory, search]);

  function openNew() {
    setForm(blank);
    setMobileFormOpen(true);
  }

  function reset() {
    setForm(blank);
    setMobileFormOpen(false);
  }

  function editItem(row) {
    setForm({
      ...row,
      quantity: String(row.quantity),
      minStock: String(row.minStock),
      costPrice: String(row.costPrice),
      salePrice: String(row.salePrice)
    });
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
      <label>SKU<input value={form.sku} onChange={(e) => setForm((c) => ({ ...c, sku: e.target.value }))} required /></label>
      <label>Categoria<input value={form.category} onChange={(e) => setForm((c) => ({ ...c, category: e.target.value }))} required /></label>
      <label>Quantidade<input type="number" value={form.quantity} onChange={(e) => setForm((c) => ({ ...c, quantity: e.target.value }))} required /></label>
      <label>Estoque minimo<input type="number" value={form.minStock} onChange={(e) => setForm((c) => ({ ...c, minStock: e.target.value }))} required /></label>
      <label>Preco de custo<input type="number" step="0.01" value={form.costPrice} onChange={(e) => setForm((c) => ({ ...c, costPrice: e.target.value }))} required /></label>
      <label>Preco de venda<input type="number" step="0.01" value={form.salePrice} onChange={(e) => setForm((c) => ({ ...c, salePrice: e.target.value }))} required /></label>
      <label>Fornecedor<input value={form.supplier} onChange={(e) => setForm((c) => ({ ...c, supplier: e.target.value }))} /></label>
      <label>Localizacao<input value={form.location} onChange={(e) => setForm((c) => ({ ...c, location: e.target.value }))} /></label>
      <div className="actions wide">
        {form.id && <button type="button" className="ghost-button" onClick={reset}>Cancelar</button>}
        <button type="submit" className="primary-button">{form.id ? "Salvar alteracoes" : "Cadastrar item"}</button>
      </div>
    </form>
  );

  return (
    <div className="page-stack">
      <MobileModuleHeader
        title="Estoque"
        subtitle="Cadastre e acompanhe produtos."
        actionLabel="+ Novo produto"
        onAction={openNew}
      />

      {!isMobile && (
        <Panel title={form.id ? "Editar peca/produto" : "Novo item de estoque"} description="Controle inteligente com margem e estoque minimo.">
          {formContent}
        </Panel>
      )}

      <Panel
        title="Estoque"
        description={isMobile ? "Produtos cadastrados" : "Reposicao sugerida, margem por peca e movimentacao rapida."}
        action={<input className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar item" />}
      >
        <DataTable
          columns={[
            { key: "name", label: "Produto" },
            { key: "sku", label: "SKU" },
            { key: "quantity", label: "Estoque", render: (row) => <span className={row.quantity <= row.minStock ? "text-danger" : ""}>{row.quantity}</span> },
            { key: "prices", label: "Venda / custo", render: (row) => `${formatCurrency(row.salePrice)} / ${formatCurrency(row.costPrice)}` },
            { key: "margin", label: "Margem", render: (row) => `${Math.round(((row.salePrice - row.costPrice) / Math.max(row.salePrice, 1)) * 100)}%` },
            { key: "actions", label: "Acoes", render: (row) => (
              <div className="row-actions">
                <button type="button" className="small-button" onClick={() => onMove(row.id, "entrada", 1)}>+1</button>
                <button type="button" className="small-button warning" onClick={() => onMove(row.id, "saida", 1)}>-1</button>
                <button type="button" className="secondary-button" onClick={() => editItem(row)}>Editar</button>
                <button type="button" className="danger-button" onClick={() => onDelete(row.id)}>Excluir</button>
              </div>
            ) }
          ]}
          rows={rows}
          mobileCards={(row) => (
            <article className="mobile-record-card">
              <strong>{row.name}</strong>
              <p>{row.category} • SKU {row.sku}</p>
              <span>{row.quantity} em estoque • {formatCurrency(row.salePrice)}</span>
              <div className="mobile-record-actions">
                <button type="button" className="small-button" onClick={() => onMove(row.id, "entrada", 1)}>+1</button>
                <button type="button" className="small-button warning" onClick={() => onMove(row.id, "saida", 1)}>-1</button>
                <button type="button" className="secondary-button" onClick={() => editItem(row)}>Editar</button>
                <button type="button" className="danger-button" onClick={() => onDelete(row.id)}>Excluir</button>
              </div>
            </article>
          )}
          empty={<EmptyState title="Nenhum item encontrado" description="Cadastre pecas para alimentar o catalogo e as OS." />}
        />
      </Panel>

      {isMobile && (
        <MobileFormDrawer open={mobileFormOpen} title={form.id ? "Editar produto" : "Novo produto"} onClose={reset}>
          {formContent}
        </MobileFormDrawer>
      )}
    </div>
  );
}
