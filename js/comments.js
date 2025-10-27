// js/comments.js
(function(){
  const API = window.CONFIG.COMMENTS_API;
  const listEl   = document.getElementById('comments-list');
  const countEl  = document.getElementById('comments-count');
  const form     = document.getElementById('comment-form');
  const nameIn   = document.getElementById('comment-name');
  const msgIn    = document.getElementById('comment-message');
  const prevBtn  = document.getElementById('prev-page');
  const nextBtn  = document.getElementById('next-page');
  const pageInd  = document.getElementById('page-indicator');

  let page = 1, per = 6, total = 0;

  async function fetchJSON(url, opt){
    const r = await fetch(url, opt);
    return r.json();
  }
  function render(items){
    listEl.innerHTML = '';
    items.forEach(x=>{
      const div = document.createElement('div');
      div.className = 'comment';
      div.innerHTML = `<div class="who">${x.name} · ${x.date||''}</div><div class="msg"></div>`;
      div.querySelector('.msg').textContent = x.message||'';
      listEl.appendChild(div);
    });
  }
  async function load(){
    try{
      const data = await fetchJSON(`${API}?action=list&page=${page}&per=${per}`);
      if(!data.ok) throw new Error(data.error||'');
      total = data.total||0;
      render(data.items||[]);
      if (countEl) countEl.textContent = String(total);
      updatePager();
    }catch(e){
      listEl.innerHTML = '<div class="empty">Erreur réseau</div>';
      if (countEl) countEl.textContent = '0';
    }
  }
  function updatePager(){
    pageInd && (pageInd.textContent = String(page));
    prevBtn && (prevBtn.disabled = page<=1);
    const maxPage = Math.max(1, Math.ceil(total/Math.max(1,per)));
    nextBtn && (nextBtn.disabled = page>=maxPage);
  }

  form && form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const name = (nameIn.value||'').trim();
    const message = (msgIn.value||'').trim();
    if(!message) return;
    try{
      const res = await fetch(API, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ name, message })
      });
      const json = await res.json();
      if(!json.ok) throw 0;
      nameIn.value = ''; msgIn.value = '';
      page = 1; // remonter au début
      await load();
    }catch(e){
      alert('Impossible de publier pour le moment.');
    }
  });

  prevBtn && prevBtn.addEventListener('click', ()=>{ if(page>1){page--; load();} });
  nextBtn && nextBtn.addEventListener('click', ()=>{ page++; load(); });

  load();
})();
