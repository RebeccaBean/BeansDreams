/* index.js - main page behaviors */
document.addEventListener("DOMContentLoaded", () => {

  /* ===========================
     Navigation Loader (simple with minimal fallback)
     =========================== */
  const navPlaceholder = document.getElementById("nav-placeholder");
  if (navPlaceholder) {
    fetch("navigation.html", { cache: "no-store" })
      .then(resp => resp.ok ? resp.text() : Promise.reject())
      .then(text => {
        navPlaceholder.innerHTML = text.trim().length > 20 ? text : `
          <nav class="site-nav" role="navigation" aria-label="Main navigation">
            <ul class="nav-list">
              <li><a href="/">Home</a></li>
              <li><a href="/classes.html">Classes</a></li>
              <li><a href="/coaching.html">Coaching</a></li>
              <li><a href="/contact.html">Contact</a></li>
            </ul>
          </nav>
        `;
      })
      .catch(() => {
        navPlaceholder.innerHTML = `
          <nav class="site-nav" role="navigation" aria-label="Main navigation">
            <ul class="nav-list">
              <li><a href="/">Home</a></li>
              <li><a href="/classes.html">Classes</a></li>
              <li><a href="/coaching.html">Coaching</a></li>
              <li><a href="/contact.html">Contact</a></li>
            </ul>
          </nav>
        `;
      });
  }

  /* ===========================
     FAQ Accordion
     =========================== */
  const faqQuestions = Array.from(document.querySelectorAll(".faq-question"));
  faqQuestions.forEach(q => {
    if (!q.hasAttribute("aria-expanded")) q.setAttribute("aria-expanded", "false");
    q.addEventListener("click", () => {
      const answer = q.nextElementSibling;
      if (!answer) return;
      faqQuestions.forEach(otherQ => {
        const otherA = otherQ.nextElementSibling;
        if (otherA && otherA !== answer) {
          otherA.classList.remove("open");
          otherQ.setAttribute("aria-expanded", "false");
        }
      });
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
        window.location.href = redirectInput && redirectInput.value ? redirectInput.value : "thankyou.html";
      })
      .catch(() => alert("Oops! Something went wrong. Please try again."));
    });
  });

  /* ===========================
     AOS Initialization
     =========================== */
  if (window.AOS && typeof AOS.init === "function") {
    AOS.init({ once: true, duration: 600 });
    setTimeout(() => AOS.refresh(), 250);
  }

  /* ===========================
     Update Current Year
     =========================== */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
