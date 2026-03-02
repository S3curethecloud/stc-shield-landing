// ============================================================
// STC HOMEPAGE ORCHESTRATOR (SSE VERSION)
// Event-driven control-plane surface
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {

  STC_GRAPH.init("stc-enforcement-graph");

  let runtimeState = {
    runtime_status: "unknown",
    active_sessions: null,
    policy_rev: null
  };

  // 🔷 Runtime health still polled (lightweight)
  async function pollRuntimeHealth() {
    const runtime = await STC_API.getRuntimeHealth();
    runtimeState = runtime;
  }

  // 🔷 Compose + update graph
  function updateGraphFromIncident(incident) {

    const state = {
      runtime_status: runtimeState.status,
      active_sessions: runtimeState.active_sessions,
      policy_rev: runtimeState.policy_rev,
      signals: incident.signals || [],
      risk_score: incident.riskdna?.risk_score ?? 0,
      revocation_flag: incident.revocation_flag ?? false
    };

    STC_GRAPH.update(state);
  }

  // 🔷 Connect SSE
  function initSSE() {

    STC_API.connectShieldStream(
      (incident) => {
        updateGraphFromIncident(incident);
      },
      (err) => {
        console.warn("SSE connection lost. Falling back to polling.");
        fallbackPolling();
      }
    );

  }

  // 🔷 Fallback polling (if SSE fails)
  async function fallbackPolling() {
    async function pollShield() {
      const shield = await STC_API.getShieldStatus();
      if (shield) updateGraphFromIncident(shield);
    }

    pollShield();
    setInterval(pollShield, 5000);
  }

  // 🔷 Init sequence
  await pollRuntimeHealth();
  setInterval(pollRuntimeHealth, 15000); // health only

  initSSE();

});
