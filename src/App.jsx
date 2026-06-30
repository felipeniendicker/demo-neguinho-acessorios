import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Toast from "./components/Toast.jsx";
import { Icons } from "./components/icons.jsx";
import AgendaPage from "./pages/AgendaPage.jsx";
import BikesPage from "./pages/BikesPage.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import CustomersPage from "./pages/CustomersPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import FinancePage from "./pages/FinancePage.jsx";
import IntegrationsPage from "./pages/IntegrationsPage.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import QuotesPage from "./pages/QuotesPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import { loadDatabase, resetDatabase, saveDatabase } from "./services/localStorageService.js";
import {
  createId,
  currentDate,
  currentMonth,
  currentWeekKey,
  formatCurrency,
  monthKey,
  sumBy,
  weekKey
} from "./utils/formatters.js";

const navItems = [
  { path: "/dashboard", label: "Dashboard", caption: "Painel gerencial", icon: Icons.dashboard },
  { path: "/clientes", label: "Clientes", caption: "Cadastro e histórico", icon: Icons.customers },
  { path: "/motos", label: "Motos", caption: "Fichas técnicas", icon: Icons.bike },
  { path: "/estoque", label: "Estoque", caption: "Peças e produtos", icon: Icons.inventory },
  { path: "/orcamentos", label: "Orçamentos", caption: "Aprovação e impressão", icon: Icons.quote },
  { path: "/ordens-servico", label: "OS", caption: "Execução da oficina", icon: Icons.order },
  { path: "/financeiro", label: "Financeiro", caption: "Caixa e faturamento", icon: Icons.finance },
  { path: "/agenda", label: "Agenda", caption: "Prazos e entregas", icon: Icons.agenda },
  { path: "/catalogo", label: "Catálogo", caption: "Página do cliente", icon: Icons.catalog },
  { path: "/usuarios", label: "Usuários", caption: "Perfis e permissões", icon: Icons.users },
  { path: "/relatorios", label: "Relatórios", caption: "Indicadores avançados", icon: Icons.reports },
  { path: "/integracoes", label: "Integrações", caption: "Evolução futura", icon: Icons.integrations },
  { path: "/personalizacao", label: "Personalização", caption: "Identidade da oficina", icon: Icons.settings }
];

const titles = {
  "/dashboard": ["Dashboard", "Indicadores executivos para a apresentação comercial."],
  "/clientes": ["Clientes", "Base com histórico de compras, serviços e motos vinculadas."],
  "/motos": ["Motos", "Cadastro técnico e histórico completo por veículo."],
  "/estoque": ["Estoque Inteligente", "Controle de peças, margem, reposição e movimentação."],
  "/orcamentos": ["Orçamentos", "Propostas com impressão, status e conversão em OS."],
  "/ordens-servico": ["Ordens de Serviço", "Fluxo avançado com anexos, fotos e WhatsApp."],
  "/financeiro": ["Financeiro", "Entradas, saídas, fluxo de caixa e faturamento."],
  "/agenda": ["Agenda da Oficina", "Serviços agendados e controle de prazos."],
  "/catalogo": ["Catálogo Online", "Página simples para o cliente pedir peças pelo WhatsApp."],
  "/usuarios": ["Usuários e Permissões", "Perfis internos simulados para demonstração."],
  "/relatorios": ["Relatórios Avançados", "Resumo de vendas, lucros, peças e recorrência."],
  "/integracoes": ["Integrações Futuras", "Recursos preparados para novas fases do produto."],
  "/personalizacao": ["Personalização", "Identidade visual da oficina e dados comerciais."]
};

const ACCESS_KEY = "neguinho-acessorios-demo-access";

function sortByDateDesc(items, field) {
  return [...items].sort((a, b) => String(b[field] || "").localeCompare(String(a[field] || "")));
}

export default function App() {
  const [db, setDb] = useState(() => loadDatabase());
  const [toast, setToast] = useState(null);
  const [draftOrder, setDraftOrder] = useState(null);
  const [printQuote, setPrintQuote] = useState(null);
  const [printOrder, setPrintOrder] = useState(null);
  const [hasAccess, setHasAccess] = useState(() => window.localStorage.getItem(ACCESS_KEY) === "1");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!toast) {
      return undefined;
    }
    const timeout = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const pageName = titles[location.pathname]?.[0] || "Neguinho Acessórios";
    document.title = `${pageName} | Neguinho Acessórios`;
  }, [location.pathname]);

  const helpers = useMemo(() => {
    const customerMap = new Map(db.customers.map((item) => [item.id, item]));
    const bikeMap = new Map(db.bikes.map((item) => [item.id, item]));

    return {
      customerName: (id) => customerMap.get(id)?.name || "--",
      bikeName: (id) => {
        const bike = bikeMap.get(id);
        return bike ? `${bike.brand} ${bike.model} - ${bike.plate}` : "--";
      },
      customerBikes: (customerId) => db.bikes.filter((item) => item.customerId === customerId),
      customerOrders: (customerId) => db.orders.filter((item) => item.customerId === customerId),
      customerQuotes: (customerId) => db.quotes.filter((item) => item.customerId === customerId),
      bikeOrders: (bikeId) => db.orders.filter((item) => item.bikeId === bikeId),
      bikeQuotes: (bikeId) => db.quotes.filter((item) => item.bikeId === bikeId)
    };
  }, [db]);

  const analytics = useMemo(() => {
    const today = currentDate();
    const month = currentMonth();
    const week = currentWeekKey();
    const entries = db.finance.filter((item) => item.type === "entrada");
    const expenses = db.finance.filter((item) => item.type === "saida");
    const finishedOrders = db.orders.filter((item) => item.status === "Finalizado");
    const monthlyEntries = entries.filter((item) => monthKey(item.date) === month);
    const monthlyExpenses = expenses.filter((item) => monthKey(item.date) === month);

    const productSales = {};
    db.orders.forEach((order) => {
      order.partItems.forEach((item) => {
        productSales[item.name] = (productSales[item.name] || 0) + Number(item.quantity || 0);
      });
    });

    const serviceSales = {};
    db.orders.forEach((order) => {
      serviceSales[order.service] = (serviceSales[order.service] || 0) + 1;
    });

    const customerSales = {};
    finishedOrders.forEach((order) => {
      const name = helpers.customerName(order.customerId);
      customerSales[name] = (customerSales[name] || 0) + Number(order.total || 0);
    });

    return {
      dailyRevenue: sumBy(entries.filter((item) => item.date === today), (item) => item.amount),
      weeklyRevenue: sumBy(entries.filter((item) => weekKey(item.date) === week), (item) => item.amount),
      monthlyRevenue: sumBy(monthlyEntries, (item) => item.amount),
      monthlyProfit: sumBy(monthlyEntries, (item) => item.amount) - sumBy(monthlyExpenses, (item) => item.amount),
      ticketAverage: finishedOrders.length ? sumBy(finishedOrders, (item) => item.total) / finishedOrders.length : 0,
      ordersInProgress: db.orders.filter((item) => item.status === "Em andamento").length,
      openQuotes: db.quotes.filter((item) => item.status === "Em aberto").length,
      finishedOrders: finishedOrders.length,
      lowStockProducts: db.inventory.filter((item) => Number(item.quantity) <= Number(item.minStock)),
      upcomingSchedule: db.agenda.length,
      topProducts: Object.entries(productSales).map(([name, quantity]) => ({ name, quantity })).sort((a, b) => b.quantity - a.quantity),
      topServices: Object.entries(serviceSales).map(([name, quantity]) => ({ name, quantity })).sort((a, b) => b.quantity - a.quantity),
      topCustomers: Object.entries(customerSales).map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount),
      cashFlow: sumBy(entries, (item) => item.amount) - sumBy(expenses, (item) => item.amount),
      orderStatus: db.orders.reduce((acc, item) => ({ ...acc, [item.status]: (acc[item.status] || 0) + 1 }), {}),
      quoteStatus: db.quotes.reduce((acc, item) => ({ ...acc, [item.status]: (acc[item.status] || 0) + 1 }), {})
    };
  }, [db, helpers]);

  function persist(updater, nextToast) {
    setDb((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      saveDatabase(next);
      return next;
    });
    if (nextToast) {
      setToast(nextToast);
    }
  }

  function confirmDelete(message) {
    return window.confirm(message);
  }

  function saveCustomer(form) {
    persist((current) => {
      if (form.id) {
        return {
          ...current,
          customers: current.customers.map((item) => (item.id === form.id ? { ...item, ...form } : item))
        };
      }
      return { ...current, customers: [{ ...form, id: createId("cli") }, ...current.customers] };
    }, { title: "Cliente salvo", message: "Cadastro atualizado com sucesso." });
  }

  function deleteCustomer(id) {
    if (!confirmDelete("Excluir este cliente?")) {
      return;
    }
    persist((current) => ({
      ...current,
      customers: current.customers.filter((item) => item.id !== id),
      bikes: current.bikes.filter((item) => item.customerId !== id),
      quotes: current.quotes.filter((item) => item.customerId !== id),
      orders: current.orders.filter((item) => item.customerId !== id),
      agenda: current.agenda.filter((item) => item.customerId !== id)
    }), { type: "warning", title: "Cliente excluído", message: "Os registros vinculados foram removidos." });
  }

  function saveBike(form) {
    persist((current) => {
      if (form.id) {
        return { ...current, bikes: current.bikes.map((item) => (item.id === form.id ? { ...item, ...form } : item)) };
      }
      return { ...current, bikes: [{ ...form, id: createId("moto") }, ...current.bikes] };
    }, { title: "Moto salva", message: "Ficha técnica atualizada." });
  }

  function deleteBike(id) {
    if (!confirmDelete("Excluir esta moto?")) {
      return;
    }
    persist((current) => ({
      ...current,
      bikes: current.bikes.filter((item) => item.id !== id),
      quotes: current.quotes.filter((item) => item.bikeId !== id),
      orders: current.orders.filter((item) => item.bikeId !== id),
      agenda: current.agenda.filter((item) => item.bikeId !== id)
    }), { type: "warning", title: "Moto excluída", message: "A ficha da moto foi removida." });
  }

  function saveInventory(form) {
    persist((current) => {
      const normalized = {
        ...form,
        quantity: Number(form.quantity || 0),
        minStock: Number(form.minStock || 0),
        costPrice: Number(form.costPrice || 0),
        salePrice: Number(form.salePrice || 0)
      };

      if (form.id) {
        return {
          ...current,
          inventory: current.inventory.map((item) =>
            item.id === form.id
              ? {
                  ...item,
                  ...normalized,
                  priceHistory:
                    item.costPrice !== normalized.costPrice || item.salePrice !== normalized.salePrice
                      ? [...item.priceHistory, { date: currentDate(), costPrice: normalized.costPrice, salePrice: normalized.salePrice }]
                      : item.priceHistory
                }
              : item
          )
        };
      }

      return {
        ...current,
        inventory: [
          {
            ...normalized,
            id: createId("prd"),
            priceHistory: [{ date: currentDate(), costPrice: normalized.costPrice, salePrice: normalized.salePrice }],
            movements: [{ id: createId("mov"), type: "entrada", quantity: normalized.quantity, note: "Cadastro inicial", date: currentDate() }]
          },
          ...current.inventory
        ]
      };
    }, { title: "Estoque salvo", message: "Item atualizado com sucesso." });
  }

  function deleteInventory(id) {
    if (!confirmDelete("Excluir este item de estoque?")) {
      return;
    }
    persist((current) => ({
      ...current,
      inventory: current.inventory.filter((item) => item.id !== id)
    }), { type: "warning", title: "Item excluído", message: "O produto foi removido do estoque." });
  }

  function moveInventory(id, type, quantity) {
    persist((current) => ({
      ...current,
      inventory: current.inventory.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: type === "entrada" ? item.quantity + quantity : Math.max(item.quantity - quantity, 0),
              movements: [...item.movements, { id: createId("mov"), type, quantity, note: "Ajuste rápido", date: currentDate() }]
            }
          : item
      )
    }), { title: "Movimentação registrada", message: `Estoque atualizado com ${type}.` });
  }

  function saveQuote(form) {
    persist((current) => {
      if (form.id) {
        return { ...current, quotes: current.quotes.map((item) => (item.id === form.id ? { ...item, ...form } : item)) };
      }
      return { ...current, quotes: [{ ...form, id: createId("orc") }, ...current.quotes] };
    }, { title: "Orçamento salvo", message: "Proposta pronta para o cliente." });
  }

  function deleteQuote(id) {
    if (!confirmDelete("Excluir este orçamento?")) {
      return;
    }
    persist((current) => ({
      ...current,
      quotes: current.quotes.filter((item) => item.id !== id)
    }), { type: "warning", title: "Orçamento excluído", message: "O registro foi removido." });
  }

  function changeQuoteStatus(id, status) {
    persist((current) => ({
      ...current,
      quotes: current.quotes.map((item) => (item.id === id ? { ...item, status } : item))
    }), { title: "Status atualizado", message: `Orçamento marcado como ${status}.` });
  }

  function generateOrderFromQuote(quote) {
    setDraftOrder({
      customerId: quote.customerId,
      bikeId: quote.bikeId,
      quoteId: quote.id,
      serviceDescription: quote.serviceDescription,
      partItems: quote.partItems,
      laborValue: quote.laborValue
    });
    setToast({ title: "Dados carregados", message: "O orçamento foi enviado para a tela de OS." });
    navigate("/ordens-servico");
  }

  function saveOrder(form) {
    persist((current) => {
      const normalized = {
        ...form,
        laborValue: Number(form.laborValue || 0),
        partsValue: Number(form.partsValue || 0),
        total: Number(form.total || 0),
        completionDate: form.status === "Finalizado" ? form.completionDate || currentDate() : form.completionDate
      };

      if (form.id) {
        return { ...current, orders: current.orders.map((item) => (item.id === form.id ? { ...item, ...normalized } : item)) };
      }

      return { ...current, orders: [{ ...normalized, id: createId("os") }, ...current.orders] };
    }, { title: "OS salva", message: "A ordem de serviço foi registrada." });
  }

  function ensureFinancialForOrder(orderId) {
    persist((current) => {
      const order = current.orders.find((item) => item.id === orderId);
      if (!order) {
        return current;
      }

      const alreadyPosted = current.finance.some((item) => item.sourceOrderId === orderId);
      const nextFinance = alreadyPosted
        ? current.finance
        : [
            {
              id: createId("fin"),
              date: order.completionDate || currentDate(),
              type: "entrada",
              category: "OS Finalizada",
              description: `Recebimento OS #${order.id}`,
              amount: order.total,
              status: "Pago",
              sourceOrderId: order.id
            },
            ...current.finance
          ];

      const inventoryMap = new Map(current.inventory.map((item) => [item.id, item]));
      order.partItems.forEach((item) => {
        const product = inventoryMap.get(item.inventoryId);
        if (product && !order.financialPosted) {
          product.quantity = Math.max(product.quantity - Number(item.quantity || 0), 0);
          product.movements = [
            ...product.movements,
            { id: createId("mov"), type: "saida", quantity: item.quantity, note: `Baixa automática OS ${order.id}`, date: currentDate() }
          ];
        }
      });

      return {
        ...current,
        finance: nextFinance,
        inventory: [...inventoryMap.values()],
        orders: current.orders.map((item) =>
          item.id === orderId
            ? { ...item, status: "Finalizado", completionDate: order.completionDate || currentDate(), financialPosted: true }
            : item
        )
      };
    }, { title: "OS finalizada", message: "Faturamento e baixa de estoque contabilizados." });
  }

  function changeOrderStatus(id, status) {
    if (status === "Finalizado") {
      ensureFinancialForOrder(id);
      return;
    }
    persist((current) => ({
      ...current,
      orders: current.orders.map((item) => (item.id === id ? { ...item, status } : item))
    }), { title: "Status da OS atualizado", message: `OS marcada como ${status}.` });
  }

  function deleteOrder(id) {
    if (!confirmDelete("Excluir esta ordem de serviço?")) {
      return;
    }
    persist((current) => ({
      ...current,
      orders: current.orders.filter((item) => item.id !== id),
      finance: current.finance.filter((item) => item.sourceOrderId !== id)
    }), { type: "warning", title: "OS excluída", message: "A ordem de serviço foi removida." });
  }

  function notifyCustomer(id) {
    persist((current) => ({
      ...current,
      orders: current.orders.map((item) => (item.id === id ? { ...item, notifiedAt: new Date().toISOString() } : item))
    }), { title: "Cliente avisado", message: "A OS foi marcada como comunicada ao cliente." });
  }

  function saveFinance(form) {
    persist((current) => ({
      ...current,
      finance: [{ ...form, id: createId("fin"), amount: Number(form.amount || 0) }, ...current.finance]
    }), { title: "Movimentação salva", message: "Lançamento financeiro registrado." });
  }

  function saveAgenda(form) {
    persist((current) => {
      if (form.id) {
        return { ...current, agenda: current.agenda.map((item) => (item.id === form.id ? { ...item, ...form } : item)) };
      }
      return { ...current, agenda: [{ ...form, id: createId("age") }, ...current.agenda] };
    }, { title: "Agendamento salvo", message: "Agenda atualizada." });
  }

  function deleteAgenda(id) {
    if (!confirmDelete("Excluir este agendamento?")) {
      return;
    }
    persist((current) => ({
      ...current,
      agenda: current.agenda.filter((item) => item.id !== id)
    }), { type: "warning", title: "Agendamento excluído", message: "O serviço saiu da agenda." });
  }

  function saveUser(form) {
    persist((current) => {
      if (form.id) {
        return { ...current, users: current.users.map((item) => (item.id === form.id ? { ...item, ...form } : item)) };
      }
      return { ...current, users: [{ ...form, id: createId("usr") }, ...current.users] };
    }, { title: "Usuário salvo", message: "Perfil interno atualizado." });
  }

  function deleteUser(id) {
    if (!confirmDelete("Excluir este usuário?")) {
      return;
    }
    persist((current) => ({
      ...current,
      users: current.users.filter((item) => item.id !== id)
    }), { type: "warning", title: "Usuário excluído", message: "Registro removido." });
  }

  function saveSettings(nextSettings) {
    persist((current) => ({
      ...current,
      settings: { ...current.settings, ...nextSettings }
    }), { title: "Personalização salva", message: "A identidade da oficina foi atualizada." });
  }

  function handleExportReport() {
    window.alert("Relatório exportado com sucesso (simulação da demo).");
  }

  function handlePrintQuote(quote) {
    setPrintQuote(quote);
    setPrintOrder(null);
    window.setTimeout(() => window.print(), 80);
  }

  function handlePrintOrder(order) {
    setPrintOrder(order);
    setPrintQuote(null);
    window.setTimeout(() => window.print(), 80);
  }

  function handleEnterLanding() {
    navigate("/login");
  }

  function handleLogin() {
    window.localStorage.setItem(ACCESS_KEY, "1");
    setHasAccess(true);
    navigate("/dashboard");
  }

  function handleReset() {
    if (!confirmDelete("Restaurar os dados iniciais da demo?")) {
      return;
    }
    const seeded = resetDatabase();
    setDb(seeded);
    setToast({ title: "Demo restaurada", message: "Os dados fake foram recriados no localStorage." });
  }

  const sortedDb = useMemo(
    () => ({
      ...db,
      quotes: sortByDateDesc(db.quotes, "date"),
      orders: sortByDateDesc(db.orders, "entryDate"),
      finance: sortByDateDesc(db.finance, "date"),
      agenda: sortByDateDesc(db.agenda, "date")
    }),
    [db]
  );

  const [title, subtitle] = titles[location.pathname] || titles["/dashboard"];
  const isPublicPage = location.pathname === "/" || location.pathname === "/login";

  if (!hasAccess && !isPublicPage) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage onEnter={handleEnterLanding} />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="*"
          element={
            <div className="app-shell">
              <Sidebar items={navItems} settings={db.settings} />
              <main className="main-shell">
                <Header
                  title={title}
                  subtitle={subtitle}
                  actions={
                    <div className="button-row">
                      <button type="button" className="primary-button" onClick={() => navigate("/ordens-servico")}>Nova OS</button>
                      <button type="button" className="secondary-button" onClick={() => navigate("/orcamentos")}>Novo orçamento</button>
                      <button type="button" className="ghost-button" onClick={handleReset}>Resetar demo</button>
                    </div>
                  }
                />

                <div className="content-shell">
                  <Routes>
                    <Route path="/dashboard" element={<DashboardPage db={sortedDb} analytics={analytics} helpers={helpers} />} />
                    <Route path="/clientes" element={<CustomersPage db={sortedDb} helpers={helpers} onSave={saveCustomer} onDelete={deleteCustomer} />} />
                    <Route path="/motos" element={<BikesPage db={sortedDb} helpers={helpers} onSave={saveBike} onDelete={deleteBike} />} />
                    <Route path="/estoque" element={<InventoryPage db={sortedDb} onSave={saveInventory} onDelete={deleteInventory} onMove={moveInventory} />} />
                    <Route path="/orcamentos" element={<QuotesPage db={sortedDb} helpers={helpers} onSave={saveQuote} onDelete={deleteQuote} onStatusChange={changeQuoteStatus} onGenerateOrder={generateOrderFromQuote} onPrint={handlePrintQuote} />} />
                    <Route path="/ordens-servico" element={<OrdersPage db={sortedDb} draftOrder={draftOrder} helpers={helpers} onConsumeDraft={() => setDraftOrder(null)} onSave={saveOrder} onDelete={deleteOrder} onStatusChange={changeOrderStatus} onNotify={notifyCustomer} onPrint={handlePrintOrder} />} />
                    <Route path="/financeiro" element={<FinancePage db={sortedDb} onSave={saveFinance} />} />
                    <Route path="/agenda" element={<AgendaPage db={sortedDb} helpers={helpers} onSave={saveAgenda} onDelete={deleteAgenda} />} />
                    <Route path="/catalogo" element={<CatalogPage db={sortedDb} settings={db.settings} />} />
                    <Route path="/usuarios" element={<UsersPage db={sortedDb} onSave={saveUser} onDelete={deleteUser} />} />
                    <Route path="/relatorios" element={<ReportsPage analytics={analytics} onExport={handleExportReport} />} />
                    <Route path="/integracoes" element={<IntegrationsPage />} />
                    <Route path="/personalizacao" element={<SettingsPage settings={db.settings} onSave={saveSettings} />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </div>

                <Footer />
              </main>
            </div>
          }
        />
      </Routes>

      {printQuote && (
        <section className="print-sheet">
          <h1>{db.settings.shopName}</h1>
          <p>{db.settings.address} · WhatsApp {db.settings.whatsapp}</p>
          <h2>Orçamento</h2>
          <p>Cliente: {helpers.customerName(printQuote.customerId)}</p>
          <p>Moto: {helpers.bikeName(printQuote.bikeId)}</p>
          <p>Data: {printQuote.date}</p>
          <p>Validade: {printQuote.validUntil}</p>
          <p>Serviço: {printQuote.serviceDescription}</p>
          <ul>
            {printQuote.partItems.map((item, index) => (
              <li key={`${item.inventoryId}-${index}`}>{item.name} x{item.quantity} - {formatCurrency(item.unitPrice * item.quantity)}</li>
            ))}
          </ul>
          <p>Peças: {formatCurrency(printQuote.partsValue)}</p>
          <p>Mão de obra: {formatCurrency(printQuote.laborValue)}</p>
          <p>Desconto: {formatCurrency(printQuote.discount)}</p>
          <p>Total: {formatCurrency(printQuote.total)}</p>
          <p>Observações: {printQuote.notes || "--"}</p>
        </section>
      )}

      {printOrder && (
        <section className="print-sheet">
          <h1>{db.settings.shopName}</h1>
          <p>{db.settings.address} · WhatsApp {db.settings.whatsapp}</p>
          <h2>Ordem de Serviço</h2>
          <p>Cliente: {helpers.customerName(printOrder.customerId)}</p>
          <p>Moto: {helpers.bikeName(printOrder.bikeId)}</p>
          <p>Serviço: {printOrder.service}</p>
          <p>Mecânico responsável: {printOrder.mechanic}</p>
          <p>Entrada: {printOrder.entryDate}</p>
          <p>Previsão: {printOrder.dueDate}</p>
          <p>Status: {printOrder.status}</p>
          <ul>
            {printOrder.partItems.map((item, index) => (
              <li key={`${item.inventoryId}-${index}`}>{item.name} x{item.quantity} - {formatCurrency(item.unitPrice * item.quantity)}</li>
            ))}
          </ul>
          <p>Peças: {formatCurrency(printOrder.partsValue)}</p>
          <p>Mão de obra: {formatCurrency(printOrder.laborValue)}</p>
          <p>Total: {formatCurrency(printOrder.total)}</p>
          <p>Observações internas: {printOrder.internalNotes || "--"}</p>
          <p>Observações para o cliente: {printOrder.customerNotes || "--"}</p>
        </section>
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
