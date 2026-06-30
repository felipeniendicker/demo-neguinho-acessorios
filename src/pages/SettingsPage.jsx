import Panel from "../components/Panel.jsx";

export default function SettingsPage({ settings, onSave }) {
  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onSave({
      shopName: data.get("shopName"),
      whatsapp: data.get("whatsapp"),
      address: data.get("address"),
      logoText: data.get("logoText"),
      primaryColor: data.get("primaryColor"),
      accentColor: data.get("accentColor")
    });
  }

  return (
    <div className="page-stack">
      <Panel title="Identidade da oficina" description="Personalizacao para parecer uma implantacao real.">
        <form className="form-grid" onSubmit={submit}>
          <label>Nome da oficina<input name="shopName" defaultValue={settings.shopName} /></label>
          <label>WhatsApp<input name="whatsapp" defaultValue={settings.whatsapp} /></label>
          <label>Endereco<input name="address" defaultValue={settings.address} /></label>
          <label>Logo textual<input name="logoText" defaultValue={settings.logoText} /></label>
          <label>Cor principal<input type="color" name="primaryColor" defaultValue={settings.primaryColor} /></label>
          <label>Cor destaque<input type="color" name="accentColor" defaultValue={settings.accentColor} /></label>
          <div className="actions wide">
            <button type="submit" className="primary-button">Salvar personalizacao</button>
          </div>
        </form>
      </Panel>
    </div>
  );
}
