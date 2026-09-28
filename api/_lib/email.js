// Gabarit HTML de l'e-mail reçu par MBA Groupe SA pour chaque demande du site
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const nl2br = (s) => esc(s).replace(/\r?\n/g, "<br>");

function row(label, value, opts = {}) {
  const v = opts.raw ? value : esc(value || "—");
  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #EFECE4;font:600 11px/1.4 Helvetica,Arial,sans-serif;letter-spacing:1.6px;text-transform:uppercase;color:#8A8A8A;width:150px;vertical-align:top;">${esc(label)}</td>
      <td style="padding:12px 0;border-bottom:1px solid #EFECE4;font:400 15px/1.55 Helvetica,Arial,sans-serif;color:#1F1F1F;vertical-align:top;">${v}</td>
    </tr>`;
}

module.exports = function buildEmail({ nom, email, phone, subject, interest, message, date }) {
  const telLink = phone ? `<a href="tel:${esc(phone.replace(/\s+/g, ""))}" style="color:#1F1F1F;text-decoration:none;">${esc(phone)}</a>` : "—";
  const mailLink = `<a href="mailto:${esc(email)}" style="color:#1F1F1F;text-decoration:none;">${esc(email)}</a>`;
  const dateStr = date.toLocaleString("fr-CH", { timeZone: "Europe/Zurich", dateStyle: "long", timeStyle: "short" });

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>Nouvelle demande · Cime de l'Est</title>
</head>
<body style="margin:0;padding:0;background:#F4F1EA;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F1EA;">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.06);">

      <!-- En-tête : logo + promotion -->
      <tr><td style="padding:28px 36px 22px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="vertical-align:middle;">
              <img src="cid:logo-mba" width="64" alt="MBA Groupe SA" style="display:block;width:64px;height:auto;border:0;">
            </td>
            <td align="right" style="vertical-align:middle;">
              <div style="font:500 22px/1.15 Georgia,'Times New Roman',serif;color:#1F1F1F;">Cime de l'Est</div>
              <div style="font:400 11px/1.5 Helvetica,Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:#B68B3C;">Vérossaz · Valais</div>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- Visuel -->
      <tr><td>
        <img src="cid:cime-hero" width="600" alt="Cime de l'Est — vue du projet" style="display:block;width:100%;height:auto;border:0;">
      </td></tr>

      <!-- Titre -->
      <tr><td style="padding:30px 36px 6px;">
        <div style="font:600 11px/1.4 Helvetica,Arial,sans-serif;letter-spacing:2.4px;text-transform:uppercase;color:#B68B3C;">Nouvelle demande depuis le site</div>
        <div style="font:500 28px/1.2 Georgia,'Times New Roman',serif;color:#1F1F1F;margin-top:8px;">${esc(subject)}</div>
        <div style="font:400 13px/1.5 Helvetica,Arial,sans-serif;color:#8A8A8A;margin-top:6px;">Reçue le ${esc(dateStr)}</div>
      </td></tr>

      <!-- Coordonnées -->
      <tr><td style="padding:18px 36px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #EFECE4;">
          ${row("Nom", nom)}
          ${row("E-mail", mailLink, { raw: true })}
          ${row("Téléphone", telLink, { raw: true })}
          ${row("Lot d'intérêt", interest || "Aucune préférence")}
        </table>
      </td></tr>

      <!-- Message -->
      <tr><td style="padding:26px 36px 8px;">
        <div style="font:600 11px/1.4 Helvetica,Arial,sans-serif;letter-spacing:1.6px;text-transform:uppercase;color:#8A8A8A;margin-bottom:10px;">Message</div>
        <div style="background:#FBF5DC;border-left:3px solid #F2DD83;border-radius:0 8px 8px 0;padding:16px 18px;font:400 15px/1.65 Helvetica,Arial,sans-serif;color:#1F1F1F;">${message ? nl2br(message) : "<span style=\"color:#8A8A8A;\">Aucun message.</span>"}</div>
      </td></tr>

      <!-- Actions -->
      <tr><td style="padding:22px 36px 34px;">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="border-radius:6px;background:#1F1F1F;">
              <a href="mailto:${esc(email)}?subject=${encodeURIComponent("Re: Cime de l'Est · " + subject)}" style="display:inline-block;padding:13px 22px;font:600 12px/1 Helvetica,Arial,sans-serif;letter-spacing:1.6px;text-transform:uppercase;color:#FFFFFF;text-decoration:none;">Répondre à ${esc(nom.split(" ")[0])}</a>
            </td>
            ${phone ? `<td style="padding-left:10px;border-radius:6px;">
              <a href="tel:${esc(phone.replace(/\s+/g, ""))}" style="display:inline-block;padding:12px 20px;border:1px solid #1F1F1F;border-radius:6px;font:600 12px/1 Helvetica,Arial,sans-serif;letter-spacing:1.6px;text-transform:uppercase;color:#1F1F1F;text-decoration:none;">Appeler</a>
            </td>` : ""}
          </tr>
        </table>
      </td></tr>

      <!-- Pied -->
      <tr><td style="padding:18px 36px 24px;background:#1F1F1F;">
        <div style="font:400 12px/1.6 Helvetica,Arial,sans-serif;color:#9E9E9E;">
          <span style="color:#FFFFFF;">MBA Groupe SA</span> · Rue du Châble-Bet 41 · 1920 Martigny<br>
          Promotion Cime de l'Est · Chemin de Chavanne · 1891 Vérossaz
        </div>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
};
