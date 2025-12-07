/* index.js - main page behaviors */
document.addEventListener("DOMContentLoaded", () => {

  /* ===========================
     Navigation Loader + Fallback
     =========================== */
  const navPlaceholder = document.getElementById("nav-placeholder");
  const fallbackNav = `
    <nav class="site-nav" role="navigation" aria-label="Main navigation">
      <div class="nav-inner">
        <a href="/" class="nav-brand" aria-label="Bean's Dreams home">Bean's Dreams</a>
        <button id="mobile-nav-toggle" aria-expanded="false" aria-controls="primary-nav">Menu</button>
        <ul id="primary-nav" class="nav-list">
          <li><a href="/" class="nav-link">Home</a></li>
          <li><a href="/classes.html" class="nav-link">Classes</a></li>
          <li><a href="/coaching.html" class="nav-link">Coaching</a></li>
          <li><a href="/about.html" class="nav-link">About</a></li>
          <li><a href="/contact.html" class="nav-link">Contact</a></li>
        </ul>
      </div>
    </nav>
  `;

  function insertNav(html) {
    if (!navPlaceholder) return;
    navPlaceholder.innerHTML = html;
    document.dispatchEvent(new CustomEvent('nav:loaded'));
  }

  if (navPlaceholder) {
    fetch("nav.html", { cache: "no-store" })
      .then(resp => resp.ok ? resp.text() : Promise.reject())
      .then(text => insertNav(text.trim().length > 20 ? text : fallbackNav))
      .catch(() => insertNav(fallbackNav));
  }

  /* Mobile dropdown toggle */
  function initMobileNav() {
    const mobileToggle = document.getElementById("mobile-nav-toggle");
    const primaryNav = document.getElementById("primary-nav");
    if (!mobileToggle || !primaryNav) return;

    function resetNav() {
      if (window.innerWidth <= 768) {
        primaryNav.classList.add("collapsed");
        primaryNav.classList.remove("open");
        mobileToggle.setAttribute("aria-expanded", "false");
      } else {
        primaryNav.classList.remove("collapsed");
        primaryNav.classList.remove("open");
        mobileToggle.setAttribute("aria-expanded", "false");
      }
    }

    resetNav();
    window.addEventListener("resize", resetNav);

    mobileToggle.addEventListener("click", e => {
      e.stopPropagation();
      const isOpen = primaryNav.classList.toggle("open");
      primaryNav.classList.toggle("collapsed", !isOpen);
      mobileToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.addEventListener("click", e => {
      if (!primaryNav.classList.contains("open")) return;
      if (!primaryNav.contains(e.target) && !mobileToggle.contains(e.target)) {
        primaryNav.classList.remove("open");
        primaryNav.classList.add("collapsed");
        mobileToggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && primaryNav.classList.contains("open")) {
        primaryNav.classList.remove("open");
        primaryNav.classList.add("collapsed");
        mobileToggle.setAttribute("aria-expanded", "false");
        mobileToggle.focus();
      }
    });
  }

  document.addEventListener("nav:loaded", initMobileNav);
  initMobileNav(); // in case nav is already present

  /* ===========================
     FAQ Accordion
     =========================== */
  const faqQuestions = Array.from(document.querySelectorAll(".faq-question"));
  faqQuestions.forEach(q => {
    if (!q.hasAttribute("aria-expanded")) q.setAttribute("aria-expanded", "false");

    q.addEventListener("click", () => {
      const answer = q.nextElementSibling;
      if (!answer) return;

      // Close other answers
      faqQuestions.forEach(otherQ => {
        const otherA = otherQ.nextElementSibling;
        if (otherA && otherA !== answer) {
          otherA.classList.remove("open");
          otherQ.setAttribute("aria-expanded", "false");
        }
      });

      // Toggle this answer
      const isOpen = answer.classList.toggle("open");
      q.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });

  /* ===========================
     Lead Form Toggles
     =========================== */
  const toggles = Array.from(document.querySelectorAll(".lead-toggle"));
  const forms = Array.from(document.querySelectorAll(".lead-form-section"));
  const closeBtns = Array.from(document.querySelectorAll(".close-btn"));

  toggles.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      if (!targetId) return;
      forms.forEach(f => { f.classList.add("hidden"); f.classList.remove("visible"); });
      const target = document.getElementById(targetId);
      if (target) {
        target.classList.remove("hidden");
        requestAnimationFrame(() => target.classList.add("visible"));
        const first = target.querySelector("input, select, textarea, button");
        if (first) first.focus();
      }
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const parent = btn.closest(".lead-form-section");
      if (!parent) return;
      parent.classList.add("hidden");
      parent.classList.remove("visible");
      const related = document.querySelector(`.lead-toggle[data-target="${parent.id}"]`);
      if (related) related.focus();
    });
  });

  /* ===========================
     Testimonials Carousel
     =========================== */
  const testimonials = Array.from(document.querySelectorAll(".testimonial"));
  const dots = Array.from(document.querySelectorAll(".dot"));
  let tIndex = 0;
  let tTimer = null;

  function showTestimonial(i) {
    if (!testimonials.length) return;
    tIndex = i % testimonials.length;
    testimonials.forEach((t, j) => t.classList.toggle("active", j === tIndex));
    dots.forEach((d, j) => d.classList.toggle("active", j === tIndex));
  }

  if (testimonials.length && dots.length) {
    if (testimonials.length !== dots.length)
      console.warn("Testimonials/dots count mismatch:", testimonials.length, dots.length);

    dots.forEach((dot, i) => dot.addEventListener("click", () => {
      showTestimonial(i);
      if (tTimer) clearInterval(tTimer);
      tTimer = setInterval(() => showTestimonial((tIndex + 1) % testimonials.length), 4000);
    }));

    showTestimonial(0);
    tTimer = setInterval(() => showTestimonial((tIndex + 1) % testimonials.length), 4000);
  }

  /* ===========================
     Formspree AJAX Submission
     =========================== */
  document.querySelectorAll("form").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const action = form.getAttribute("action");
      if (!action) { form.submit(); return; }

      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      })
      .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        const redirectInput = form.querySelector('input[name="_redirect"]');
        if (redirectInput && redirectInput.value) {
          window.location.href = redirectInput.value;
        } else {
          window.location.href = "thankyou.html";
        }
      })
      .catch(() => alert("Oops! Something went wrong. Please try again."));
    });
  });

  /* ===========================
     AOS Initialization
     =========================== */
  if (window.AOS && typeof AOS.init === "function") {
    AOS.init({ once: true, duration: 600 });
    setTimeout(() => AOS.refresh(), 250); // refresh after any dynamic content
  }

  /* ===========================
     Update Current Year
     =========================== */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
