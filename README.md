# Massage+ — landing page zen

Site statique prêt pour Cloudflare Pages, GitHub Pages ou Netlify.

## Personnaliser
Modifie `js/config.js` :
- téléphone affiché
- téléphone international pour WhatsApp/appel
- pseudo Telegram
- URL Google Apps Script pour les avis

## Avis via Google Sheets
1. Crée un Google Sheet.
2. Extensions → Apps Script.
3. Colle `appsScript/Code.gs`.
4. Déploie en Web App : accès “Tout le monde”.
5. Copie l’URL `/exec` dans `reviewsApi` dans `js/config.js`.
6. Les avis envoyés arrivent avec `approved = false` : mets `TRUE` ou `oui` pour les afficher.
