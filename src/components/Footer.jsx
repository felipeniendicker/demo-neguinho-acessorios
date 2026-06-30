export default function Footer({ compact = false }) {
  return (
    <footer className={`app-footer${compact ? " compact" : ""}`}>
      <div>
        <strong>Neguinho Acessórios</strong>
        <span>Sistema demonstrativo para gestão de oficinas e motopeças.</span>
      </div>
      <p>Versão demonstrativa preparada para apresentação comercial.</p>
    </footer>
  );
}
