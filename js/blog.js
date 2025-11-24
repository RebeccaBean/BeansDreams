document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("dreamCircleModal");
  const closeBtn = document.getElementById("dreamCircleClose");
  const leadForm = document.querySelector(".lead-form");

  if (!modal || !closeBtn) return;

  // Show popup once per session: either after 5s OR after scrolling 200px
  function showModal() {
    if (!sessionStorage.getItem("dreamCircleClosed")) {
      modal.classList.add("active");
    }
  }

  // Time trigger
  setTimeout(showModal, 5000);

  // Scroll trigger
  window.addEventListener("scroll", () => {
    if (!sessionStorage.getItem("dreamCircleClosed") && window.scrollY > 200) {
      showModal();
    }
  });

  // Close button
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    sessionStorage.setItem("dreamCircleClosed", "true");
  });

  // Handle form submission
  if (leadForm) {
    leadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target;
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(() => {
        sessionStorage.setItem("dreamCircleClosed", "true");
        window.location.href = "https://beansdreams.org/thankyou.html";
      }).catch(() => {
        alert("Oops! Something went wrong.");
      });
    });
  }
});
