/* index.js - main page behaviors (without cart) */
document.addEventListener("DOMContentLoaded", () => {

  /* ===== Testimonials Carousel ===== */
  const testimonials = Array.from(document.querySelectorAll('.testimonial'));
  const dots = Array.from(document.querySelectorAll('.dot'));
  let tIndex = 0;
  let tTimer = null;

  function showTestimonial(i) {
    if (!testimonials.length) return;
    tIndex = i % testimonials.length;
    testimonials.forEach((t, j) => t.classList.toggle('active', j === tIndex));
    dots.forEach((d, j) => d.classList.toggle('active', j === tIndex));
  }

  if (testimonials.length && dots.length) {
    if (testimonials.length !== dots.length) console.warn('testimonials/dots mismatch', testimonials.length, dots.length);

    dots.forEach((dot, i) => dot.addEventListener('click', () => {
      showTestimonial(i);
      if (tTimer) clearInterval(tTimer);
      tTimer = setInterval(() => showTestimonial((tIndex + 1) % testimonials.length), 4000);
    }));

    showTestimonial(0);
    tTimer = setInterval(() => showTestimonial((tIndex + 1) % testimonials.length), 4000);
  }

  /* ===== FAQ Accordion (class-based, accessible) ===== */
  const questions = Array.from(document.querySelectorAll('.faq-question'));
  questions.forEach(q => {
    if (!q.hasAttribute('aria-expanded')) q.setAttribute('aria-expanded', 'false');

    q.addEventListener('click', () => {
      const answer = q.nextElementSibling;
      if (!answer) return;

      // Close other answers
      questions.forEach(btn => {
        const other = btn.nextElementSibling;
        if (other && other !== answer) {
          other.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle this one
      const isOpen = answer.classList.toggle('open');
      q.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  /* ===== Lead Form toggles (hidden + visible classes) ===== */
  const toggles = Array.from(document.querySelectorAll('.lead-toggle'));
  const forms = Array.from(document.querySelectorAll('.lead-form-section'));
  const closeBtns = Array.from(document.querySelectorAll('.close-btn'));

  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      if (!targetId) return;
      forms.forEach(f => { f.classList.add('hidden'); f.classList.remove('visible'); });
      const target = document.getElementById(targetId);
      if (target) {
        target.classList.remove('hidden');
        requestAnimationFrame(() => target.classList.add('visible'));
        const first = target.querySelector('input, select, textarea, button');
        if (first) first.focus();
      }
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.lead-form-section');
      if (!parent) return;
      parent.classList.add('hidden');
      parent.classList.remove('visible');
      const related = document.querySelector(`.lead-toggle[data-target="${parent.id}"]`);
      if (related) related.focus();
    });
  });

  /* ===== Formspree submit handling (AJAX) ===== */
  document.querySelectorAll("form").forEach(form => {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      const action = form.getAttribute("action");
      if (!action) { form.submit(); return; }

      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        const redirectInput = form.querySelector('input[name="_redirect"]');
        if (redirectInput && redirectInput.value) {
          window.location.href = redirectInput.value;
        } else {
          window.location.href = "thankyou.html";
        }
      }).catch(() => {
        alert("Oops! Something went wrong. Please try again.");
      });
    });
  });

  /* ===== Initialize AOS (Animate On Scroll) ===== */
  if (window.AOS && typeof AOS.init === 'function') {
    AOS.init({ once: true, duration: 600 });
  }

  /* ===== Update footer year ===== */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
