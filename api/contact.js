// Formulaire de contact — envoi via Resend (fonction serverless Vercel)
// Variables d'environnement attendues sur Vercel :
//   RESEND_API_KEY     clé API Resend (obligatoire)
//   RESEND_FROM_EMAIL  expéditeur, domaine vérifié chez Resend
//   CONTACT_TO_EMAIL   destinataire (défaut : raphael@mbaimmobilier.ch)

const TO_DEFAULT = "raphael@mbaimmobilier.ch";
const FROM_DEFAULT = "Cime de l'Est <no-reply@mba-immobilier.ch>";
// Domaine vérifié chez Resend à ce jour : mybat.ch. Utilisé en repli si le domaine
// de RESEND_FROM_EMAIL n'est pas (encore) vérifié.
const FROM_FALLBACK = "Cime de l'Est <no-reply@mybat.ch>";

async function send(apiKey, payload) {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

function clean(v, max = 500) {
  return String(v ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Méthode non autorisée." });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  // Piège à robots : champ caché qui doit rester vide
  if (body.website) { res.status(200).json({ ok: true }); return; }

  const firstname = clean(body.firstname, 80);
  const lastname = clean(body.lastname, 80);
  const email = clean(body.email, 160);
  const phone = clean(body.phone, 60);
  const subject = clean(body.subject, 120);
  const interest = clean(body.interest, 120);
  const message = String(body.message ?? "").trim().slice(0, 4000);

  if (!firstname || !lastname || !subject || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ ok: false, error: "Merci de compléter les champs obligatoires." });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY manquante");
    res.status(500).json({ ok: false, error: "Envoi indisponible pour le moment. Appelez-nous au +41 79 825 64 91." });
    return;
  }
  const from = process.env.RESEND_FROM_EMAIL || FROM_DEFAULT;
  const to = process.env.CONTACT_TO_EMAIL || TO_DEFAULT;
  const nom = `${firstname} ${lastname}`;

  const text = [
    "Nouvelle demande depuis le site Cime de l'Est · Vérossaz",
    "",
    `Demande        : ${subject}`,
    `Lot d'intérêt  : ${interest || "Aucune préférence"}`,
    "",
    `Nom            : ${nom}`,
    `E-mail         : ${email}`,
    `Téléphone      : ${phone || "—"}`,
    "",
    "Message :",
    message || "—",
  ].join("\n");

  try {
    const payload = {
      from,
      to: [to],
      reply_to: email,
      subject: `Cime de l'Est · ${subject} · ${nom}`,
      text,
    };
    let r = await send(apiKey, payload);
    if (r.status === 403 && from !== FROM_FALLBACK) {
      const detail = await r.text();
      if (/not verified/i.test(detail)) {
        console.warn("[contact] domaine expéditeur non vérifié, repli sur", FROM_FALLBACK);
        r = await send(apiKey, { ...payload, from: FROM_FALLBACK });
      } else {
        console.error("[contact] Resend 403", detail);
      }
    }
    if (!r.ok) {
      console.error("[contact] Resend", r.status, await r.text());
      res.status(502).json({ ok: false, error: "Envoi impossible pour le moment. Appelez-nous au +41 79 825 64 91." });
      return;
    }
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error("[contact] erreur", e);
    res.status(500).json({ ok: false, error: "Envoi impossible pour le moment. Appelez-nous au +41 79 825 64 91." });
  }
};
