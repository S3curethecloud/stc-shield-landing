export async function onRequestPost(context) {
  // Set in Cloudflare Pages project env vars later:
  // RISKDNA_API_URL = https://your-riskdna-api.example.com
  const upstream = context.env.RISKDNA_API_URL;

  if (!upstream) {
    return new Response(
      JSON.stringify({
        risk_score: 0,
        risk_level: "PREVIEW",
        explanation: "RiskDNA API not configured yet (RISKDNA_API_URL missing).",
        citations: ["Shield UI preview mode"]
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = await context.request.text();

  const resp = await fetch(`${upstream}/risk/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body
  });

  // Pass through JSON
  const text = await resp.text();
  return new Response(text, {
    status: resp.status,
    headers: { "Content-Type": "application/json" }
  });
}
