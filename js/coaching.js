// ============================
// UTILITY FUNCTIONS
// ============================
function safeQuery(selector) {
  return document.querySelector(selector);
}
function safeQueryAll(selector) {
  return Array.from(document.querySelectorAll(selector));
}

// ============================
// MAIN DOM CONTENT LOADED
// ============================
document.addEventListener("DOMContentLoaded", () => {

  // ----------------------------
  // AOS INIT
  // ----------------------------
  if (window.AOS && typeof AOS.init === "function") {
    AOS.init({ duration: 700, easing: "ease-out-quart", once: true });
  }

  // ----------------------------
  // DYNAMIC YEAR
  // ----------------------------
  const yearEl = safeQuery("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ----------------------------
  // FAQ ACCORDION
  // ----------------------------
  const questions = safeQueryAll(".faq-question");
  if (questions.length) {
    questions.forEach((question) => {
      question.addEventListener("click", () => {
        const answer = question.nextElementSibling;
        if (!answer) return;
        answer.classList.toggle("open");
        safeQueryAll(".faq-answer").forEach((other) => {
          if (other !== answer) other.classList.remove("open");
        });
      });
    });
  }

  // ----------------------------
  // LEAD MODAL (with butterfly & sparkle)
  // ----------------------------
  const leadModal = safeQuery("#leadModal");
  const leadClose = safeQuery("#leadClose");
  const leadForm = safeQuery("#leadForm");

  if (leadModal) {

    const showModal = () => {
      leadModal.classList.add("show");
      leadModal.setAttribute("aria-hidden", "false");
      AOS.refresh(); // animate modal
    };

    const hideModal = () => {
      leadModal.classList.remove("show");
      leadModal.setAttribute("aria-hidden", "true");
    };

    // Only show if user hasn't signed up
    const hasSignedUp = localStorage.getItem("signedUpForIntro") === "true";
    if (!hasSignedUp) {
      let modalShown = false;
      window.addEventListener("scroll", () => {
        if (!modalShown && window.scrollY > 300) {
          showModal();
          modalShown = true;
        }
      });
    }

    // Close modal
    if (leadClose) leadClose.addEventListener("click", hideModal);
    leadModal.addEventListener("click", (e) => {
      if (e.target === leadModal) hideModal();
    });

    // Form submission
    if (leadForm) {
      leadForm.addEventListener("submit", () => {
        localStorage.setItem("signedUpForIntro", "true");
        hideModal();
      });
    }
  }

});