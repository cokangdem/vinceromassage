import { API_BASE, PER_PAGE } from './config.js';
import { autosizeCards } from './theme.js';

const els = {
  visits: document.querySelector('#card-visits .value'),
  commentsCount: document.querySelector('#card-commentsCount .value'),
  commentsList: document.querySelector('#comments-list'),
  pagePrev: document.getElementById('prev-page'),
  pageNext: document.getElementById('next-page'),
  pageInd : document.getElementById('page-indicator'),
  formName: document.getElementById('comment-name'),
  formMsg : document.getElementById('comment-message'),
  formBtn : document.querySelector('#comment-form button[type=submit]'),
  phoneForm: document.getElementById('phone-form'),
  phoneCaptcha: document.getElementById('phone-captcha'),
  phoneOut: document.getElementById('phone-out'),
};

let page = 1;

/* ---------- helpers ---------- */
function visitorId() {
  let id = localStorage.getItem('visitor_id');
  if (!id) {
    id = crypto.getRandomValues(new Uint32Array(4)).join('-');
    localStorage.setItem('visitor_id', id);
  }
  return id;
}
async function apiGet(params) {
  const url = `${API_BASE}?${new URLSearchParams(params)}`;
  const res = await fetch(url, { mode:'cors' });
  if (!res.ok) throw new Error('HTTP '+res.status);
  return res.json();
}
async function apiPost(body) {
  const res = await fetch(API_BASE, {
    method:'POST',
    headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify(body),
    mode:'cors'
  });
  if (!res.ok) throw new Error('HTTP '+res.status);
  return res.json();
}

/* ---------- visits ---------- */
async function sendVisit() {
  try {
    await apiGet({ action:'visits', cid: visitorId() });
    const s = await apiGet({ action:'stats' });
    if (els.visits) els.visits.textContent = (s.visits ?? 0).toLocaleString('fr-FR');
  } catch { if (els.visits) els.visits.textContent = '—'; }
}

/* ---------- comments ---------- */
async function loadComments() {
  try {
    const { items, total } = await apiGet({ action:'list', page, per: PER_PAGE });
    if (els.commentsCount) els.commentsCount.textContent = String(total);
    renderComments(items);
    autosizeCards();
  } catch {
    if (els.commentsCount) els.commentsCount.textContent = '0';
    renderComments([]);
  }
}
function renderComments(items) {
  if (!els.commentsList) return;
  els.commentsList.innerHTML = '';
  if (!items.length) {
    els.commentsList.textContent = 'Aucun commentaire pour le moment.';
    return;
  }
  items.forEach(x => {
    const li = document.createElement('div');
    li.className = 'comment';
    li.innerHTML = `<div class="who">${x.name||'—'} · ${x.date||''}</div><div class="msg"></div>`;
    li.querySelector('.msg').textContent = x.message || '';
    els.commentsList.appendChild(li);
  });
}
async function addComment(ev) {
  ev.preventDefault();
  const name = (els.formName?.value || '').trim();
  const message = (els.formMsg?.value || '').trim();
  if (!message) return;
  try {
    els.formBtn && (els.formBtn.disabled = true);
    await apiPost({ name, message, cid: visitorId() });
    if (els.formName) els.formName.value = '';
    if (els.formMsg) els.formMsg.value = '';
    await loadComments();
  } catch (e) {
    alert("Impossible d'envoyer le commentaire.");
  } finally {
    els.formBtn && (els.formBtn.disabled = false);
  }
}

/* ---------- phone ---------- */
async function showPhone(ev) {
  ev.preventDefault();
  const cap = (els.phoneCaptcha?.value||'').trim();
  if (!cap) return;
  try {
    const r = await apiGet({ action:'phone', captcha: cap });
    els.phoneOut.textContent = r.phone || '—';
  } catch {
    els.phoneOut.textContent = 'Erreur réseau';
  }
}

/* ---------- pager ---------- */
function updatePager() {
  if (els.pageInd) els.pageInd.textContent = String(page);
  if (els.pagePrev) els.pagePrev.disabled = page <= 1;
}

/* ---------- init ---------- */
function init() {
  // visits
  sendVisit();

  // comments
  document.getElementById('comment-form')?.addEventListener('submit', addComment);
  els.pagePrev?.addEventListener('click', async ()=>{ if (page>1){ page--; updatePager(); await loadComments(); }});
  els.pageNext?.addEventListener('click', async ()=>{ page++; updatePager(); await loadComments(); });
  updatePager();
  loadComments();

  // phone
  els.phoneForm?.addEventListener('submit', showPhone);

  // cards autosize
  autosizeCards();
  window.addEventListener('resize', autosizeCards);
}
document.addEventListener('DOMContentLoaded', init);
