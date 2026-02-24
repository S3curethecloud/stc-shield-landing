(function () {
  // Scroll reveal + start flow animation only when visible
  const revealEls = document.querySelectorAll(".reveal");
  const flow = document.getElementById("eco-flow");

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          if (e.target.id === "eco-flow") e.target.classList.add("is-active");
        }
      });
    },
    { threshold: 0.18 }
  );

  revealEls.forEach((el) => io.observe(el));
  if (flow) io.observe(flow);

  // Hover/focus detail updates (exec-friendly, deterministic)
  const detailTitle = document.getElementById("eco-detail-title");
  const detailDesc = document.getElementById("eco-detail-desc");
  const detailLink = document.getElementById("eco-detail-link");

  function setDetail(node) {
    const title = node.getAttribute("data-title") || "Module";
    const desc = node.getAttribute("data-desc") || "";
    const href = node.getAttribute("href") || "#";

    if (detailTitle) detailTitle.textContent = title;
    if (detailDesc) detailDesc.textContent = desc;
    if (detailLink) detailLink.setAttribute("href", href);
  }

  document.querySelectorAll(".eco-node[data-title]").forEach((node) => {
    node.addEventListener("mouseenter", () => setDetail(node));
    node.addEventListener("focus", () => setDetail(node));
  });
})();
