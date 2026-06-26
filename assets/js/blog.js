(function () {
  "use strict";

  /* ── Category filter (home page) ─────────────────────── */
  function initCategoryFilter() {
    var filterBar = document.querySelector(".category-filter");
    var grid = document.getElementById("posts-grid");
    var emptyState = document.getElementById("posts-empty");
    var visibleCount = document.getElementById("visible-count");
    if (!filterBar || !grid) return;

    var cards = grid.querySelectorAll(".post-card");
    var buttons = filterBar.querySelectorAll("[data-filter]");

    function setActive(btn) {
      buttons.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle("cat-pill--active", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });
    }

    function applyFilter(slug) {
      var visible = 0;
      cards.forEach(function (card) {
        var cats = (card.getAttribute("data-categories") || "").split(",");
        var show = slug === "all" || cats.indexOf(slug) !== -1;
        card.classList.toggle("is-filtered-out", !show);
        if (show) visible++;
      });

      if (visibleCount) {
        visibleCount.innerHTML = "<strong>" + visible + "</strong> showing";
      }
      if (emptyState) {
        emptyState.hidden = visible > 0;
      }
    }

    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-filter]");
      if (!btn) return;
      setActive(btn);
      applyFilter(btn.getAttribute("data-filter"));
    });

    document.querySelectorAll(".filter-reset").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var allBtn = filterBar.querySelector('[data-filter="all"]');
        if (allBtn) {
          setActive(allBtn);
          applyFilter("all");
        }
      });
    });
  }

  /* ── Scroll reveal ───────────────────────────────────── */
  function initScrollReveal() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".reveal").forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal").forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i * 60, 360) + "ms";
      observer.observe(el);
    });
  }

  /* ── Reading progress (single posts) ─────────────────── */
  function initReadingProgress() {
    var bar = document.getElementById("reading-progress");
    var article = document.querySelector(".post-single");
    if (!bar || !article) {
      if (bar) bar.style.display = "none";
      return;
    }

    function update() {
      var rect = article.getBoundingClientRect();
      var scrolled = window.scrollY - article.offsetTop;
      var total = article.offsetHeight - window.innerHeight;
      var pct = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;
      bar.style.width = pct + "%";
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ── Back to top ─────────────────────────────────────── */
  function initBackToTop() {
    var btn = document.getElementById("back-to-top");
    if (!btn) return;

    window.addEventListener(
      "scroll",
      function () {
        btn.classList.toggle("is-visible", window.scrollY > 400);
      },
      { passive: true }
    );

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initCategoryFilter();
    initScrollReveal();
    initReadingProgress();
    initBackToTop();
  });
})();
