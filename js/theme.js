function autoSpanCard(card){
  const v = card.querySelector('.value');
  if(!v) return;
  const txt = v.textContent.trim();
  const isNumber = /^\d[\d\s.,]*$/.test(txt.replaceAll('\u202f',''));
  const lengthScore = txt.length;
  if (card.id === 'card-visits' || card.id === 'card-commentsCount'){
    card.classList.add('span-8');
    return;
  }
  if (isNumber && lengthScore >= 4) { card.classList.add('span-6'); return; }
  if (lengthScore >= 18) { card.classList.add('span-6'); return; }
  if (lengthScore >= 30) { card.classList.add('span-8'); return; }
}
function autosizeAll(){
  document.querySelectorAll('.card').forEach(c=>{
    c.classList.remove('span-6','span-8','span-12');
    autoSpanCard(c);
  });
}
window.addEventListener('load', autosizeAll);
window.addEventListener('resize', autosizeAll);

document.getElementById('phone-form')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const v = document.getElementById('phone-captcha').value.trim();
  if(v === '7'){
    document.getElementById('phone-out').textContent = '+33 6 12 34 56 78';
  }else{
    document.getElementById('phone-out').textContent = 'Erreur';
  }
});

const API = { list:null, add:null, count:null };
let page = 1; const PER_PAGE = 6;
function renderComments(items){
  const wrap = document.getElementById('comments-list');
  wrap.innerHTML = '';
  (items.items||items).forEach(x=>{
    const el = document.createElement('div');
    el.className = 'comment';
    el.innerHTML = '<div class="who">'+(x.name||'—')+' · '+(x.date||'')+'</div><div class="msg"></div>';
    el.querySelector('.msg').textContent = x.message||'';
    wrap.appendChild(el);
  });
  document.getElementById('comments-count').textContent = String(items.total || (items.items?items.items.length:items.length) || 0);
  autosizeAll();
}
async function fetchLocalDemo(){ return {items:[], total:0}; }
async function loadComments(){
  try{
    if(!API.list){ renderComments(await fetchLocalDemo()); return; }
    const res = await fetch(`${API.list}?page=${page}&per=${PER_PAGE}`);
    renderComments(await res.json());
  }catch(e){ console.warn('Comments error', e); renderComments({items:[],total:0}); }
}
document.getElementById('comment-form')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const name = (document.getElementById('comment-name').value||'').trim();
  const message = (document.getElementById('comment-message').value||'').trim();
  if(!message) return;
  try{
    if(!API.add){
      document.getElementById('comment-name').value = '';
      document.getElementById('comment-message').value = '';
      await loadComments(); return;
    }
    await fetch(API.add, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name, message})});
    document.getElementById('comment-name').value = '';
    document.getElementById('comment-message').value = '';
    await loadComments();
  }catch(e){ console.warn(e) }
});
document.getElementById('prev-page')?.addEventListener('click', ()=>{ if(page>1){page--; loadComments(); updatePager();}});
document.getElementById('next-page')?.addEventListener('click', ()=>{ page++; loadComments(); updatePager();});
function updatePager(){ document.getElementById('page-indicator').textContent = String(page); document.getElementById('prev-page').disabled = page<=1; }
updatePager(); loadComments();
window.ThemeCards = { setText(id, value){ const el = document.getElementById(id); if(el){ el.textContent = value; autosizeAll(); } } };
