import { useMemo, useState } from "react";
import DataTable from "../components/DataTable.jsx";
import EmptyState from "../components/EmptyState.jsx";
import MetricCard from "../components/MetricCard.jsx";
import MobileModuleHeader from "../components/MobileModuleHeader.jsx";
import Panel from "../components/Panel.jsx";
import { Icons } from "../components/icons.jsx";
import useIsMobile from "../hooks/useIsMobile.js";
import { currentDate, formatCurrency, formatDateTime, normalizeText, sumBy } from "../utils/formatters.js";

const paymentOptions = ["Dinheiro", "PIX", "Cartao", "Credito"];

export default function PdvPage({ db, onCheckout }) {
  const [search, setSearch] = useState("");
  const [customerName, setCustomerName] = useState("Cliente de balcao");
  const [discount, setDiscount] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("PIX");
  const [cart, setCart] = useState([]);
  const [mobileStep, setMobileStep] = useState("produtos");
  const isMobile = useIsMobile();

  const query = normalizeText(search);

  const products = useMemo(() => {
    return db.inventory.filter((item) => {
      if (!query) {
        return true;
      }

      return [item.name, item.sku, item.category, item.supplier].some((value) =>
        normalizeText(value).includes(query)
      );
    });
  }, [db.inventory, query]);

  const todaySales = useMemo(
    () => db.sales.filter((sale) => sale.date === currentDate()),
    [db.sales]
  );

  const salesTodayValue = sumBy(todaySales, (sale) => sale.total);
  const averageTicket = todaySales.length ? salesTodayValue / todaySales.length : 0;
  const subtotal = sumBy(cart, (item) => item.subtotal);
  const discountValue = Math.min(Number(discount || 0), subtotal);
  const total = Math.max(subtotal - discountValue, 0);

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((item) => item.inventoryId === product.id);

      if (existing) {
        return current.map((item) =>
          item.inventoryId === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, product.quantity),
                subtotal: Math.min(item.quantity + 1, product.quantity) * item.unitPrice
              }
            : item
        );
      }

      return [
        ...current,
        {
          inventoryId: product.id,
          name: product.name,
          quantity: product.quantity > 0 ? 1 : 0,
          unitPrice: Number(product.salePrice || 0),
          available: Number(product.quantity || 0),
          subtotal: Number(product.salePrice || 0)
        }
      ].filter((item) => item.quantity > 0);
    });

    if (isMobile) {
      setMobileStep("carrinho");
    }
  }

  function updateQuantity(inventoryId, delta) {
    setCart((current) =>
      current
        .map((item) => {
          if (item.inventoryId !== inventoryId) {
            return item;
          }

          const nextQuantity = Math.max(0, Math.min(item.quantity + delta, item.available));
          return {
            ...item,
            quantity: nextQuantity,
            subtotal: nextQuantity * item.unitPrice
          };
        })
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(inventoryId) {
    setCart((current) => current.filter((item) => item.inventoryId !== inventoryId));
  }

  function submitSale() {
    if (!cart.length) {
      return;
    }

    onCheckout({
      customerName: customerName.trim() || "Cliente de balcao",
      paymentMethod,
      subtotal,
      discount: discountValue,
      total,
      items: cart.map((item) => ({
        inventoryId: item.inventoryId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal
      }))
    });

    setCart([]);
    setDiscount("0");
    setCustomerName("Cliente de balcao");
    setPaymentMethod("PIX");
    setSearch("");
    setMobileStep("produtos");
  }

  const productsPanel = (
    <Panel title="Produtos" description={isMobile ? "Escolha os itens" : "Pesquisa rapida com itens vindos diretamente do estoque."} action={
      <input
        className="search-input"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar produto"
      />
    }>
      <div className="pdv-product-grid">
        {products.length ? (
          products.map((product) => {
            const unavailable = Number(product.quantity || 0) <= 0;

            return (
              <article key={product.id} className={`pdv-product-card${unavailable ? " disabled" : ""}`}>
                <div className="pdv-product-meta">
                  <strong>{product.name}</strong>
                  <p>{product.category}</p>
                  <small>SKU {product.sku}</small>
                </div>

                <div className="pdv-product-footline">
                  <span className={`stock-pill${Number(product.quantity) <= Number(product.minStock) ? " low" : ""}`}>
                    {product.quantity} em estoque
                  </span>
                  <strong>{formatCurrency(product.salePrice)}</strong>
                </div>

                <button
                  type="button"
                  className="primary-button full-button"
                  onClick={() => addToCart(product)}
                  disabled={unavailable}
                >
                  {unavailable ? "Sem saldo" : "Adicionar"}
                </button>
              </article>
            );
          })
        ) : (
          <EmptyState title="Nenhum produto encontrado" description="Ajuste a busca ou cadastre novos itens no estoque." />
        )}
      </div>
    </Panel>
  );

  const cartPanel = (
    <Panel title="Carrinho" description={isMobile ? "Itens adicionados" : "Itens da venda com controle rapido de quantidade."}>
      {cart.length ? (
        <div className="cart-list">
          {cart.map((item) => (
            <article key={item.inventoryId} className="cart-item">
              <div className="cart-item-main">
                <strong>{item.name}</strong>
                <span>{formatCurrency(item.unitPrice)} cada</span>
              </div>

              <div className="cart-item-actions">
                <div className="qty-controls">
                  <button type="button" className="small-button" onClick={() => updateQuantity(item.inventoryId, -1)}>-</button>
                  <strong>{item.quantity}</strong>
                  <button type="button" className="small-button" onClick={() => updateQuantity(item.inventoryId, 1)}>+</button>
                </div>

                <div className="cart-subtotal">
                  <span>Subtotal</span>
                  <strong>{formatCurrency(item.subtotal)}</strong>
                </div>

                <button type="button" className="ghost-button" onClick={() => removeItem(item.inventoryId)}>
                  Remover
                </button>
              </div>
            </article>
          ))}

          <div className="cart-total-row">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
        </div>
      ) : (
        <EmptyState title="Carrinho vazio" description="Adicione produtos para continuar." />
      )}
    </Panel>
  );

  const paymentPanel = (
    <Panel title="Pagamento" description={isMobile ? "Finalize a venda" : "Fechamento rapido com forma de pagamento."}>
      <div className="pdv-summary">
        <label>
          Cliente
          <input
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            placeholder="Nome do cliente"
          />
        </label>

        <label>
          Desconto
          <input type="number" min="0" step="0.01" value={discount} onChange={(event) => setDiscount(event.target.value)} />
        </label>

        <div className="payment-block">
          <span className="field-title">Forma de pagamento</span>
          <div className="payment-grid">
            {paymentOptions.map((option) => (
              <label key={option} className={`payment-option${paymentMethod === option ? " selected" : ""}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={option}
                  checked={paymentMethod === option}
                  onChange={(event) => setPaymentMethod(event.target.value)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="summary-lines">
          <div><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
          <div><span>Desconto</span><strong>{formatCurrency(discountValue)}</strong></div>
          <div className="summary-total"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
        </div>

        <button type="button" className="primary-button full-button pdv-finish-button" onClick={submitSale} disabled={!cart.length}>
          Finalizar venda
        </button>
      </div>
    </Panel>
  );

  return (
    <div className="page-stack">
      <MobileModuleHeader title="PDV" subtitle="Venda rapida no balcao." />

      <div className="metrics-grid compact mobile-tight-metrics">
        <MetricCard icon={Icons.pdv} label="Vendas hoje" value={todaySales.length} helper="Cupons" tone="blue" />
        <MetricCard icon={Icons.finance} label="Faturamento hoje" value={formatCurrency(salesTodayValue)} helper="Receita" tone="green" />
        <MetricCard icon={Icons.reports} label="Ticket medio" value={formatCurrency(averageTicket)} helper="Media" />
      </div>

      {isMobile ? (
        <>
          <div className="pdv-steps">
            <button type="button" className={`pdv-step${mobileStep === "produtos" ? " active" : ""}`} onClick={() => setMobileStep("produtos")}>Produtos</button>
            <button type="button" className={`pdv-step${mobileStep === "carrinho" ? " active" : ""}`} onClick={() => setMobileStep("carrinho")}>Carrinho</button>
            <button type="button" className={`pdv-step${mobileStep === "pagamento" ? " active" : ""}`} onClick={() => setMobileStep("pagamento")}>Pagamento</button>
          </div>
          {mobileStep === "produtos" && productsPanel}
          {mobileStep === "carrinho" && cartPanel}
          {mobileStep === "pagamento" && paymentPanel}
        </>
      ) : (
        <div className="pdv-layout">
          {productsPanel}
          <div className="page-stack">
            {cartPanel}
            {paymentPanel}
          </div>
        </div>
      )}

      <Panel title="Ultimas vendas" description={isMobile ? "Historico" : "Resumo simples para navegacao comercial durante a apresentacao."}>
        <DataTable
          columns={[
            { key: "number", label: "Numero" },
            { key: "customerName", label: "Cliente" },
            { key: "total", label: "Valor", render: (row) => formatCurrency(row.total) },
            { key: "paymentMethod", label: "Pagamento" },
            { key: "date", label: "Data", render: (row) => formatDateTime(`${row.date}T${row.time || "12:00:00"}`) }
          ]}
          rows={db.sales}
          mobileCards={(row) => (
            <article className="mobile-record-card">
              <strong>{row.number}</strong>
              <p>{row.customerName}</p>
              <span>{formatCurrency(row.total)} • {row.paymentMethod}</span>
            </article>
          )}
          empty={<EmptyState title="Nenhuma venda registrada" description="Finalize uma venda para alimentar o historico do PDV." />}
        />
      </Panel>
    </div>
  );
}
