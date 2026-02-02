/* ============================================================
   STC Shield — Console AI Logic (Authoritative)
   ============================================================ */

let activeFinding = null;

const findingItems = document.querySelectorAll(".finding-item");
const aiPanel = document.querySelector(".console-ai");
const aiButton = aiPanel?.querySelector(".ai-btn");
const aiSubtitle = aiPanel?.querySelector(".ai-subtitle");
const aiExplanationBlock = aiPanel?.querySelector("p");
const aiCitationsBlock = aiPanel?.querySelectorAll("p")[1];

/* ---------- ARIA INIT (FINDINGS LIST) ---------- */
findingItems.forEach((el) => {
  el.setAttribute("role", "option");
  el.setAttribute("tabindex", "-1");
  el.setAttribute("aria-selected", "false");
});

/* ---------- ARIA LIVE ANNOUNCER (PHASE 2) ---------- */
const ariaAnnouncer = document.createElement("div");
ariaAnnouncer.setAttribute("aria-live", "polite");
ariaAnnouncer.setAttribute("aria-atomic", "true");
ariaAnnouncer.className = "visually-hidden";
document.body.appendChild(ariaAnnouncer);

function announce(message) {
  ariaAnnouncer.textContent = "";
  setTimeout(() => {
    ariaAnnouncer.textContent = message;
  }, 10);
}

/* ---------- ROVING TABINDEX + ACTIVEDESCENDANT (CRITICAL) ---------- */
function updateRovingTabindex(activeItem) {
  findingItems.forEach((item) => {
    item.setAttribute("tabindex", "-1");
    item.setAttribute("aria-selected", "false");
  });

  activeItem.setAttribute("tabindex", "0");
  activeItem.setAttribute("aria-selected", "true");
  activeItem.focus();

  // Sync listbox active descendant
  const listbox = document.querySelector(".console-findings");
  if (listbox && activeItem.id) {
    listbox.setAttribute("aria-activedescendant", activeItem.id);
  }
}

/* ---------- AI RENDERING (DETERMINISTIC) ---------- */
function renderAIForFinding(findingEl) {
  if (!findingEl || !aiPanel) return;

  aiPanel.setAttribute("aria-busy", "true");
  aiPanel.classList.add("active");
  aiPanel.setAttribute("aria-disabled", "false");
  aiButton?.classList.remove("disabled");
  aiButton?.removeAttribute("aria-disabled");
  aiButton?.removeAttribute("disabled");

  const severity =
    findingEl.querySelector(".severity")?.textContent || "UNKNOWN";

  if (aiSubtitle) {
    aiSubtitle.textContent =
      "AI ready. Explanation will reference Shield data only.";
  }

  if (aiExplanationBlock) {
    aiExplanationBlock.textContent =
      `This ${severity} severity finding was computed deterministically from the live identity graph. ` +
      `AI explanations describe reachability and impact without modifying system state.`;
  }

  if (aiCitationsBlock) {
    aiCitationsBlock.textContent =
      "Shield identity graph (deterministic)";
  }

  aiPanel.setAttribute("aria-busy", "false");
}

/* ---------- FINDING SELECTION (CANONICAL) ---------- */
findingItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Clear previous selection (visual only)
    findingItems.forEach((el) =>
      el.classList.remove("selected", "active")
    );

    // Set new active finding
    item.classList.add("selected", "active");
    activeFinding = item;

    // 🔴 CRITICAL: focus + roving tabindex + aria-activedescendant
    updateRovingTabindex(activeFinding);

    // Update AI panel
    renderAIForFinding(activeFinding);

    // Screen reader announcement
    const severity =
      activeFinding.querySelector(".severity")?.textContent || "Finding";
    const title =
      activeFinding.querySelector("strong")?.textContent || "";

    announce(`Finding selected: ${severity}. ${title}.`);
  });
});

/* ============================================================
   ARIA Phase 2 — Keyboard Navigation for Findings
   ============================================================ */

(function () {
  if (!findingItems || findingItems.length === 0) return;

  function focusItem(index) {
    const clamped =
      (index + findingItems.length) % findingItems.length;
    findingItems[clamped].focus();
  }

  findingItems.forEach((item, index) => {
    item.addEventListener("keydown", (e) => {
      let targetIndex = null;

      switch (e.key) {
        case "ArrowDown":
          targetIndex = index + 1;
          break;

        case "ArrowUp":
          targetIndex = index - 1;
          break;

        case "Home":
          targetIndex = 0;
          break;

        case "End":
          targetIndex = findingItems.length - 1;
          break;

        case "Enter":
        case " ":
          e.preventDefault();
          item.click(); // reuse canonical click logic
          return;

        default:
          return;
      }

      e.preventDefault();
      focusItem(targetIndex);
    });
  });
})();
