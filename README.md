# VTS Alert Notifier

A single-page tool to look up a vehicle/TT number against the vendor master list and generate a pre-filled email (opens in Outlook or your default mail app) notifying the transporter of VTS alerts.

## Live app
Once GitHub Pages is enabled (see below), the app will be available at:

```
https://<your-username>.github.io/<repo-name>/
```

## Deploying with GitHub Pages
1. Create a new repository (or use an existing one) and push this file as `index.html` in the repo root — or in a `/docs` folder if you prefer.
2. Go to the repo's **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select the branch (usually `main`) and the folder (`/root` or `/docs`, matching where you placed `index.html`).
5. Save. GitHub will give you the live URL within a minute or two (check the Pages settings page for the link).

## Silent sending (no mailbox popup)
`index.html` now sends emails directly in the background via a small Google Apps Script backend (`EmailBackend.gs`), instead of opening a mail app draft. Setup:

1. Go to https://script.google.com **while signed in as 7b05.stores@gmail.com**.
2. New project → paste in `EmailBackend.gs`.
3. Deploy → New deployment → type **Web app** → Execute as **Me** → Who has access **Anyone**. Deploy, authorize when prompted.
4. Copy the resulting Web App URL (ends in `/exec`).
5. In `index.html`, find `var WEBAPP_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";` near the top of the `<script>` block and paste your URL in.
6. Re-publish/push `index.html` with that change.

**Security note:** the page includes a shared-secret string that must match between `index.html` and `EmailBackend.gs`. This only deters casual/bot abuse of the public URL — since `index.html` is a public static page, anyone who views its source can also read the secret. It is not real authentication. Don't rely on it for anything sensitive, and rotate the secret (in both files) if you ever suspect it's been misused.

## Updating the vendor list
The vendor master data (Vendor Code, Transporter, TT No., Email ID) is embedded directly inside `index.html` as a JSON array near the bottom of the file (`var VENDOR_DATA = [...]`). To update it:
1. Get the new data as a table (Vendor Code, Transporter, TT No., Email ID columns).
2. Ask Claude to regenerate `index.html` with the updated list, or manually edit the JSON array in place.
3. Commit and push — GitHub Pages redeploys automatically within a minute or two of a push to the Pages branch.

## Notes
- Everything runs client-side except the send step, which goes through the Apps Script backend described above — no other server, no other API calls. The notification log is stored in each visitor's own browser via `localStorage` and is not shared or synced anywhere.
- "Send email now" fires a background request to the Apps Script backend, which sends via Gmail as 7b05.stores@gmail.com — no popup, no manual Send click. If `WEBAPP_URL` isn't set yet, the button shows a warning instead of failing silently.
- CC defaults to: ksolei@indianoil.in, DasJ4@indianoil.in, MAURYARK1@indianoil.in, baruahrl@indianoil.in — editable per draft before sending.
