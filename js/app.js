(function(){
  const toggle=document.getElementById('themeToggle');
  toggle?.addEventListener('click',()=>document.documentElement.classList.toggle('light'));
  document.getElementById('prevPage').addEventListener('click',()=>{if(currentPage>1)BioLinkAPI.loadComments(currentPage-1)});
  document.getElementById('nextPage').addEventListener('click',()=>BioLinkAPI.loadComments(currentPage+1));
  const form=document.getElementById('commentForm');const status=document.getElementById('formStatus');
  form.addEventListener('submit',async e=>{e.preventDefault();const name=document.getElementById('name').value.trim().slice(0,40);const message=document.getElementById('message').value.trim().slice(0,600);if(!name||!message){status.textContent='Nom et message requis.';return}form.querySelector('button').disabled=true;status.textContent='Publication…';try{const res=await BioLinkAPI.addComment(name,message);if(res.ok){status.textContent='Merci !';form.reset();BioLinkAPI.loadComments(1)}else{status.textContent='Erreur: '+(res.error||'inconnue')}}catch(err){status.textContent='Erreur réseau.';console.error(err)}finally{form.querySelector('button').disabled=false}});
  if(SCRIPT_URL==='PASTE_YOUR_SCRIPT_URL_HERE'){document.getElementById('visitsValue').textContent='Config manquante';document.getElementById('commentsList').innerHTML='<li class="comment"><div class="meta">Info</div><div class="msg">Ouvre js/config.js et colle ton SCRIPT_URL Apps Script.</div></li>';return}
  BioLinkAPI.bumpVisits();BioLinkAPI.loadComments(1);
})();