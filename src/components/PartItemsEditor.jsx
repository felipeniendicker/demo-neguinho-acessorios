import { formatCurrency } from "../utils/formatters.js";

export default function PartItemsEditor({
  inventory,
  items,
  selectedId,
  quantity,
  onSelectedIdChange,
  onQuantityChange,
  onAddItem,
  onRemoveItem
}) {
  return (
    <div className="part-editor">
      <div className="part-editor-row">
        <select value={selectedId} onChange={(event) => onSelectedIdChange(event.target.value)}>
          <option value="">Selecione uma peca do estoque</option>
          {inventory.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} - {formatCurrency(item.salePrice)}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(event) => onQuantityChange(event.target.value)}
        />
        <button type="button" className="secondary-button" onClick={onAddItem}>
          Adicionar peca
        </button>
      </div>

      <div className="chip-list">
        {items.map((item, index) => (
          <div key={`${item.inventoryId}-${index}`} className="item-chip">
            <span>
              {item.name} x{item.quantity} - {formatCurrency(item.quantity * item.unitPrice)}
            </span>
            <button type="button" className="chip-remove" onClick={() => onRemoveItem(index)}>
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
