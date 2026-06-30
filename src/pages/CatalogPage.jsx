import Panel from "../components/Panel.jsx";
import { buildWhatsappLink, formatCurrency } from "../utils/formatters.js";

export default function CatalogPage({ db, settings }) {
  const available = db.inventory.filter((item) => item.quantity > 0);

  return (
    <div className="page-stack">
      <Panel title="Catalogo online" description="Simulacao voltada ao cliente final.">
        <div className="catalog-hero">
          <div>
            <span className="kicker">Loja digital</span>
            <h3>{settings.shopName}</h3>
            <p>Pecas disponiveis para pedido rapido pelo WhatsApp.</p>
          </div>
          <div className="catalog-pill">{settings.whatsapp}</div>
        </div>
      </Panel>

      <div className="catalog-grid">
        {available.map((item) => (
          <article key={item.id} className="catalog-card">
            <span className="catalog-category">{item.category}</span>
            <h4>{item.name}</h4>
            <p>Codigo: {item.sku}</p>
            <strong>{formatCurrency(item.salePrice)}</strong>
            <small>{item.quantity} disponivel(is) em estoque</small>
            <a
              className="primary-button"
              href={buildWhatsappLink(
                settings.whatsapp,
                `Ola, tenho interesse na peca ${item.name}, codigo ${item.sku}, valor ${formatCurrency(item.salePrice)}. Ainda esta disponivel?`
              )}
              target="_blank"
              rel="noreferrer"
            >
              Pedir pelo WhatsApp
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
