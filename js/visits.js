// js/visits.js
import { fetchJSON, getCID } from './config.js';

// Exige un élément:  <div id="visits-value">—</div>
export async function initVisits() {
  const el = document.getElementById('visits-value');
  if (!el) return;

  el.textContent = '…';

  try {
    // Le backend doit gérer le cooldown (cache) pour compter proprement.
    const data = await fetchJSON({ action: 'visit', cid: getCID() });
    // Réponses attendues: { ok:true, total: number } ou { ok:false, error: string }
    el.textContent = data?.ok ? String(data.total ?? 0) : '—';
  } catch (e) {
    console.error(e);
    el.textContent = '—';
  }
}
