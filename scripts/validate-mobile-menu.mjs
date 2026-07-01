import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const CHROME_PATHS = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
];

async function findBrowser() {
  for (const browserPath of CHROME_PATHS) {
    try {
      await fs.access(browserPath);
      return browserPath;
    } catch {}
  }

  throw new Error("Nenhum Chrome/Edge local encontrado.");
}

async function delay(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Falha ao acessar ${url}: ${response.status}`);
  }

  return response.json();
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.nextId = 1;
    this.pending = new Map();
    this.sessionId = null;
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });

    this.ws.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data));

      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) {
          reject(new Error(message.error.message || "CDP error"));
        } else {
          resolve(message.result);
        }
      }
    });
  }

  send(method, params = {}, sessionId = this.sessionId) {
    const id = this.nextId++;
    const payload = { id, method, params };
    if (sessionId) {
      payload.sessionId = sessionId;
    }

    this.ws.send(JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
  }

  async close() {
    this.ws.close();
    await delay(200);
  }
}

function testFunctionSource() {
  return `(() => {
    const selectors = {
      headerToggle: '.mobile-menu-toggle, .mobile-menu-button',
      drawerClose: '.drawer-close',
      drawer: '.mobile-drawer, .sidebar.is-open',
      overlay: '.mobile-overlay, .sidebar-backdrop.is-open',
      navLinks: '.sidebar-nav a'
    };

    const queryAll = (selector) => Array.from(document.querySelectorAll(selector));
    const visibleCount = (selector) => queryAll(selector).filter((item) => {
      const style = window.getComputedStyle(item);
      const rect = item.getBoundingClientRect();
      const inViewport = rect.width > 0 && rect.height > 0 && rect.right > 0 && rect.bottom > 0 && rect.left < window.innerWidth && rect.top < window.innerHeight;
      return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && inViewport;
    }).length;

    const state = () => ({
      path: location.pathname,
      bodyClass: document.body.className,
      headerButtons: visibleCount(selectors.headerToggle),
      closeButtons: visibleCount(selectors.drawerClose),
      drawerVisible: visibleCount(selectors.drawer) > 0,
      overlayVisible: visibleCount(selectors.overlay) > 0,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      drawerDebug: (() => {
        const drawer = document.querySelector(selectors.drawer);
        const close = document.querySelector(selectors.drawerClose);
        if (!drawer) {
          return null;
        }

        const drawerRect = drawer.getBoundingClientRect();
        const drawerStyle = window.getComputedStyle(drawer);
        const closeRect = close ? close.getBoundingClientRect() : null;
        const closeStyle = close ? window.getComputedStyle(close) : null;

        return {
          drawerClass: drawer.className,
          drawerRect: {
            left: drawerRect.left,
            right: drawerRect.right,
            top: drawerRect.top,
            bottom: drawerRect.bottom,
            width: drawerRect.width,
            height: drawerRect.height
          },
          drawerTransform: drawerStyle.transform,
          drawerDisplay: drawerStyle.display,
          closeClass: close?.className || null,
          closeRect: closeRect
            ? {
                left: closeRect.left,
                right: closeRect.right,
                top: closeRect.top,
                bottom: closeRect.bottom,
                width: closeRect.width,
                height: closeRect.height
              }
            : null,
          closeDisplay: closeStyle?.display || null
        };
      })()
    });

    return {
      clickHeader: () => {
        const button = queryAll(selectors.headerToggle).find(Boolean);
        if (!button) return false;
        button.click();
        return true;
      },
      clickClose: () => {
        const button = queryAll(selectors.drawerClose).find(Boolean);
        if (!button) return false;
        button.click();
        return true;
      },
      clickOverlay: () => {
        const button = queryAll(selectors.overlay).find((item) => {
          const style = window.getComputedStyle(item);
          return style.display !== 'none' && style.pointerEvents !== 'none';
        });
        if (!button) return false;
        button.click();
        return true;
      },
      clickNavByText: (text) => {
        const link = queryAll(selectors.navLinks).find((item) => item.textContent.includes(text));
        if (!link) return false;
        link.click();
        return true;
      },
      state
    };
  })()`;
}

async function main() {
  const browserPath = await findBrowser();
  const userDataDir = await fs.mkdtemp(path.join(os.tmpdir(), "mobile-menu-check-"));
  const port = 9222;
  const chromeArgs = [
    `--remote-debugging-port=${port}`,
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=${userDataDir}`,
    "about:blank"
  ];

  const { spawn } = await import("node:child_process");
  const chrome = spawn(browserPath, chromeArgs, {
    detached: true,
    stdio: "ignore"
  });
  chrome.unref();

  let client;
  try {
    let browserInfo;
    for (let attempt = 0; attempt < 30; attempt += 1) {
      try {
        browserInfo = await fetchJson(`http://127.0.0.1:${port}/json/version`);
        break;
      } catch {
        await delay(250);
      }
    }

    if (!browserInfo?.webSocketDebuggerUrl) {
      throw new Error("Nao foi possivel conectar ao Chrome via CDP.");
    }

    client = new CDPClient(browserInfo.webSocketDebuggerUrl);
    await client.connect();

    const { targetId } = await client.send("Target.createTarget", { url: "http://127.0.0.1:4173/" }, null);
    const attached = await client.send("Target.attachToTarget", { targetId, flatten: true }, null);
    client.sessionId = attached.sessionId;

    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("DOM.enable");
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true
    });
    await client.send("Emulation.setTouchEmulationEnabled", {
      enabled: true,
      maxTouchPoints: 5
    });

    await delay(1500);

    async function evaluate(expression) {
      const result = await client.send("Runtime.evaluate", {
        expression,
        awaitPromise: true,
        returnByValue: true
      });
      return result.result.value;
    }

    async function waitFor(predicateExpression, timeout = 5000) {
      const started = Date.now();
      while (Date.now() - started < timeout) {
        const ok = await evaluate(predicateExpression);
        if (ok) {
          return true;
        }
        await delay(150);
      }
      throw new Error(`Timeout aguardando: ${predicateExpression}`);
    }

    await waitFor("document.readyState === 'complete'");
    await waitFor("!!document.querySelector('button')");

    await evaluate(`
      (() => {
        const button = Array.from(document.querySelectorAll('button')).find((item) =>
          item.textContent.toLowerCase().includes('entrar na demonstracao')
        );
        if (button) button.click();
      })()
    `);
    await delay(500);
    await waitFor("location.pathname === '/login'");

    await evaluate(`
      (() => {
        const button = Array.from(document.querySelectorAll('button')).find((item) =>
          item.textContent.toLowerCase().includes('entrar no sistema')
        );
        if (button) button.click();
      })()
    `);
    await delay(800);
    await waitFor("location.pathname === '/dashboard'");

    const apiExpr = testFunctionSource();

    const states = [];
    async function snapshot(label) {
      const state = await evaluate(`${apiExpr}.state()`);
      states.push({ label, ...state });
      return state;
    }

    async function action(label, script, waitMs = 350) {
      const result = await evaluate(`${apiExpr}.${script}`);
      await delay(waitMs);
      const state = await snapshot(label);
      return { result, state };
    }

    const initial = await snapshot("initial");
    if (initial.headerButtons !== 1 || initial.closeButtons !== 0 || initial.drawerVisible) {
      throw new Error(`Estado inicial inesperado: ${JSON.stringify(initial)}`);
    }

    const openA = await action("open-a", "clickHeader()");
    if (!openA.result || openA.state.headerButtons !== 0 || openA.state.closeButtons !== 1 || !openA.state.drawerVisible) {
      throw new Error(`Falha ao abrir menu na primeira vez: ${JSON.stringify(openA.state)}`);
    }

    const closeOverlay = await action("close-overlay", "clickOverlay()");
    if (!closeOverlay.result || closeOverlay.state.headerButtons !== 1 || closeOverlay.state.closeButtons !== 0 || closeOverlay.state.drawerVisible) {
      throw new Error(`Falha ao fechar pelo overlay: ${JSON.stringify(closeOverlay.state)}`);
    }

    const openB = await action("open-b", "clickHeader()");
    if (!openB.result || openB.state.headerButtons !== 0 || openB.state.closeButtons !== 1 || !openB.state.drawerVisible) {
      throw new Error(`Falha ao reabrir menu: ${JSON.stringify(openB.state)}`);
    }

    const closeX = await action("close-x", "clickClose()");
    if (!closeX.result || closeX.state.headerButtons !== 1 || closeX.state.closeButtons !== 0 || closeX.state.drawerVisible) {
      throw new Error(`Falha ao fechar pelo X: ${JSON.stringify(closeX.state)}`);
    }

    const openC = await action("open-c", "clickHeader()");
    if (!openC.result || openC.state.headerButtons !== 0 || openC.state.closeButtons !== 1 || !openC.state.drawerVisible) {
      throw new Error(`Falha ao abrir menu para navegar: ${JSON.stringify(openC.state)}`);
    }

    const goClientes = await action("navigate-clientes", "clickNavByText('Clientes')", 700);
    if (!goClientes.result || goClientes.state.path !== "/clientes" || goClientes.state.headerButtons !== 1 || goClientes.state.closeButtons !== 0 || goClientes.state.drawerVisible) {
      throw new Error(`Falha ao navegar para Clientes fechando o menu: ${JSON.stringify(goClientes.state)}`);
    }

    const openD = await action("open-d", "clickHeader()");
    if (!openD.result || openD.state.headerButtons !== 0 || openD.state.closeButtons !== 1 || !openD.state.drawerVisible) {
      throw new Error(`Falha ao abrir menu em Clientes: ${JSON.stringify(openD.state)}`);
    }

    await client.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
    await client.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
    await delay(400);
    const closeEsc = await snapshot("close-esc");
    if (closeEsc.headerButtons !== 1 || closeEsc.closeButtons !== 0 || closeEsc.drawerVisible) {
      throw new Error(`Falha ao fechar com ESC: ${JSON.stringify(closeEsc)}`);
    }

    console.log(JSON.stringify({ ok: true, states }, null, 2));
  } finally {
    if (client) {
      await client.close();
    }

    try {
      const { execFileSync } = await import("node:child_process");
      execFileSync("taskkill", ["/F", "/PID", String(chrome.pid)], { stdio: "ignore" });
    } catch {}
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
