/** Google Apps Script — avis clients pour Massage+.
 * 1. Crée un Google Sheet.
 * 2. Extensions > Apps Script > colle ce fichier.
 * 3. Déployer > Nouvelle version > Application web.
 * 4. Exécuter en tant que : moi. Accès : tout le monde.
 * 5. Copie l'URL /exec dans js/data.js > googleAppsScriptUrl.
 */
const CONFIG = { COMMENTS_SHEET:'reviews' };
function _sheet(){ const ss=SpreadsheetApp.getActiveSpreadsheet(); const sh=ss.getSheetByName(CONFIG.COMMENTS_SHEET)||ss.insertSheet(CONFIG.COMMENTS_SHEET); if(sh.getLastRow()===0) sh.appendRow(['timestamp','name','message']); return sh; }
function doGet(e){ const action=(e.parameter.action||'').toLowerCase(); if(action==='list') return _json(_list(e)); return _json({ok:true}); }
function doPost(e){ let body={}; try{ body=JSON.parse(e.postData.contents||'{}'); }catch(err){} if((body.action||'').toLowerCase()==='add') return _json(_add(body)); return _json({ok:false,error:'unknown action'}); }
function _add(b){ const name=String(b.name||'Anonyme').trim().slice(0,40); const message=String(b.message||'').trim().slice(0,700); if(!message) return {ok:false,error:'message required'}; _sheet().appendRow([new Date().toISOString(), name, message]); return {ok:true}; }
function _list(e){ const page=Math.max(1,Number(e.parameter.page||1)); const pageSize=Math.min(20,Math.max(1,Number(e.parameter.pageSize||6))); const values=_sheet().getDataRange().getValues().slice(1).reverse(); const total=values.length; const items=values.slice((page-1)*pageSize,(page-1)*pageSize+pageSize).map(r=>({timestamp:r[0],name:r[1],message:r[2]})); return {ok:true,total,page,pageSize,items}; }
function _json(obj){ return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
