// js/config.js
// ===============================
// Configuration + petites utilités partagées
// ===============================

// 1) METS ICI TON URL Apps Script (celle en /exec)
export const API_BASE = 'https://script.google.com/macros/s/AKfycbyhLrjCyxWo0QbI43CE8fYCrc6d0whTfIEkUj09WW94nU2GonKCgOhI7BiM9fZS3sp2LA/exec';

// 2) Pagination des commentaires
export const PER_PAGE = 6;

// 3) ID anonyme pour différencier les visiteurs (pas perso)
export function getCID() {
  let cid = localStorage.getItem('cid');
  if (!cid) {
    cid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('cid', cid);
  }
  return cid;
}

// 4) fetch JSON sans pré-requête CORS (Content-Type "text/plain")
export async function fetchJSON(payload) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
