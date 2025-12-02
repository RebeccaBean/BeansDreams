// index.js – Bean's Dreams homepage interactions
document.addEventListener("DOMContentLoaded", () => {
  // ===== Navigation Loader =====
  fetch("navigation.html") // relative path since files are side-by-side
    .then(r => {
      if (!r.ok) throw new Error("Navigation file not found");
      return r.text();
    })
    .then(html => {
      const el = document.getElementById("nav-placeholder");
      if (el) el.innerHTML = html;
    })
    .catch(() => {
      const el = document.getElementById("nav-placeholder");
      if (el) {
        el.innerHTML = `
          <nav class="fallback-nav">
            <a href="index.html">Home</a>
            <a href="about.html">About</a>
            <a href="contact.html">Contact</a>
          </nav>
        `;
      }
    });

  // ===== Testimonials Carousel =====
  const testimonials = document.querySelectorAll(".testimonial");
  const dots = document.querySelectorAll(".dot");
  let index = 0;

  function showTestimonial(i) {
    testimonials.forEach((t, j) => {
      t.classList.toggle("active", j === i);
      dots[j].classList.toggle("active", j === i);
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      index = i;
      showTestimonial(index);
    });
  });

  setInterval(() => {
    index = (index + 1) % testimonials.length;
    showTestimonial(index);
  }, 4000);

  showTestimonial(index); // initialize first testimonial

  // ===== FAQ Accordion =====
  const questions = document.querySelectorAll(".faq-question");
  questions.forEach(q => {
    q.addEventListener("click", () => {
      const answer = q.nextElementSibling;

      // Close all other answers
      document.querySelectorAll(".faq-answer").forEach(a => {
        if (a !== answer) {
          a.style.maxHeight = null;
          a.classList.remove("open");
        }
      });

      // Toggle current answer
      if (answer.classList.contains("open")) {
        answer.style.maxHeight = null;
        answer.classList.remove("open");
      } else {
        answer.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px"; // auto height
      }
    });
  });

  // ===== Lead Form Toggles =====
  const buttons = document.querySelectorAll(".lead-toggle");
  const forms = document.querySelectorAll(".lead-form-section");
  const closeBtns = document.querySelectorAll(".close-btn");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.target;
      forms.forEach(form => form.classList.add("hidden"));
      const targetForm = document.getElementById(targetId);
      if (targetForm) {
        targetForm.classList.remove("hidden");
        targetForm.classList.add("visible");
      }
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const section = btn.parentElement;
      section.classList.add("hidden");
      section.classList.remove("visible");
    });
  });

  // ===== Formspree Redirect =====
  document.querySelectorAll("form").forEach(form => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const action = form.getAttribute("action");
      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(() => {
          window.location.href = "thankyou.html";
        })
        .catch(() => {
          alert("Oops! Something went wrong.");
        });
    });
  });
});
