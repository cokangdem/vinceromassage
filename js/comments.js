// js/comments.js
import { fetchJSON, getCID, COMMENTS_PER_PAGE } from './config.js';

// HTML attendu :
// <form id="comment-form">
//   <input id="comment-name" ...>
//   <textarea id="comment-message"></textarea>
//   <button type="submit">Publier</button>
// </form>
// <div id="comments-list"></div>
// <span id="comments-count">0</span>
// <button id="prev-page">←</button> <span id="page-current">1</span> <button id="next-page">→</button>

let page = 1;
let total = 0;

export async function initComments() {
  const form   = document.getElementById('comment-form');
  const prevBt = document.getElementById('prev-page');
  const nextBt = document.getElementById('next-page');

  await refreshComments();

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await addComment();
    });
  }

  if (prevBt) prevBt.addEventListener('click', async () => {
    if (page > 1) { page--; await refreshComments(); }
  });

  if (nextBt) nextBt.addEventListener('click', async () => {
    const maxPage = Math.max(1, Math.ceil(total / COMMENTS_PER_PAGE));
    if (page < maxPage) { page++; await refreshComments(); }
  });
}

async function refreshComments() {
  await Promise.all([updateCount(), listPage()]);
  updatePager();
}

async function updateCount() {
  const badge = document.getElementById('comments-count');
  try {
    const data = await fetchJSON({ action: 'count' });
    total = data?.ok ? Number(data.total || 0) : 0;
    if (badge) badge.textContent = String(total);
  } catch (e) {
    console.error(e);
  }
}

async function listPage() {
  const listEl = document.getElementById('comments-list');
  if (!listEl) return;
  listEl.innerHTML = '…';

  try {
    const data = await fetchJSON({ action: 'list', page, pageSize: COMMENTS_PER_PAGE });
    if (!data?.ok) { listEl.textContent = 'Erreur'; return; }

    const items = data.items || [];
    if (!items.length) { listEl.textContent = 'Aucun commentaire'; return; }

    listEl.innerHTML = items.map(r => renderComment(r)).join('');
  } catch (e) {
    console.error(e);
    listEl.textContent = 'Erreur réseau';
  }
}

function renderComment(r) {
  const name = escapeHtml(r.name || 'Anonyme');
  const msg  = escapeHtml(r.message || '');
  const ts   = r.timestamp ? new Date(r.timestamp).toLocaleString() : '';
  return `
    <div class="comment">
      <div class="comment-meta">${name} — <span class="comment-date">${ts}</span></div>
      <div class="comment-body">${msg}</div>
    </div>`;
}

async function addComment() {
  const nameEl = document.getElementById('comment-name');
  const msgEl  = document.getElementById('comment-message');
  if (!nameEl || !msgEl) return;

  const name = nameEl.value.trim();
  const message = msgEl.value.trim();
  if (!name || !message) return;

  try {
    const data = await fetchJSON({ action: 'add', name, message, cid: getCID() });
    if (data?.ok) {
      msgEl.value = '';
      // Recharge la page 1 par défaut (ou reste sur la page courante)
      page = 1;
      await refreshComments();
    } else {
      alert(data?.error || 'Erreur');
    }
  } catch (e) {
    console.error(e);
    alert('Erreur réseau');
  }
}

function updatePager() {
  const cur = document.getElementById('page-current');
  const maxPage = Math.max(1, Math.ceil(total / COMMENTS_PER_PAGE));
  if (cur) cur.textContent = String(page) + (maxPage > 1 ? ` / ${maxPage}` : '');
}

// Petite protection XSS
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
