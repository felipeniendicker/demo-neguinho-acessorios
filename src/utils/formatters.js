export function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(Number(value || 0));
}

export function formatDate(value) {
  if (!value) {
    return "--";
  }

  return new Intl.DateTimeFormat("pt-BR").format(new Date(`${value}T12:00:00`));
}

export function formatDateTime(value) {
  if (!value) {
    return "--";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

export function formatPhone(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 11);

  if (!digits) {
    return "";
  }

  if (digits.length <= 2) {
    return `(${digits}`;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function formatPlate(value) {
  const cleaned = String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 7);

  if (cleaned.length <= 3) {
    return cleaned;
  }

  return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
}

export function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}

export function currentDate() {
  return new Date().toISOString().slice(0, 10);
}

export function currentMonth() {
  return currentDate().slice(0, 7);
}

export function currentWeekKey() {
  const now = new Date();
  const jan1 = new Date(now.getFullYear(), 0, 1);
  const dayMs = 24 * 60 * 60 * 1000;
  const week = Math.ceil(((now - jan1) / dayMs + jan1.getDay() + 1) / 7);
  return `${now.getFullYear()}-${week}`;
}

export function monthKey(date) {
  return String(date || "").slice(0, 7);
}

export function weekKey(date) {
  if (!date) {
    return "";
  }

  const parsed = new Date(`${date}T12:00:00`);
  const jan1 = new Date(parsed.getFullYear(), 0, 1);
  const dayMs = 24 * 60 * 60 * 1000;
  const week = Math.ceil(((parsed - jan1) / dayMs + jan1.getDay() + 1) / 7);
  return `${parsed.getFullYear()}-${week}`;
}

export function fileNamesFromList(files) {
  return Array.from(files || []).map((file) => file.name);
}

export function buildWhatsappLink(phone, message) {
  const digits = String(phone || "").replace(/\D/g, "");
  return `https://wa.me/55${digits}?text=${encodeURIComponent(message)}`;
}

export function sumBy(items, getter) {
  return items.reduce((sum, item) => sum + Number(getter(item) || 0), 0);
}
