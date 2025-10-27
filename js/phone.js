import { API_BASE } from './config.js';

export function initPhone() {
  const form = document.getElementById('phone-form');
  const out = document.getElementById('phone-out');
  if (!form || !out) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const answer = document.getElementById('phone-captcha').value.trim();
    out.textContent = '...';
    try {
      const r = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reveal", answer })
      });
      const data = await r.json();
      out.textContent = data.ok ? data.phone : "Erreur";
    } catch {
      out.textContent = "Erreur réseau";
    }
  });
}
