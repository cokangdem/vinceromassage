# Massage+ — site vitrine zen

Site statique prêt pour GitHub Pages / Cloudflare Pages.

## Modifier les infos
Ouvre `js/data.js` et remplace : nom, téléphone, pseudo Telegram, textes, prestations, avis exemples.

## Publier sans avis Google Sheets
Tu peux publier tel quel : les avis d'exemple s'affichent en local.

## Activer les vrais avis avec Google Sheets
1. Crée un Google Sheet vide.
2. Va dans Extensions > Apps Script.
3. Colle `appsScript/Code.gs`.
4. Déploie en application web : exécuter en tant que toi, accès tout le monde.
5. Copie l'URL qui finit par `/exec` dans `js/data.js`, champ `googleAppsScriptUrl`.

## Cloudflare Pages
Crée un projet Pages depuis ton dépôt GitHub, framework preset : None, build command vide, output directory `/`.

## GitHub Pages
Settings > Pages > Deploy from branch > main / root.
