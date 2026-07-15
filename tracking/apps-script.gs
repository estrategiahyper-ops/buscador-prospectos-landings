/**
 * Puente Cloudflare Worker → Google Sheet (panel de seguimiento).
 *
 * Cómo instalarlo:
 * 1. Crea una Google Sheet en blanco.
 * 2. Extensiones → Apps Script → pega este código.
 * 3. Cambia SECRET por el mismo valor que pongas en el Worker.
 * 4. Implementar → Nueva implementación → tipo "Aplicación web"
 *      - Ejecutar como: Tú
 *      - Acceso: Cualquier persona
 * 5. Copia la URL /exec resultante → es la variable SHEET_WEBHOOK del Worker.
 *
 * Estructura de la hoja "Eventos" (se crea sola):
 *   tracking_id | empresa | evento | veces | primera_vez | ultima_vez | user_agent
 *
 * La columna "empresa" se rellena cruzando con la hoja "Prospectos" si existe
 * (columnas: tracking_id | empresa), o queda vacía para rellenar a mano.
 */

var SECRET = 'CAMBIA-ESTE-SECRETO';

// Respuesta a GET: sirve para comprobar en el navegador que la web app está viva.
function doGet(e) {
  return ContentService.createTextOutput('tracking activo');
}

function doPost(e) {
  // Validación de entrada antes de tocar nada.
  if (!e || !e.postData || !e.postData.contents) {
    return ContentService.createTextOutput('sin datos');
  }

  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput('json invalido');
  }

  if (SECRET && data.secret !== SECRET) {
    return ContentService.createTextOutput('forbidden');
  }

  // Bloqueo: serializa los eventos concurrentes para no duplicar filas ni
  // perder incrementos del contador cuando llegan varias aperturas a la vez.
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
  } catch (err) {
    return ContentService.createTextOutput('ocupado');
  }

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var hoja = ss.getSheetByName('Eventos');
    if (!hoja) {
      hoja = ss.insertSheet('Eventos');
      hoja.appendRow(['tracking_id', 'empresa', 'evento', 'veces', 'primera_vez', 'ultima_vez', 'user_agent']);
      hoja.setFrozenRows(1);
    }

    var id = String(data.id || 'desconocido');
    var evento = String(data.evento || '');
    var fecha = data.fecha || new Date().toISOString();

    // Busca fila existente para este id + evento y acumula.
    var valores = hoja.getDataRange().getValues();
    for (var i = 1; i < valores.length; i++) {
      if (String(valores[i][0]) === id && String(valores[i][2]) === evento) {
        hoja.getRange(i + 1, 4).setValue(Number(valores[i][3]) + 1); // veces
        hoja.getRange(i + 1, 6).setValue(fecha);                     // ultima_vez
        return ContentService.createTextOutput('ok');
      }
    }

    hoja.appendRow([id, buscarEmpresa(ss, id), evento, 1, fecha, fecha, data.userAgent || '']);
    return ContentService.createTextOutput('ok');
  } finally {
    lock.releaseLock();
  }
}

function buscarEmpresa(ss, id) {
  var prospectos = ss.getSheetByName('Prospectos');
  if (!prospectos) return '';
  var valores = prospectos.getDataRange().getValues();
  for (var i = 1; i < valores.length; i++) {
    if (String(valores[i][0]) === id) return valores[i][1];
  }
  return '';
}
