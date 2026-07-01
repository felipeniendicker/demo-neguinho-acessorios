import { createSeedData } from "../data/seedData.js";

const STORAGE_KEY = "motogestao-pro-opcao3";

function normalizeDatabase(data) {
  const seeded = createSeedData();

  return {
    ...seeded,
    ...data,
    customers: data?.customers || seeded.customers,
    bikes: data?.bikes || seeded.bikes,
    inventory: data?.inventory || seeded.inventory,
    quotes: data?.quotes || seeded.quotes,
    orders: data?.orders || seeded.orders,
    finance: data?.finance || seeded.finance,
    sales: data?.sales || seeded.sales,
    agenda: data?.agenda || seeded.agenda,
    users: data?.users || seeded.users,
    settings: { ...seeded.settings, ...(data?.settings || {}) },
    meta: { ...seeded.meta, ...(data?.meta || {}) }
  };
}

export function loadDatabase() {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    const seeded = createSeedData();
    saveDatabase(seeded);
    return seeded;
  }

  try {
    const parsed = JSON.parse(raw);
    const normalized = normalizeDatabase(parsed);
    saveDatabase(normalized);
    return normalized;
  } catch {
    const seeded = createSeedData();
    saveDatabase(seeded);
    return seeded;
  }
}

export function saveDatabase(data) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetDatabase() {
  const seeded = createSeedData();
  saveDatabase(seeded);
  return seeded;
}
