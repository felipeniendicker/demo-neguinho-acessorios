import { createSeedData } from "../data/seedData.js";

const STORAGE_KEY = "motogestao-pro-opcao3";

export function loadDatabase() {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    const seeded = createSeedData();
    saveDatabase(seeded);
    return seeded;
  }

  try {
    return JSON.parse(raw);
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
