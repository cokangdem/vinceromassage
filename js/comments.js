const qs = (s, el=document)=>el.querySelector(s);
function getClientId(){let id=localStorage.getItem('clientId');if(!id){id=crypto.randomUUID();localStorage.setItem('clientId',id)}return id}
async function apiGet(params){const url=new URL(SCRIPT_URL);Object.entries(params).forEach(([k,v])=>url.searchParams.set(k,v));const r=await fetch(url,{method:'GET',mode:'cors'});if(!r.ok)throw new Error('GET '+r.status);return r.json()}
async function apiPost(body){const r=await fetch(SCRIPT_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),mode:'cors'});if(!r.ok)throw new Error('POST '+r.status);return r.json()}
let currentPage=1;
async function loadComments(page=1){try{const d=await apiGet({action:'list',page,pageSize:PAGE_SIZE});const ul=qs('#commentsList');ul.innerHTML='';d.items.forEach(c=>{const li=document.createElement('li');li.className='comment';const dt=new Date(c.timestamp).toLocaleString();li.innerHTML='<div class="meta">'+escapeHtml(c.name)+' — '+dt+'</div><div class="msg">'+escapeHtml(c.message)+'</div>';ul.appendChild(li)});qs('#commentsCount').textContent=d.total;currentPage=d.page;qs('#pageInfo').textContent=d.page+' / '+Math.max(1,Math.ceil(d.total/PAGE_SIZE));qs('#prevPage').disabled=d.page<=1;qs('#nextPage').disabled=(d.page*PAGE_SIZE)>=d.total}catch(e){console.error(e)}}
async function addComment(name,message){return apiPost({action:'add',name,message})}
async function bumpVisits(){try{const d=await apiPost({action:'visits',cid:getClientId()});qs('#visitsValue').textContent=d.visits}catch(e){console.error(e)}}
function escapeHtml(s=''){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
window.BioLinkAPI={loadComments,addComment,bumpVisits};