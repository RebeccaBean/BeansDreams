document.addEventListener('DOMContentLoaded', () => {
  /* ---------------------------
     AOS and Year
     --------------------------- */
  if (window.AOS && typeof AOS.init === 'function') {
    AOS.init({ duration: 700, easing: 'ease-out-quart', once: true });
  }
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------
     Navigation loader with fallback
     --------------------------- */
  const navPlaceholder = document.getElementById('nav-placeholder');
  const fallbackNav = `
    <nav class="site-nav" role="navigation" aria-label="Main navigation">
      <div class="nav-inner">
        <a href="/" class="nav-brand" aria-label="Bean's Dreams home">Bean's Dreams</a>
        <button id="mobile-nav-toggle" aria-expanded="false" aria-controls="primary-nav">Menu</button>
        <ul id="primary-nav" class="nav-list">
          <li><a href="/">Home</a></li>
          <li><a href="/classes.html">Classes</a></li>
          <li><a href="/coaching.html">Coaching</a></li>
          <li><a href="/about.html">About</a></li>
          <li><a href="/contact.html">Contact</a></li>
          <li><a href="/store.html">Store</a></li>
          <li><a href="/blog.html">Blog</a></li>
          <li><a href="/portal.html">Student Portal</a></li>
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
    fetch('navigation.html', { cache: 'no-store' })
      .then(resp => resp.ok ? resp.text() : Promise.reject())
      .then(text => {
        if (!text || text.trim().length < 20) insertNav(fallbackNav);
        else insertNav(text);
      })
      .catch(() => insertNav(fallbackNav));
  }

  /* ---------------------------
     Lead form toggles
     --------------------------- */
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
        btn.setAttribute('aria-expanded', 'true');
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
      if (related) {
        related.setAttribute('aria-expanded', 'false');
        related.focus();
      }
    });
  });

  /* ---------------------------
     Testimonials carousel
     --------------------------- */
  const testimonials = Array.from(document.querySelectorAll('.testimonial'));
  const dots = Array.from(document.querySelectorAll('.dot'));
  let tIndex = 0;
  let tTimer = null;

  function showTestimonial(i) {
    if (!testimonials.length) return;
    tIndex = i % testimonials.length;
    testimonials.forEach((t, j) => t.classList.toggle('active', j === tIndex));
    dots.forEach((d, j) => {
      d.classList.toggle('active', j === tIndex);
      d.setAttribute('aria-selected', j === tIndex ? 'true' : 'false');
    });
  }

  if (testimonials.length && dots.length) {
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showTestimonial(i);
        if (tTimer) clearInterval(tTimer);
        tTimer = setInterval(() => showTestimonial((tIndex + 1) % testimonials.length), 4000);
      });
    });
    showTestimonial(0);
    tTimer = setInterval(() => showTestimonial((tIndex + 1) % testimonials.length), 4000);
  }

/* ---------------------------
   FAQ accordion
   --------------------------- */
const questions = document.querySelectorAll('.faq-question');
questions.forEach(q => {
  const answerId = q.getAttribute('aria-controls');
  const answer = document.getElementById(answerId);
  if (!answer) return;

  // Ensure initial state
  q.setAttribute('aria-expanded', 'false');
  answer.hidden = true;

  q.addEventListener('click', () => {
    const isOpen = q.getAttribute('aria-expanded') === 'true';
    q.setAttribute('aria-expanded', String(!isOpen));
    answer.hidden = isOpen; // show if closed, hide if open
  });
});

  /* ---------------------------
     Formspree AJAX Submission with Redirect
     --------------------------- */
  const leadForms = document.querySelectorAll('.lead-form');
  leadForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const action = form.getAttribute('action');
      const redirectUrl = form.querySelector('input[name="_redirect"]')?.value;

      try {
        const response = await fetch(action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          window.location.href = redirectUrl || 'thankyou.html';
        } else {
          alert('Oops! There was a problem submitting your form.');
        }
      } catch (err) {
        console.error(err);
        alert('Network error. Please try again later.');
      }
    });
  });

  /* ---------------------------
     AOS refresh after dynamic content insertion
     --------------------------- */
  if (window.AOS && typeof AOS.refresh === 'function') {
    setTimeout(() => AOS.refresh(), 250);
  }
});
// Hidden PayPal integration
if (window.paypal && typeof window.paypal.Buttons === "function") {
  try {
    window.paypal.Buttons({
      createOrder: (_data, actions) => {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
        return actions.order.create({
          purchase_units: [{ amount: { value: total } }]
        });
      },
      onApprove: async (_data, actions) => {
        const details = await actions.order.capture();
        try {
          let headers = { "Content-Type": "application/json" };
          if (window.firebase && firebase.auth().currentUser) {
            const idToken = await firebase.auth().currentUser.getIdToken();
            headers.Authorization = `Bearer ${idToken}`;
          }
          await fetch("/capture-order", {
            method: "POST",
            headers,
            body: JSON.stringify({ cart, order: details })
          });
          alert(`Transaction completed by ${details?.payer?.name?.given_name || "customer"}.`);
          cart = [];
          saveCart();
          updateCartUI();
          closeCart();
        } catch (err) {
          console.error("Error sending PayPal order to backend:", err);
        }
      }
    }).render("#hidden-paypal");
  } catch (e) {
    console.error("PayPal Buttons initialization error:", e);
  }
}

// Checkout button triggers hidden PayPal flow
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    const paypalBtn = document.querySelector("#hidden-paypal iframe");
    if (paypalBtn) {
      paypalBtn.click();
    } else {
      alert("PayPal checkout not ready yet.");
    }
  });
}
