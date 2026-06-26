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
    encodeURIComponent('Bonjour, je vous contacte pour prendre rendez-vous pour un massage.')
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
  setText('#brand-name', SITE.brandName);
  setText('#brand-subtitle', SITE.brandSubtitle);
  setText('#footer-name', SITE.brandName);
  setText('#hero-kicker', SITE.heroKicker);
  setText('#hero-title', SITE.heroTitle);
  setText('#hero-text', SITE.heroText);
  setText('#about-title', SITE.aboutTitle);
  setText('#about-text', SITE.aboutText);
  setText('#location-card', SITE.location);
  setText('#experience-card', SITE.experience);
  setText('#contact-name', SITE.practitionerName || SITE.brandName);
  setText('#contact-note', SITE.contactNote);
  setText('#year', new Date().getFullYear());

  const phone = $('#phone-link');
  phone.textContent = SITE.phoneDisplay;
  phone.href = telHref();

  $('#call-link').href = telHref();
  $('#whatsapp-link').href = whatsappHref();
  $('#cta-whatsapp').href = whatsappHref();
  $('#telegram-link').href = telegramHref();

  const fw = $('#framework-list');
  fw.innerHTML = '';
  SITE.framework.forEach((x) => {
    const li = document.createElement('li');
    li.textContent = x;
    fw.appendChild(li);
  });

  const services = $('#services');
  services.innerHTML = '';
  SITE.services.forEach((s) => {
    const a = document.createElement('article');
    a.innerHTML = `<span class="tag"></span><h3></h3><p></p>`;
    a.querySelector('.tag').textContent = s.tag;
    a.querySelector('h3').textContent = s.title;
    a.querySelector('p').textContent = s.text;
    services.appendChild(a);
  });
}

function renderReviews(items = []) {
  const list = $('#reviews-list');
  const summaryStars = document.querySelector('.rating-line .stars');

  list.innerHTML = '';

  if (!items.length) {
    list.innerHTML = '<p class="empty-reviews">Aucun retour affiché pour le moment.</p>';
    setText('#review-summary', 'Aucun avis affiché pour le moment.');

    if (summaryStars) {
      summaryStars.textContent = '☆☆☆☆☆';
    }

    return;
  }

  items.slice(0, 6).forEach((r) => {
    const a = document.createElement('article');
    a.innerHTML = '<blockquote></blockquote><cite></cite><div class="stars"></div>';
    a.querySelector('blockquote').textContent = '“' + (r.message || '') + '”';
    a.querySelector('cite').textContent = '— ' + (r.name || 'Anonyme');
    a.querySelector('.stars').textContent = stars(r.rating);
    list.appendChild(a);
  });

  const avg =
    items.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / items.length;

  if (summaryStars) {
    summaryStars.textContent = stars(Math.round(avg));
  }

  setText(
    '#review-summary',
    `${avg.toFixed(1)}/5 — ${items.length} avis affiché${items.length > 1 ? 's' : ''}.`
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

  refresh();
}

async function submitReview(e) {
  e.preventDefault();

  const status = $('#review-status');
  const name = $('#review-name').value.trim();
  const message = $('#review-message').value.trim();
  const rating = Number($('#review-rating')?.value || selectedRating || 5);

  if (!message) {
    status.textContent = 'Écris au moins un petit message.';
    return;
  }

  if (!SITE.googleAppsScriptUrl) {
    status.textContent = 'Aucune connexion aux avis n’est configurée pour le moment.';
    return;
  }

  status.textContent = 'Publication…';

  try {
    const res = await fetch(SITE.googleAppsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'add',
        name,
        message,
        rating
      })
    });

    const data = await res.json();

    if (!data.ok) throw new Error(data.error || 'Erreur');

    $('#review-name').value = '';
    $('#review-message').value = '';
    selectedRating = 5;
    setupRatingPicker();

    status.textContent = data.message || 'Merci, votre avis sera affiché après validation.';

    await loadReviews();
  } catch {
    status.textContent = 'Impossible de publier pour le moment.';
  }
}

fillSite();
setupRatingPicker();
loadReviews();

$('#review-form').addEventListener('submit', submitReview);
$('#menu-button').addEventListener('click', () => $('#nav').classList.toggle('open'));
