// TESTIMONIALS CAROUSEL
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');
let index = 0;

function showTestimonial(i) {
  testimonials.forEach((t, j) => {
    t.classList.toggle('active', j === i);
    dots[j].classList.toggle('active', j === i);
  });
}
dots.forEach((dot, i) => dot.addEventListener('click', () => {
  index = i;
  showTestimonial(index);
}));
setInterval(() => {
  index = (index + 1) % testimonials.length;
  showTestimonial(index);
}, 4000);

// FAQ ACCORDION
document.addEventListener("DOMContentLoaded", () => {
  const questions = document.querySelectorAll('.faq-question');

  questions.forEach(q => {
    q.addEventListener('click', () => {
      // Close other answers (accordion behavior)
      questions.forEach(btn => {
        if (btn !== q) {
          btn.classList.remove("active");
          btn.nextElementSibling.style.display = "none";
        }
      });

      // Toggle current answer
      const answer = q.nextElementSibling;
      if (answer.style.display === "block") {
        answer.style.display = "none";
        q.classList.remove("active");
      } else {
        answer.style.display = "block";
        q.classList.add("active");
      }
    });
  });
});


// FORM REDIRECT
document.addEventListener("DOMContentLoaded", () => {
  // Toggle form visibility
  const buttons = document.querySelectorAll(".lead-toggle");
  const forms = document.querySelectorAll(".lead-form-section");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.target;
      forms.forEach(form => {
        form.classList.add("hidden");
      });
      document.getElementById(targetId).classList.remove("hidden");
    });
  });

  // Formspree redirect
  document.querySelectorAll("form").forEach(form => {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      const action = form.getAttribute("action");
      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(() => {
        window.location.href = "thankyou.html";
      }).catch(() => {
        alert("Oops! Something went wrong.");
      });
    });
  });
});
document.querySelectorAll(".close-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.parentElement.classList.add("hidden");
  });
});