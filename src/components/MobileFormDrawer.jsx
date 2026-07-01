export default function MobileFormDrawer({ open, title, onClose, children }) {
  if (!open) {
    return null;
  }

  return (
    <>
      <button type="button" className="mobile-sheet-backdrop" onClick={onClose} aria-label="Fechar formulario" />
      <section className="mobile-sheet" aria-modal="true" role="dialog">
        <div className="mobile-sheet-head">
          <div>
            <span className="kicker">Formulario</span>
            <h3>{title}</h3>
          </div>
          <button type="button" className="mobile-close-button" onClick={onClose}>
            Fechar
          </button>
        </div>
        <div className="mobile-sheet-body">{children}</div>
      </section>
    </>
  );
}
