export default function Footer({ compact = false }) {
  return (
    <footer className={`app-footer${compact ? " compact" : ""}`}>
      <div>
        <strong>Neguinho Acessorios</strong>
        <span>Sistema demonstrativo para oficinas e motopecas.</span>
      </div>
      <p>Versao demonstrativa.</p>
    </footer>
  );
}
