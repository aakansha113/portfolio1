// script.js - premium animation + responsive nav + reveal + small UI tweaks
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn);
  const throttle = (fn, wait = 100) => {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn(...args);
      }
    };
  };
  

  
  // Smooth scroll for anchors
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      document.body.classList.remove("nav-open");
      link.blur();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 12;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  // Mobile nav toggle
  const menuBtn = $("#menu-btn"), nav = $("nav");
  if (menuBtn && nav) {
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      menuBtn.setAttribute("aria-expanded", String(open));
      if (open) { const first = nav.querySelector("a"); if (first) first.focus(); }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains('nav-open')) {
        document.body.classList.remove('nav-open');
        menuBtn.setAttribute('aria-expanded','false');
        menuBtn.focus();
      }
    });
    $$("nav a").forEach((a) => a.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      menuBtn.setAttribute("aria-expanded", "false");
    }));
  }

  // Reveal observer + set revealed children delay
  const sections = $$("section[id]");
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        el.classList.add("visible");
        $$(".reveal", el).forEach((child, i) => {
          const delay = parseFloat(child.dataset.delay || i * 0.08);
          child.style.transitionDelay = `${delay}s`;
          child.classList.add("visible");
        });
        obs.unobserve(el);
      }
    });
  }, { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.12 });

  sections.forEach(s => revealObserver.observe(s));

  // Active nav highlighting (observer)
  const navLinks = $$("nav a").filter(a => a.getAttribute("href") && a.getAttribute("href").startsWith("#"));
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === "#" + id));
      }
    });
  }, { root: null, rootMargin: "-40% 0px -50% 0px", threshold: 0.0 });

  sections.forEach(s => activeObserver.observe(s));

  // Back to top
  const backToTop = $("#backToTop");
  if (backToTop) {
    const showHide = throttle(() => {
      if (window.scrollY > window.innerHeight / 2) backToTop.classList.add("visible");
      else backToTop.classList.remove("visible");
    }, 150);
    on(window, "scroll", showHide);
    on(backToTop, "click", (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });
  }

  // Make ghost contact button behave: show highlight on click (persist until blur)
  const contactBtn = $("#contact-btn");
  if (contactBtn) {
    contactBtn.addEventListener("mousedown", () => {
      contactBtn.classList.add("active-ghost");
    });
    contactBtn.addEventListener("mouseup", () => {
      setTimeout(() => contactBtn.classList.remove("active-ghost"), 900);
    });
    contactBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        contactBtn.classList.add("active-ghost");
        setTimeout(() => contactBtn.classList.remove("active-ghost"), 900);
      }
    });
  }

  // keyboard focus hint
  function handleFirstTab(e) { if (e.key === "Tab") { document.body.classList.add("user-is-tabbing"); window.removeEventListener("keydown", handleFirstTab); } }
  window.addEventListener("keydown", handleFirstTab);

  // init: mark hidden sections
  sections.forEach(s => { if (!s.classList.contains("visible")) s.classList.add("hidden"); });

})();
