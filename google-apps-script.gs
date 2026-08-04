/**
 * RSVP → Google Sheet (для приглашения «Кыз узатуу»)
 *
 * Как подключить (по шагам — в README.md, раздел «RSVP»):
 *   1. Создайте Google-таблицу.
 *   2. Расширения → Apps Script.
 *   3. Вставьте этот код, сохраните.
 *   4. Один раз запустите функцию setup() (создаст заголовки), разрешите доступ.
 *   5. Развернуть → Новое развёртывание → тип «Веб-приложение»:
 *        - Запуск от имени: Я
 *        - Доступ:          Все (Anyone)
 *   6. Скопируйте URL веб-приложения и вставьте в assets/js/app.js →  const RSVP_ENDPOINT = "...";
 */

var SHEET_NAME = 'RSVP';

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Дата/время', 'Имя', 'Кол-во гостей', 'Язык']);
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) setup();

    var p = (e && e.parameter) || {};
    var name = (p.name || '').toString().slice(0, 200);
    var guests = (p.guests || '').toString().slice(0, 10);
    var lang = (p.lang || '').toString().slice(0, 5);

    var tz = ss.getSpreadsheetTimeZone() || 'Asia/Bishkek';
    var stamp = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm:ss');

    sheet.appendRow([stamp, name, guests, lang]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'ok', info: 'RSVP endpoint is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
