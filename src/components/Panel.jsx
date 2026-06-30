export default function Panel({ title, description, action, children }) {
  return (
    <section className="panel">
      {(title || action) && (
        <div className="panel-header">
          <div>
            {title && <h3>{title}</h3>}
            {description && <p>{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
