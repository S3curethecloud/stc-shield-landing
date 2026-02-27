// =========================================================
// FILE: website/shared/bridge_v1_contract.js
// PURPOSE: Shield ↔ Copilot Bridge Contract v1.0 (Canonical)
// GOVERNANCE: MGF-AUTHORITY-ALL
// =========================================================

export const BRIDGE_CONTRACT_VERSION = "1.0";

export const BridgeEventType = Object.freeze({
  INCIDENT_CREATED: "incident.created",
  INCIDENT_UPDATED: "incident.updated",
  HEARTBEAT: "heartbeat",
});

export function buildBridgeEvent({
  eventType,
  tenantId,
  incident,
  timestamp = Date.now(),
  origin = "shield",
}) {
  return {
    contract_version: BRIDGE_CONTRACT_VERSION,
    origin,
    event_type: eventType,
    tenant_id: String(tenantId || "tenant-unknown"),
    incident,
    timestamp,
  };
}

export function isBridgeV1Event(obj) {
  return (
    obj &&
    typeof obj === "object" &&
    obj.contract_version === BRIDGE_CONTRACT_VERSION &&
    typeof obj.event_type === "string" &&
    typeof obj.tenant_id === "string" &&
    typeof obj.timestamp === "number"
  );
}
