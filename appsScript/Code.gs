/**
 * Google Apps Script — système simple d’avis via Google Sheets.
 * Onglet créé automatiquement : reviews
 * Colonnes : timestamp, name, rating, message, approved
 */
const SHEET_NAME = 'reviews';

function _sheet(){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) sh.appendRow(['timestamp','name','rating','message','approved']);
  return sh;
}

function doGet(e){
  const action = String(e.parameter.action || 'list').toLowerCase();
  if (action === 'list') return _json(_list());
  return _json({ok:true});
}

function doPost(e){
  let body = {};
  try { body = JSON.parse(e.postData.contents || '{}'); } catch(err) {}
  if (String(body.action || '').toLowerCase() === 'add') return _json(_add(body));
  return _json({ok:false,error:'unknown action'});
}

function _add(body){
  const name = String(body.name || 'Anonyme').trim().slice(0,40);
  const rating = Math.max(1, Math.min(5, Number(body.rating) || 5));
  const message = String(body.message || '').trim().slice(0,800);
  if (!message) return {ok:false,error:'message required'};
  _sheet().appendRow([new Date().toISOString(), name, rating, message, false]);
  return {ok:true};
}

function _list(){
  const sh = _sheet();
  const rows = sh.getRange(2,1,Math.max(0, sh.getLastRow()-1),5).getValues();
  const items = rows
    .filter(r => r[4] === true || String(r[4]).toLowerCase() === 'true' || String(r[4]).toLowerCase() === 'oui')
    .reverse()
    .map(r => ({date:r[0], name:r[1], rating:r[2], message:r[3]}));
  return {ok:true, total:items.length, items};
}

function _json(obj){
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
