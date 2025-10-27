import { API_BASE } from './config.js';

export async function initVisits() {
  const el = document.getElementById('visits-value');
  if (!el) return;

  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "visits_inc" })
    });
    const data = await res.json();
    el.textContent = data.visits || 0;
  } catch {
    el.textContent = "—";
  }
}
