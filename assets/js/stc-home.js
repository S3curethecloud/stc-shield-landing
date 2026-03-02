// ============================================================
// STC Deterministic Hero Graph
// No external dependencies
// Pure SVG render
// ============================================================

document.addEventListener("DOMContentLoaded", function(){

  const svg = document.getElementById("stc-graph");
  if(!svg) return;

  const NS = "http://www.w3.org/2000/svg";

  function node(id, label, x, y){
    const g = document.createElementNS(NS,"g");
    g.setAttribute("transform", `translate(${x},${y})`);
    g.setAttribute("id", id);

    const rect = document.createElementNS(NS,"rect");
    rect.setAttribute("width", 210);
    rect.setAttribute("height", 44);
    rect.setAttribute("rx", 10);
    rect.setAttribute("fill", "rgba(14,20,27,.65)");
    rect.setAttribute("stroke", "rgba(201,162,39,.35)");
    rect.setAttribute("stroke-width", "1.2");

    const text = document.createElementNS(NS,"text");
    text.setAttribute("x", 105);
    text.setAttribute("y", 28);
    text.setAttribute("text-anchor","middle");
    text.setAttribute("fill","#E9EEF6");
    text.setAttribute("font-size","13");
    text.setAttribute("font-weight","700");
    text.textContent = label;

    g.appendChild(rect);
    g.appendChild(text);
    svg.appendChild(g);
  }

  function edge(x1,y1,x2,y2){
    const line = document.createElementNS(NS,"line");
    line.setAttribute("x1",x1);
    line.setAttribute("y1",y1);
    line.setAttribute("x2",x2);
    line.setAttribute("y2",y2);
    line.setAttribute("stroke","rgba(201,162,39,.25)");
    line.setAttribute("stroke-width","1.2");
    svg.appendChild(line);
    return line;
  }

  // Node Layout
  node("operational_policy","operational_policy",40,40);
  node("financial_threshold","financial_threshold",320,40);
  node("continuous_access_enforcement","continuous_access_enforcement",600,40);

  node("token_introspection","token_introspection",180,180);
  node("token_revocation_registry","token_revocation_registry",460,180);

  node("session_invalidation_boundary","session_invalidation_boundary",320,320);
  node("blast_radius_model","blast_radius_model",40,440);
  node("compliance_surface","compliance_surface",600,440);

  // Edges
  edge(250,62,320,62);
  edge(530,62,600,62);

  edge(145,84,180,180);
  edge(425,84,460,180);

  edge(285,224,320,320);
  edge(495,224,320,320);

  edge(180,364,120,440);
  edge(460,364,660,440);

  // Deterministic traversal animation
  const traversalOrder = [
    "operational_policy",
    "financial_threshold",
    "continuous_access_enforcement",
    "token_introspection",
    "token_revocation_registry",
    "session_invalidation_boundary",
    "blast_radius_model",
    "compliance_surface"
  ];

  function activateNode(id, delay){
    setTimeout(()=>{
      const g = document.getElementById(id);
      if(!g) return;
      const rect = g.querySelector("rect");
      rect.setAttribute("stroke","#E84545");
      rect.setAttribute("stroke-width","2");
      rect.setAttribute("fill","rgba(232,69,69,.18)");
    }, delay);
  }

  traversalOrder.forEach((id,i)=>{
    activateNode(id, i * 500);
  });

  // Completion label
  setTimeout(()=>{
    const text = document.createElementNS(NS,"text");
    text.setAttribute("x","400");
    text.setAttribute("y","490");
    text.setAttribute("text-anchor","middle");
    text.setAttribute("fill","#E3C35A");
    text.setAttribute("font-size","14");
    text.setAttribute("font-weight","900");
    text.textContent = "DETERMINISTIC REVOCATION PATH COMPLETE";
    svg.appendChild(text);
  }, traversalOrder.length * 500 + 600);

});
