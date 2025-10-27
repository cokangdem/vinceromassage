// js/phone.js
import { fetchJSON, getCID } from './config.js';

// HTML attendu :
// <form id="phone-form">
//   <input id="phone-captcha" ...>
//   <button type="submit">Afficher</button>
// </form>
// <div id="phone-out"></div>

export function initPhone() {
  const form = document.getElementById('phone-form');
  const out  = document.getElementById('phone-out');
  if (!form || !out) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const answer = (document.getElementById('phone-captcha')?.value || '').trim();
    out.textContent = '...';

    try {
      // Côté Apps Script, action 'reveal' doit retourner { ok:true, phone:'...' }
      const data = await fetchJSON({ action: 'reveal', answer, cid: getCID() });
      out.textContent = data?.ok ? (data.phone || '—') : (data?.error || 'Erreur');
    } catch (err) {
      console.error(err);
      out.textContent = 'Erreur réseau';
    }
  });
}
