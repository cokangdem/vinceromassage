// Gère uniquement l'apparence des cartes (dimension automatique)
export function autosizeCards() {
  document.querySelectorAll('.card').forEach(card => {
    card.classList.remove('span-6','span-8');

    const v = card.querySelector('.value');
    if (!v) return;

    const txt = v.textContent.trim();
    const isNum = /^\d[\d\s.,]*$/.test(txt.replaceAll('\u202f',''));

    // cartes importantes toujours larges
    if (card.id === 'card-visits' || card.id === 'card-commentsCount') {
      card.classList.add('span-8');
      return;
    }

    // ajustement selon longueur du texte
    if (isNum && txt.length >= 4)  card.classList.add('span-6');
    else if (txt.length >= 28)     card.classList.add('span-6');
  });
}
