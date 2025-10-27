// js/config.js
// ===============================
// CONFIG CENTRALE – stable
// ===============================

// 👉 Remplace les deux valeurs ci-dessous :
const API_BASE  = 'https://script.google.com/macros/s/AKfycbz9gQGTL369m-CInZWcph746v3_YwXlIBcbL62_W05QcFa3jLbZre-RUM8peb6N88JbLw/exec'; // Web App "comments/visits"
const PHONE_API = 'https://script.google.com/macros/s/AKfycbxCaGjBFxk9mNcXvbxPolzVCMjtRXoi23ZbN6IASEoTDinebH1PHLjySBDry5eMq-0ubw/exec';    // Web App "phone"
// Astuce : si tu utilises un SEUL Web App pour tout, mets la même URL pour API_BASE et PHONE_API.


export const PER_PAGE = 6;

// ID visiteur anonyme (pas perso)
export function getCID() {
  let cid = localStorage.getItem('cid');
  if (!cid) {
    cid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('cid', cid);
  }
  return cid;
}

// POST JSON sans pré-requête CORS (en text/plain)
export async function postJSON(url, payload) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Helpers pratiques
export function api(payload) {
  // vers le Web App "comments/visits"
  return postJSON(API_BASE, payload);
}
export function phoneApi(payload) {
  // vers le Web App "phone" (peut être = API_BASE si tout-en-un)
  return postJSON(PHONE_API, payload);
}

// Expose aussi en global pour compat avec tes anciens scripts
window.CONFIG = {
  COMMENTS_API: API_BASE,
  PHONE_API: PHONE_API,
  PER_PAGE
};

export { API_BASE, PHONE_API };
