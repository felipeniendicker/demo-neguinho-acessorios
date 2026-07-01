export default function MobileModuleHeader({ title, subtitle, actionLabel, onAction }) {
  return (
    <section className="mobile-module-header">
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      {actionLabel && onAction && (
        <button type="button" className="primary-button mobile-module-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </section>
  );
}
