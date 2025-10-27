import { API_BASE } from './config.js';

let page = 1;
const PER = 6;

export async function initComments() {
  loadCount();
  loadList();

  document.getElementById('comment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name').trim();
    const message = fd.get('message').trim();
    if (!name || !message) return;

    await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "comments_add", name, message })
    });
    e.currentTarget.reset();
    loadCount();
    loadList();
  });

  document.getElementById('prev-page').addEventListener('click', () => {
    if (page > 1) { page--; loadList(); }
  });
  document.getElementById('next-page').addEventListener('click', () => {
    page++; loadList();
  });
}

async function loadList() {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "comments_list", page, per: PER })
  });
  const data = await res.json();
  const wrap = document.getElementById('comments-list');
  wrap.innerHTML = "";
  data.items?.forEach(c => {
    const div = document.createElement('div');
    div.className = 'comment';
    div.innerHTML = `<div class="meta">${c.name} • ${new Date(c.ts).toLocaleString()}</div>
                     <div>${c.message}</div>`;
    wrap.appendChild(div);
  });
  document.getElementById('page-indicator').textContent = `${data.page}/${data.pages}`;
}

async function loadCount() {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "comments_count" })
  });
  const data = await res.json();
  document.getElementById('comments-count').textContent = data.count;
}
