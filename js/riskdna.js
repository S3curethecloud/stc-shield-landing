/* ============================================================
   STC Shield — RiskDNA UI Wiring (v0.1)
   UI renders only • API decides • CSP-safe (same-origin)
   Endpoint: POST /api/risk/score
   ============================================================ */

(function () {
  const runBtn = document.getElementById("riskRunBtn");
  const resetBtn = document.getElementById("riskResetBtn");

  const scoreEl = document.getElementById("riskScoreValue");
  const levelEl = document.getElementById("riskLevelValue");
  const explainEl = document.getElementById("riskExplainText");
  const citationsEl = document.getElementById("riskCitations");

  function setLoading(isLoading) {
    if (!runBtn) return;
    runBtn.disabled = isLoading;
    runBtn.textContent = isLoading ? "Running..." : "Run RiskDNA Analysis";
  }

  function resetUI() {
    if (scoreEl) scoreEl.textContent = "—";
    if (levelEl) levelEl.textContent = "—";
    if (explainEl) {
      explainEl.textContent =
        "Run an analysis to generate an executive-safe explanation.";
    }
    if (citationsEl) {
      citationsEl.innerHTML = "<li>No datasets referenced.</li>";
    }
  }

  async function runRiskDNA() {
    setLoading(true);

    // Demo-safe normalized signals (no PII).
    // Replace later with Shield-derived normalized inputs.
    const payload = {
      identity_behavior: {
        mfa_failures: 6,
        login_anomaly: true,
        dormant_privileged_account: false,
        excessive_auth_attempts: true
      },
      privilege: {
        admin_role_usage_minutes: 180,
        wildcard_policies: true,
        standing_privileges: true
      },
      cloud_impact: {
        public_resource: true,
        encryption_disabled: false,
        network_exposed: true
      }
    };

    try {
      const resp = await fetch("/api/risk/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) {
        throw new Error(`RiskDNA API error: ${resp.status}`);
      }

      const data = await resp.json();

      if (scoreEl) scoreEl.textContent = String(data.risk_score ?? "—");
      if (levelEl) levelEl.textContent = String(data.risk_level ?? "—");

      if (explainEl) {
        explainEl.textContent =
          data.explanation ||
          "RiskDNA computed an authoritative score from normalized signals (read-only).";
      }

      if (citationsEl) {
        const cites = Array.isArray(data.citations) ? data.citations : [];
        citationsEl.innerHTML =
          cites.length
            ? cites.map((c) => `<li>${escapeHtml(String(c))}</li>`).join("")
            : "<li>No datasets referenced.</li>";
      }
    } catch (e) {
      console.error(e);
      if (explainEl) explainEl.textContent =
        "Failed to retrieve RiskDNA score. Check /api/risk/score availability.";
    } finally {
      setLoading(false);
    }
  }

  function escapeHtml(s) {
    return s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  runBtn?.addEventListener("click", runRiskDNA);
  resetBtn?.addEventListener("click", resetUI);

  // Initialize
  resetUI();
})();
