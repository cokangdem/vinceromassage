import { SITE } from './data.js';

const $ = (s) => document.querySelector(s);

let selectedRating = 5;

function setText(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}

function telHref() {
  return 'tel:+' + SITE.phoneInternational.replace(/\D/g, '');
}

function whatsappHref() {
  return (
    'https://wa.me/' +
    SITE.phoneInternational.replace(/\D/g, '') +
    '?text=' +
    encodeURIComponent('Bonjour Vincent,')
  );
}

function telegramHref() {
  return 'https://t.me/' + SITE.telegramUsername.replace('@', '');
}

function stars(rating = 5) {
  const n = Math.max(1, Math.min(5, Number(rating) || 5));
  return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);
}

function fillSite() {
  setText('#year', new Date().getFullYear());
  $('#phone-link').textContent = SITE.phoneDisplay;
  $('#phone-link').href = telHref();
  $('#call-link').href = telHref();
  $('#whatsapp-link').href = whatsappHref();
  $('#telegram-link').href = telegramHref();
}

function renderReviews(items = []) {
  const list = $('#reviews-list');
  const summaryStars = document.querySelector('.rating-line .stars');

  list.innerHTML = '';

  if (!items.length) {
    list.innerHTML = '<p class="empty-reviews">Vos mots trouveront leur place ici.</p>';
    setText('#review-summary', 'Aucun avis affiché pour le moment.');

    if (summaryStars) {
      summaryStars.textContent = '';
    }

    return;
  }

  items.forEach((r) => {
    const a = document.createElement('article');
    a.innerHTML = '<blockquote></blockquote><cite></cite><div class="stars"></div>';
    a.querySelector('blockquote').textContent = '“' + (r.message || '') + '”';
    a.querySelector('cite').textContent = '— ' + (r.name || 'Anonyme');
    a.querySelector('.stars').textContent = r.rating ? stars(r.rating) : '';
    list.appendChild(a);
  });

  const rated = items.filter(r => Number(r.rating) >= 1 && Number(r.rating) <= 5);
  const avg = rated.length ? rated.reduce((sum, r) => sum + Number(r.rating), 0) / rated.length : 0;

  if (summaryStars) {
    summaryStars.textContent = avg ? stars(Math.round(avg)) : '';
  }

  setText(
    '#review-summary',
    `${avg ? avg.toFixed(1) + '/5 — ' : ''}${items.length} témoignage${items.length > 1 ? 's' : ''}`
  );
}

async function loadReviews() {
  if (!SITE.googleAppsScriptUrl) {
    renderReviews(SITE.fallbackReviews || []);
    return;
  }

  try {
    const res = await fetch(SITE.googleAppsScriptUrl + '?action=list&page=1&pageSize=6');
    const data = await res.json();

    if (!data.ok) throw new Error();

    const reviews = data.reviews || data.items || [];
    renderReviews(reviews.length ? reviews : []);
  } catch {
    renderReviews(SITE.fallbackReviews || []);
  }
}

let refreshRating = () => {};
function setupRatingPicker() {
  const buttons = document.querySelectorAll('.rating-picker button');
  const input = $('#review-rating');

  if (!buttons.length || !input) return;

  function refresh() {
    buttons.forEach((btn) => {
      const value = Number(btn.dataset.rating);
      btn.classList.toggle('active', value <= selectedRating);
      btn.setAttribute('aria-pressed', value <= selectedRating ? 'true' : 'false');
    });

    input.value = selectedRating;
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedRating = Number(btn.dataset.rating) || 5;
      refresh();
    });
  });

  refreshRating = refresh;
  refresh();
}

async function submitReview(e) {
  e.preventDefault();

  const status = $('#review-status');
  const name = $('#review-name').value.trim();
  const message = $('#review-message').value.trim();
  const privateMessage = $('#review-private-message').value.trim();
  const rating = Number($('#review-rating')?.value || selectedRating || 5);

  if (!message) {
    status.textContent = 'Écris au moins un petit message.';
    return;
  }

  if (!SITE.googleAppsScriptUrl) {
    status.textContent = 'Aucune connexion aux avis n’est configurée pour le moment.';
    return;
  }

  const submit = $('#review-form button[type=submit]');
  if (submit.disabled) return;
  submit.disabled = true;
  status.textContent = 'Envoi…';

  try {
    const res = await fetch(SITE.googleAppsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'add',
        name,
        message,
        privateMessage,
        rating
      })
    });

    const data = await res.json();

    if (!data.ok) throw new Error(data.error || 'Erreur');

    $('#review-name').value = '';
    $('#review-message').value = '';
    $('#review-private-message').value = '';
    selectedRating = 5;
    refreshRating();

    status.textContent = '';
    $('#review-dialog').close();
    showReviewConfirmation();

    await loadReviews();
  } catch {
    status.textContent = 'Impossible de publier pour le moment. Réessayez dans quelques instants.';
  } finally {
    submit.disabled = false;
  }
}

fillSite();
setupRatingPicker();
loadReviews();

$('#review-form').addEventListener('submit', submitReview);
const dialog = $('#review-dialog');
$('#open-review').addEventListener('click', () => dialog.showModal());
$('#close-review').addEventListener('click', () => dialog.close());
const panels = $('#panels');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('[data-panel]').forEach(button => {
  button.addEventListener('click', () => {
    const target = document.getElementById(button.dataset.panel);
    if (window.matchMedia('(max-width: 720px)').matches) {
      panels.scrollTo({left: target.offsetLeft - panels.offsetLeft, behavior: reduced.matches ? 'instant' : 'smooth'});
    } else { target.scrollIntoView({block: 'nearest', behavior: reduced.matches ? 'instant' : 'smooth'}); }
  });
});
panels.addEventListener('scroll', () => {
  const current = panels.scrollLeft > panels.clientWidth / 2 ? 'avis' : 'presentation';
  document.querySelectorAll('nav [data-panel]').forEach(button => {
    if (button.dataset.panel === current) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
  });
}, {passive: true});

let confirmationTimer;
function showReviewConfirmation() {
  const toast = $('#review-toast');
  clearTimeout(confirmationTimer);
  toast.hidden = false;
  confirmationTimer = setTimeout(() => { toast.hidden = true; }, 10000);
}
$('#dismiss-toast').addEventListener('click', () => {
  clearTimeout(confirmationTimer);
  $('#review-toast').hidden = true;
});

const returnDialogs = new WeakMap();
document.querySelectorAll('[data-dialog]').forEach(button => {
  button.addEventListener('click', () => {
    const target = document.getElementById(button.dataset.dialog);
    const current = button.closest('dialog');
    if (current?.open) {
      current.close();
      returnDialogs.set(target, current);
    }
    target.showModal();
  });
});
document.querySelectorAll('dialog').forEach(modal => {
  modal.querySelector('[data-close-dialog]')?.addEventListener('click', () => modal.close());
  modal.addEventListener('click', event => {
    if (event.target !== modal) return;
    const bounds = modal.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) modal.close();
  });
  modal.addEventListener('close', () => {
    const previous = returnDialogs.get(modal);
    returnDialogs.delete(modal);
    if (previous && !previous.open) previous.showModal();
  });
});
