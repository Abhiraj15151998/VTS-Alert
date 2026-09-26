/**
 * SILENT EMAIL BACKEND for VTS Alert Notifier
 * ---------------------------------------------------------------
 * This script sends emails through the Gmail account it is deployed
 * under (7b05.stores@gmail.com), triggered by a background request
 * from the HTML page — no mailbox popup, no manual "Send" click.
 *
 * SETUP:
 * 1. Go to https://script.google.com while SIGNED IN as
 *    7b05.stores@gmail.com
 * 2. New project -> delete any boilerplate -> paste this whole file.
 * 3. Change SHARED_SECRET below to your own random string (keep the
 *    same value here and in index.html — they must match exactly).
 * 4. Deploy -> New deployment -> gear icon -> type: "Web app"
 *      Execute as: Me (7b05.stores@gmail.com)
 *      Who has access: Anyone
 * 5. Click Deploy. Authorize the permissions when Google prompts you
 *    (this is normal — it's asking permission to send mail as you).
 * 6. Copy the Web App URL (ends in /exec). Paste it into
 *    WEBAPP_URL near the top of index.html's <script> section.
 * 7. Re-deploy (New deployment, not "manage deployments" edit) any
 *    time you change this file, or the live URL won't reflect edits.
 * ---------------------------------------------------------------
 * SECURITY NOTE: SHARED_SECRET is a mild deterrent, not real
 * security — since index.html is a public static page, anyone who
 * views its source can read the secret too. It stops casual/bot
 * abuse of the URL, not a determined person. Don't send anything
 * you wouldn't want a viewer of the page's source to be able to
 * trigger.
 */

var SHARED_SECRET = "fZYJb8MuHgiUpF8oGwshbV05XPe42ACS";

function doPost(e) {
  var result = { ok: false };
  try {
    var data = JSON.parse(e.postData.contents);

    if (data.secret !== SHARED_SECRET) {
      result.error = "Unauthorized";
      return respond(result);
    }
    if (!data.to || !data.subject || !data.body) {
      result.error = "Missing to/subject/body";
      return respond(result);
    }

    var options = {};
    if (data.cc) options.cc = data.cc;

    GmailApp.sendEmail(data.to, data.subject, data.body, options);

    result.ok = true;
    return respond(result);
  } catch (err) {
    result.error = err.message;
    return respond(result);
  }
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
