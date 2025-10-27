// js/phone.js
(function(){
  const form = document.getElementById('phone-form');
  const input = document.getElementById('phone-captcha');
  const out   = document.getElementById('phone-out');

  if (!form) return;

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    out.textContent = '…';
    try {
      const res = await fetch(window.CONFIG.PHONE_API, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ captcha: (input.value||'').trim(), origin: location.origin })
      });
      const json = await res.json();
      out.textContent = json.ok ? json.phone : 'Erreur réseau';
    } catch(err){
      out.textContent = 'Erreur réseau';
    }
  });
})();
