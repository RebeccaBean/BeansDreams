/* ================================
   classes.js — Bean's Dreams
   CLEAN VERSION — No cart logic
   Handles: AOS + Filters + UI
================================ */

/* -------------------------------
   Init AOS (scroll animations)
-------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  if (AOS) AOS.init({
    duration: 800,
    once: true
  });
});

/* -------------------------------
   Category Filtering (Tabs/Buttons)
-------------------------------- */
const filterButtons = document.querySelectorAll("[data-filter]");
const classCards = document.querySelectorAll(".class-card, .product-card");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.filter;

    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    classCards.forEach((card) => {
      const cardCat = card.dataset.category;

      if (category === "all" || category === cardCat) {
        card.style.display = "block";
        card.setAttribute("data-aos", "fade-up");
      } else {
        card.style.display = "none";
      }
    });

    // Refresh AOS after filtering
    if (AOS) AOS.refresh();
  });
});

/* -------------------------------
   Carousel Logic (for product cards)
-------------------------------- */
document.querySelectorAll(".product-carousel").forEach((carousel) => {
  const track = carousel.querySelector(".product-carousel-track");
  const slides = carousel.querySelectorAll(".product-slide");
  const dotsContainer = carousel.querySelector(".product-carousel-dots");

  let index = 0;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("carousel-dot");
    if (i === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);

    dot.addEventListener("click", () => {
      index = i;
      updateCarousel();
    });
  });

  const dots = dotsContainer.querySelectorAll(".carousel-dot");

  function updateCarousel() {
    const offset = -index * 100;
    track.style.transform = `translateX(${offset}%)`;

    dots.forEach((d) => d.classList.remove("active"));
    dots[index].classList.add("active");
  }
});
/* -------------------------------
   Activate tab based on URL hash
-------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash.replace("#", "");
  if (hash) {
    const targetButton = document.querySelector(`.tab-button[data-tab="${hash}"]`);
    const targetContent = document.getElementById(hash);

    if (targetButton && targetContent) {
      // deactivate all tabs
      document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(sec => sec.style.display = "none");

      // activate the correct tab
      targetButton.classList.add("active");
      targetContent.style.display = "block";
    }
  }
});
