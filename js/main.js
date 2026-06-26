<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Massage+ : espace personnel de détente et de massage bien-être à Vienne (38200).">
  <title>Massage+ — Détente & présence</title>
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/styles.css">
</head>

<body>
<header class="topbar">
  <a class="brand" href="#accueil">
    <img src="assets/favicon.svg" alt="">
    <span>
      <strong id="brand-name">Massage+</strong>
      <small id="brand-subtitle">Détente, présence et bienveillance</small>
    </span>
  </a>

  <button class="menu-button" id="menu-button" aria-label="Ouvrir le menu">☰</button>

  <nav id="nav">
    <a href="#accueil">Accueil</a>
    <a href="#apropos">À propos</a>
    <a href="#approche">Approche</a>
    <a href="#avis">Retours</a>
    <a href="#contact">Contact</a>
  </nav>
</header>

<main>
  <section class="hero compact-hero" id="accueil">
    <div class="hero-text">
      <p class="eyebrow" id="hero-kicker">Sur rendez-vous à Vienne</p>
      <h1 id="hero-title">Un espace de détente pensé pour les hommes.</h1>
      <p id="hero-text">
        Je propose des massages bien-être dans un cadre calme, respectueux et bienveillant.
      </p>

      <div class="cta-row">
        <a class="btn primary" id="cta-whatsapp" href="#">Prendre contact</a>
        <a class="btn ghost" href="#apropos">Découvrir l’approche</a>
      </div>
    </div>

    <div class="hero-panel" aria-label="Informations principales">
      <p class="hero-panel-title">Massage bien-être</p>
      <p>🌿 Détente</p>
      <p>👐 Écoute</p>
      <p>📍 <span id="location-card">Vienne (38200)</span></p>
      <p>🌈 Accueil gay-friendly</p>
    </div>
  </section>

  <section class="features small-features" aria-label="Informations rapides">
    <article>
      <span>🌿</span>
      <h3>Détente</h3>
      <p>Un moment pour ralentir et relâcher les tensions.</p>
    </article>

    <article>
      <span>👐</span>
      <h3>Présence</h3>
      <p>Une écoute simple, calme et attentive.</p>
    </article>

    <article>
      <span>🌈</span>
      <h3>Gay-friendly</h3>
      <p>Un accueil bienveillant, sans jugement.</p>
    </article>

    <article>
      <span>✨</span>
      <h3>Expérience</h3>
      <p id="experience-card">Plus de 15 ans de pratique et d’expérience.</p>
    </article>
  </section>

  <section class="section split" id="apropos">
    <div>
      <p class="eyebrow">À propos</p>
      <h2 id="about-title">Une approche simple et respectueuse.</h2>
      <p id="about-text">
        Depuis plus de quinze ans, je pratique le massage bien-être dans une approche humaine,
        attentive et sans jugement.
      </p>
    </div>

    <div class="soft-card">
      <h3>Cadre</h3>
      <ul id="framework-list"></ul>
    </div>
  </section>

  <section class="section" id="approche">
    <p class="eyebrow">Approche</p>
    <h2>Ce que je privilégie</h2>
    <div class="cards" id="services"></div>
  </section>

  <section class="section reviews-contact" id="avis">
    <div>
      <p class="eyebrow">Retours</p>
      <h2>Retours d’expérience</h2>

      <div class="rating-line">
        <span class="stars">☆☆☆☆☆</span>
        <span id="review-summary">Aucun avis affiché pour le moment.</span>
      </div>

      <div class="reviews" id="reviews-list"></div>

      <form class="review-form" id="review-form">
        <h3>Laisser un retour</h3>

        <input id="review-name" maxlength="40" placeholder="Votre prénom" autocomplete="name">

        <div class="rating-picker" aria-label="Note">
          <input type="hidden" id="review-rating" value="5">
          <button type="button" data-rating="1" aria-label="1 étoile">★</button>
          <button type="button" data-rating="2" aria-label="2 étoiles">★</button>
          <button type="button" data-rating="3" aria-label="3 étoiles">★</button>
          <button type="button" data-rating="4" aria-label="4 étoiles">★</button>
          <button type="button" data-rating="5" aria-label="5 étoiles">★</button>
        </div>

        <textarea id="review-message" maxlength="700" placeholder="Votre message"></textarea>

        <button class="btn primary" type="submit">Publier</button>
        <p class="form-status" id="review-status"></p>
      </form>
    </div>

    <aside class="contact-card" id="contact">
      <h2>Me contacter</h2>
      <p id="contact-name">Vincent</p>

      <p class="contact-meta">📍 <span id="contact-location">Vienne (38200)</span></p>
      <p class="contact-meta">🌈 Accueil gay-friendly</p>

      <a class="phone" id="phone-link" href="#">06 38 20 23 99</a>

      <div class="contact-buttons">
        <a class="btn primary" id="whatsapp-link" href="#">WhatsApp</a>
        <a class="btn telegram" id="telegram-link" href="#">Telegram</a>
        <a class="btn ghost" id="call-link" href="#">Appeler</a>
      </div>

      <p class="small" id="contact-note">Prise de contact uniquement sur rendez-vous.</p>
    </aside>
  </section>
</main>

<footer>
  <span id="footer-name">Massage+</span> —
  <span id="year"></span> · Page personnelle
</footer>

<script type="module" src="js/main.js"></script>
</body>
</html>
