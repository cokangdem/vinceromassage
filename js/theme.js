// js/theme.js
// Rôle: uniquement UI / autosize des cartes

function autoSpanCard(card) {
  const v = card.querySelector('.value');
  if (!v) return;

  const txt = v.textContent.trim();
  const isNumber = /^\d[\d\s.,]*$/.test(txt.replaceAll('\u202f',''));
  const lengthScore = txt.length;

  // Cartes larges forcées
  if (card.id === 'card-visits' || card.id === 'card-commentsCount') {
    card.classList.add('span-8');
    return;
  }

  // Heuristiques de taille en fonction du contenu
  if (isNumber && lengthScore >= 4) { card.classList.add('span-6'); return; }
  if (lengthScore >= 18)           { card.classList.add('span-6'); return; }
  if (lengthScore >= 30)           { card.classList.add('span-8'); return; }
}

function autosizeAll() {
  document.querySelectorAll('.card').forEach(c => {
    c.classList.remove('span-6','span-8','span-12');
    autoSpanCard(c);
  });
}

export function initTheme() {
  // Lancement + reflow
  window.addEventListener('load', autosizeAll);
  window.addEventListener('resize', autosizeAll);
  autosizeAll();

  // Petit helper global pour mettre à jour un texte + recalculer la taille
  window.ThemeCards = {
    setText(id, value) {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = value;
        autosizeAll();
      }
    }
  };
}
