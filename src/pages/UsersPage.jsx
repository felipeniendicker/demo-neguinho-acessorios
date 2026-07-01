import { useState } from "react";
import DataTable from "../components/DataTable.jsx";
import EmptyState from "../components/EmptyState.jsx";
import MobileFormDrawer from "../components/MobileFormDrawer.jsx";
import MobileModuleHeader from "../components/MobileModuleHeader.jsx";
import Panel from "../components/Panel.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import useIsMobile from "../hooks/useIsMobile.js";

const blank = {
  id: "",
  name: "",
  email: "",
  role: "",
  profile: "Atendente",
  status: "Ativo"
};

const permissions = {
  Administrador: "Acesso total",
  Atendente: "Clientes, motos, orcamentos e agenda",
  Mecanico: "Ordens de servico e agenda",
  Financeiro: "Financeiro, relatorios e faturamento"
};

export default function UsersPage({ db, onSave, onDelete }) {
  const [form, setForm] = useState(blank);
  const [mobileFormOpen, setMobileFormOpen] = useState(false);
  const isMobile = useIsMobile();

  function openNew() {
    setForm(blank);
    setMobileFormOpen(true);
  }

  function reset() {
    setForm(blank);
    setMobileFormOpen(false);
  }

  function editUser(row) {
    setForm(row);
    setMobileFormOpen(true);
  }

  function submit(event) {
    event.preventDefault();
    onSave(form);
    reset();
  }

  const formContent = (
    <form className="form-grid" onSubmit={submit}>
      <label>Nome<input value={form.name} onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))} required /></label>
      <label>E-mail/login<input value={form.email} onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))} required /></label>
      <label>Cargo<input value={form.role} onChange={(e) => setForm((c) => ({ ...c, role: e.target.value }))} required /></label>
      <label>Perfil
        <select value={form.profile} onChange={(e) => setForm((c) => ({ ...c, profile: e.target.value }))}>
          <option>Administrador</option>
          <option>Atendente</option>
          <option>Mecanico</option>
          <option>Financeiro</option>
        </select>
      </label>
      <label>Status
        <select value={form.status} onChange={(e) => setForm((c) => ({ ...c, status: e.target.value }))}>
          <option>Ativo</option>
          <option>Inativo</option>
        </select>
      </label>
      <div className="actions wide">
        <button type="submit" className="primary-button">{form.id ? "Salvar alteracoes" : "Cadastrar usuario"}</button>
      </div>
    </form>
  );

  return (
    <div className="page-stack">
      <MobileModuleHeader
        title="Usuarios"
        subtitle="Gerencie acessos da equipe."
        actionLabel="+ Novo usuario"
        onAction={openNew}
      />

      {!isMobile && (
        <Panel title={form.id ? "Editar usuario" : "Novo usuario"} description="Simulacao de perfis e permissoes.">
          {formContent}
        </Panel>
      )}

      <Panel title="Usuarios" description={isMobile ? "Equipe cadastrada" : "Acesso simulado por perfil."}>
        <DataTable
          columns={[
            { key: "name", label: "Nome" },
            { key: "email", label: "Login" },
            { key: "role", label: "Cargo" },
            { key: "profile", label: "Perfil" },
            { key: "status", label: "Status", render: (row) => <StatusBadge value={row.status} /> },
            { key: "actions", label: "Acoes", render: (row) => (
              <div className="row-actions">
                <button type="button" className="secondary-button" onClick={() => editUser(row)}>Editar</button>
                <button type="button" className="danger-button" onClick={() => onDelete(row.id)}>Excluir</button>
              </div>
            ) }
          ]}
          rows={db.users}
          mobileCards={(row) => (
            <article className="mobile-record-card">
              <strong>{row.name}</strong>
              <p>{row.role}</p>
              <span>{row.profile}</span>
              <div className="mobile-record-status"><StatusBadge value={row.status} /></div>
              <div className="mobile-record-actions">
                <button type="button" className="secondary-button" onClick={() => editUser(row)}>Editar</button>
                <button type="button" className="danger-button" onClick={() => onDelete(row.id)}>Excluir</button>
              </div>
            </article>
          )}
          empty={<EmptyState title="Nenhum usuario" description="Cadastre usuarios para demonstrar controle interno." />}
        />
      </Panel>

      <Panel title="Permissoes" description={isMobile ? "Perfis de acesso" : "Mapa simples de acesso por perfil."}>
        <div className="permission-grid">
          {Object.entries(permissions).map(([profile, description]) => (
            <article key={profile} className="permission-card">
              <strong>{profile}</strong>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </Panel>

      {isMobile && (
        <MobileFormDrawer open={mobileFormOpen} title={form.id ? "Editar usuario" : "Novo usuario"} onClose={reset}>
          {formContent}
        </MobileFormDrawer>
      )}
    </div>
  );
}
