// site.js — handles interactive Highlights tabs (About, Media, Gallery, Timeline)
// - Accessible tablist with keyboard navigation
// - Shows/hides existing page sections by id (about, media, gallery, timeline)
// - Leaves all sections visible on small screens for readability

(function () {
  const tablist = document.getElementById("highlights-tabs");
  if (!tablist) return;
  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
  const sectionIds = tabs.map((t) => t.dataset.target).filter(Boolean);

  function showSection(id) {
    sectionIds.forEach((sid) => {
      const el = document.getElementById(sid);
      if (!el) return;
      if (sid === id) {
        el.classList.remove("tab-hidden");
        el.classList.add("reveal-card");
        // ensure visible and focusable
        setTimeout(() => el.classList.remove("reveal-card"), 500);
      } else {
        el.classList.add("tab-hidden");
      }
    });
  }

  function setActiveTab(btn) {
    tabs.forEach((t) => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
  }

  function activateTab(btn) {
    const target = btn.dataset.target;
    if (!target) return;
    setActiveTab(btn);
    showSection(target);
    // smooth scroll into view of the section header
    const el = document.getElementById(target);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // click handlers
  tabs.forEach((btn, i) => {
    btn.addEventListener("click", () => activateTab(btn));
    btn.addEventListener("keydown", (e) => {
      const LEFT = 37,
        RIGHT = 39,
        HOME = 36,
        END = 35;
      switch (e.keyCode) {
        case LEFT:
          e.preventDefault();
          tabs[(i - 1 + tabs.length) % tabs.length].focus();
          break;
        case RIGHT:
          e.preventDefault();
          tabs[(i + 1) % tabs.length].focus();
          break;
        case HOME:
          e.preventDefault();
          tabs[0].focus();
          break;
        case END:
          e.preventDefault();
          tabs[tabs.length - 1].focus();
          break;
        case 13:
        case 32:
          e.preventDefault();
          activateTab(btn);
          break;
      }
    });
  });

  // deep-link: if URL has hash matching a section, activate that tab
  const hash = (location.hash || "").replace("#", "");
  if (hash && sectionIds.includes(hash)) {
    const tab = tabs.find((t) => t.dataset.target === hash);
    if (tab) activateTab(tab);
  } else {
    // default: show about
    const defaultTab =
      tabs.find((t) => t.dataset.target === "about") || tabs[0];
    if (defaultTab) activateTab(defaultTab);
  }

  // Responsive: when viewport resizes to small width, remove tab-hidden to show all
  function handleResize() {
    if (window.innerWidth <= 760) {
      sectionIds.forEach((sid) => {
        const el = document.getElementById(sid);
        if (el) el.classList.remove("tab-hidden");
      });
    } else {
      // keep current active tab's sections state
      const active = tabs.find(
        (t) => t.getAttribute("aria-selected") === "true"
      );
      if (active) showSection(active.dataset.target);
    }
  }
  window.addEventListener("resize", handleResize);
})();
