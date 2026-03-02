// ============================================================
// STC HOMEPAGE ORCHESTRATOR
// Connects API layer to graph layer.
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {

  STC_GRAPH.init("stc-enforcement-graph");

  async function poll() {
    const [runtime, shield] = await Promise.all([
      STC_API.getRuntimeHealth(),
      STC_API.getShieldStatus()
    ]);

    const state = {
      runtime_status: runtime.status,
      active_sessions: runtime.active_sessions,
      policy_rev: runtime.policy_rev,
      signals: shield?.signals || [],
      risk_score: shield?.risk_score || 0,
      revocation_flag: shield?.revocation_flag || false
    };

    STC_GRAPH.update(state);
  }

  poll();
  setInterval(poll, 5000);

});
