/* index.js - main page behaviors */
document.addEventListener("DOMContentLoaded", () => {
  /* ===== Testimonials Carousel ===== */
  const testimonials = Array.from(document.querySelectorAll('.testimonial'));
  const dots = Array.from(document.querySelectorAll('.dot'));
  let index = 0;

  function showTestimonial(i) {
    if (!testimonials.length) return;
    index = i % testimonials.length;
    testimonials.forEach((t, j) => t.classList.toggle('active', j === index));
    dots.forEach((d, j) => d.classList.toggle('active', j === index));
  }

  if (testimonials.length && dots.length) {
    // defensive: if counts mismatch, use min length
    if (testimonials.length !== dots.length) {
      console.warn('testimonials and dots count mismatch:', testimonials.length, dots.length);
    }
    dots.forEach((dot, i) => dot.addEventListener('click', () => {
      showTestimonial(i);
    }));
    showTestimonial(0);
    setInterval(() => {
      showTestimonial((index + 1) % testimonials.length);
    }, 4000);
  }

  /* ===== FAQ Accordion (class-based, accessible) ===== */
  const questions = Array.from(document.querySelectorAll('.faq-question'));
  questions.forEach(q => {
    // ensure aria-expanded exists
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

  /* ===== Lead Form toggles (use hidden + visible classes) ===== */
  const buttons = Array.from(document.querySelectorAll(".lead-toggle"));
  const forms = Array.from(document.querySelectorAll(".lead-form-section"));

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.target;
      if (!targetId) return;
      forms.forEach(form => {
        form.classList.add("hidden");
        form.classList.remove("visible");
      });
      const targetForm = document.getElementById(targetId);
      if (targetForm) {
        targetForm.classList.remove("hidden");
        // allow layout to update then add visible for transition
        requestAnimationFrame(() => targetForm.classList.add("visible"));
        // focus first input for accessibility
        const firstInput = targetForm.querySelector('input, select, textarea, button');
        if (firstInput) firstInput.focus();
      }
    });
  });

  /* ===== Close buttons for forms ===== */
  document.querySelectorAll(".close-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const parent = btn.closest(".lead-form-section");
      if (!parent) return;
      parent.classList.add("hidden");
      parent.classList.remove("visible");
      // return focus to the first lead-toggle button for accessibility
      const relatedToggle = document.querySelector(`.lead-toggle[data-target="${parent.id}"]`);
      if (relatedToggle) relatedToggle.focus();
    });
  });

  /* ===== Formspree submit handling (AJAX) ===== */
  document.querySelectorAll("form").forEach(form => {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      const action = form.getAttribute("action");
      if (!action) {
        form.submit();
        return;
      }
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

  /* ===== Cart accessibility helper (toggle aria-hidden when cart is shown/hidden) ===== */
  const cartEl = document.getElementById('cart');
  const cartToggle = document.getElementById('cart-toggle');
  const closeCartBtn = document.getElementById('close-cart');

  function openCart() {
    if (!cartEl) return;
    cartEl.classList.add('open'); // optional: style in cart.css
    cartEl.setAttribute('aria-hidden', 'false');
  }
  function closeCart() {
    if (!cartEl) return;
    cartEl.classList.remove('open');
    cartEl.setAttribute('aria-hidden', 'true');
  }

  if (cartToggle) {
    cartToggle.addEventListener('click', () => {
      const isHidden = cartEl && cartEl.getAttribute('aria-hidden') === 'true';
      if (isHidden) openCart(); else closeCart();
    });
  }
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);

  /* ===== Defensive: ensure AOS is initialized if not already ===== */
  if (window.AOS && typeof AOS.init === 'function') {
    AOS.init({ once: true, duration: 600 });
  }
});
