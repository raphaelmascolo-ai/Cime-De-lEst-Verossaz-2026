// Diagnostic temporaire : liste les domaines du compte Resend (sans exposer la clé)
module.exports = async (req, res) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) { res.status(500).json({ error: "clé absente" }); return; }
  const r = await fetch("https://api.resend.com/domains", { headers: { Authorization: `Bearer ${apiKey}` } });
  const j = await r.json().catch(() => ({}));
  res.status(200).json({ status: r.status, domains: (j.data || []).map(d => ({ name: d.name, status: d.status, region: d.region })), from: process.env.RESEND_FROM_EMAIL || null, to: process.env.CONTACT_TO_EMAIL || null });
};
