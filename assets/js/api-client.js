// ============================================================
// STC API CLIENT
// Owns all external communication.
// No rendering logic.
// ============================================================

const STC_API = (() => {

  const CONFIG = {
    RUNTIME_URL: "https://ztr-runtime.fly.dev/health",
    SHIELD_URL:  "https://stc-intelligence-core.fly.dev/shield/status",
    TIMEOUT_MS:  4000
  };

  async function fetchWithTimeout(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);

    try {
      const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();

    } catch (err) {
      clearTimeout(timeout);
      return null;
    }
  }

  async function getRuntimeHealth() {
    const data = await fetchWithTimeout(CONFIG.RUNTIME_URL);

    if (!data) {
      return {
        status: "unreachable",
        active_sessions: null,
        policy_rev: null
      };
    }

    return {
      status: data.status || "unknown",
      active_sessions: data.active_sessions ?? null,
      policy_rev: data.policy_rev || null
    };
  }

  async function getShieldStatus() {
    const data = await fetchWithTimeout(CONFIG.SHIELD_URL);

    if (!data) return null;

    return {
      signals: data.signals || [],
      risk_score: data.riskdna?.risk_score ?? data.risk_score ?? 0,
      revocation_flag: data.revocation_flag ?? false
    };
  }

  function connectShieldStream(onMessage, onError) {
    const url = "https://stc-intelligence-core.fly.dev/shield/stream";
    const es = new EventSource(url);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (_) {}
    };

    es.onerror = (err) => {
      if (onError) onError(err);
    };

    return es;
  }

  return {
    getRuntimeHealth,
    getShieldStatus,
    connectShieldStream
  };

})();
