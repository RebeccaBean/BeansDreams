// index.js – Bean's Dreams homepage interactions
document.addEventListener("DOMContentLoaded", () => {
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
      // Close other answers
      questions.forEach(btn => {
        if (btn !== q && btn.nextElementSibling) {
          btn.classList.remove("active");
          btn.nextElementSibling.classList.remove("open");
        }
      });

      // Toggle current answer
      q.classList.toggle("active");
      q.nextElementSibling.classList.toggle("open");
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
