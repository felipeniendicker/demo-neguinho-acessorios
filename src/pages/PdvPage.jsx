import { useMemo, useState } from "react";
import DataTable from "../components/DataTable.jsx";
import EmptyState from "../components/EmptyState.jsx";
import MetricCard from "../components/MetricCard.jsx";
import Panel from "../components/Panel.jsx";
import { Icons } from "../components/icons.jsx";
import { currentDate, formatCurrency, formatDateTime, normalizeText, sumBy } from "../utils/formatters.js";

const paymentOptions = ["Dinheiro", "PIX", "Cartao", "Credito"];

export default function PdvPage({ db, onCheckout }) {
  const [search, setSearch] = useState("");
  const [customerName, setCustomerName] = useState("Cliente de balcão");
  const [discount, setDiscount] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("PIX");
  const [cart, setCart] = useState([]);

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
  const lastSale = db.sales[0] || null;
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
      customerName: customerName.trim() || "Cliente de balcão",
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
    setCustomerName("Cliente de balcão");
    setPaymentMethod("PIX");
    setSearch("");
  }

  return (
    <div className="page-stack">
      <div className="metrics-grid compact">
        <MetricCard icon={Icons.pdv} label="Vendas hoje" value={todaySales.length} helper="Cupons emitidos no dia" tone="blue" />
        <MetricCard icon={Icons.finance} label="Faturamento hoje" value={formatCurrency(salesTodayValue)} helper="Receita do balcão" tone="green" />
        <MetricCard icon={Icons.reports} label="Ticket medio" value={formatCurrency(averageTicket)} helper="Media por venda" />
        <MetricCard
          icon={Icons.inventory}
          label="Ultima venda"
          value={lastSale ? formatCurrency(lastSale.total) : "--"}
          helper={lastSale ? `${lastSale.number} • ${lastSale.paymentMethod}` : "Sem vendas registradas"}
          tone="red"
        />
      </div>

      <div className="pdv-layout">
        <Panel
          title="Produtos para venda"
          description="Pesquisa rapida com itens vindos diretamente do estoque."
          action={
            <input
              className="search-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Pesquisar peça ou produto"
            />
          }
        >
          <div className="pdv-product-grid">
            {products.length ? (
              products.map((product) => {
                const unavailable = Number(product.quantity || 0) <= 0;

                return (
                  <button
                    key={product.id}
                    type="button"
                    className={`pdv-product-card${unavailable ? " disabled" : ""}`}
                    onClick={() => addToCart(product)}
                    disabled={unavailable}
                  >
                    <div className="pdv-product-head">
                      <strong>{product.name}</strong>
                      <span className={`stock-pill${Number(product.quantity) <= Number(product.minStock) ? " low" : ""}`}>
                        {product.quantity} em estoque
                      </span>
                    </div>
                    <p>{product.category} • SKU {product.sku}</p>
                    <div className="pdv-product-footer">
                      <strong>{formatCurrency(product.salePrice)}</strong>
                      <span>{unavailable ? "Sem saldo" : "Adicionar ao carrinho"}</span>
                    </div>
                  </button>
                );
              })
            ) : (
              <EmptyState title="Nenhum produto encontrado" description="Ajuste a busca ou cadastre novos itens no estoque." />
            )}
          </div>
        </Panel>

        <div className="page-stack">
          <Panel title="Carrinho" description="Itens da venda com controle rapido de quantidade.">
            {cart.length ? (
              <div className="cart-list">
                {cart.map((item) => (
                  <article key={item.inventoryId} className="cart-item">
                    <div className="cart-item-main">
                      <strong>{item.name}</strong>
                      <span>{formatCurrency(item.unitPrice)} cada</span>
                    </div>
                    <div className="cart-item-side">
                      <div className="qty-controls">
                        <button type="button" className="small-button" onClick={() => updateQuantity(item.inventoryId, -1)}>-</button>
                        <strong>{item.quantity}</strong>
                        <button type="button" className="small-button" onClick={() => updateQuantity(item.inventoryId, 1)}>+</button>
                      </div>
                      <strong>{formatCurrency(item.subtotal)}</strong>
                      <button type="button" className="ghost-button" onClick={() => removeItem(item.inventoryId)}>Remover</button>
                    </div>
                  </article>
                ))}

                <div className="cart-total-row">
                  <span>Total geral</span>
                  <strong>{formatCurrency(total)}</strong>
                </div>
              </div>
            ) : (
              <EmptyState title="Carrinho vazio" description="Toque em um produto para simular a venda no balcão." />
            )}
          </Panel>

          <Panel title="Resumo da venda" description="Fechamento rapido com forma de pagamento.">
            <div className="pdv-summary">
              <label>
                Cliente
                <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Nome do cliente ou Cliente de balcão" />
              </label>

              <label>
                Desconto
                <input type="number" min="0" step="0.01" value={discount} onChange={(event) => setDiscount(event.target.value)} />
              </label>

              <div className="summary-lines">
                <div><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
                <div><span>Desconto</span><strong>{formatCurrency(discountValue)}</strong></div>
                <div className="summary-total"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
              </div>

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

              <button type="button" className="primary-button full-button" onClick={submitSale} disabled={!cart.length}>
                Finalizar venda
              </button>
            </div>
          </Panel>
        </div>
      </div>

      <Panel title="Historico de vendas" description="Resumo simples para navegacao comercial durante a apresentacao.">
        <DataTable
          columns={[
            { key: "number", label: "Numero" },
            { key: "customerName", label: "Cliente" },
            { key: "total", label: "Valor", render: (row) => formatCurrency(row.total) },
            { key: "paymentMethod", label: "Pagamento" },
            { key: "date", label: "Data", render: (row) => formatDateTime(`${row.date}T${row.time || "12:00:00"}`) }
          ]}
          rows={db.sales}
          empty={<EmptyState title="Nenhuma venda registrada" description="Finalize uma venda para alimentar o historico do PDV." />}
        />
      </Panel>
    </div>
  );
}
