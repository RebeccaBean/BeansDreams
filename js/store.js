// store.js - UI logic for Bean's Dreams Store
document.addEventListener("DOMContentLoaded", () => {
  /* ---------- AOS ---------- */
  if (typeof AOS !== "undefined" && typeof AOS.init === "function") {
    try {
      AOS.init({ duration: 700, easing: "ease-out-quart", once: true });
    } catch (e) {
      console.warn("AOS init failed:", e);
    }
  }

  /* ---------- Tabs ---------- */
  const tabButtons = document.querySelectorAll(".tab-btn");
  const sections = document.querySelectorAll(".store-section");
  const subcategories = document.querySelectorAll(".subcategories");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Activate tab button
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const target = btn.dataset.target;

      // Show only the matching store section
      sections.forEach(sec => {
        sec.classList.toggle("active", sec.id === target);
      });

      // Show only the matching subcategory menu
      subcategories.forEach(menu => {
        menu.classList.toggle("hidden", !menu.id.startsWith(target));
      });
    });
  });

  /* ---------- Subcategory Filtering ---------- */
  document.querySelectorAll(".subcategory-select").forEach(select => {
    select.addEventListener("change", () => {
      const sectionId = select.dataset.section;
      const selectedCategory = select.value;
      const section = document.getElementById(sectionId);
      if (!section) return;

      section.querySelectorAll(".product-card").forEach(card => {
        const cat = card.dataset.category || card.getAttribute("data-type") || "any";
        card.style.display =
          selectedCategory === "all" || cat === selectedCategory ? "" : "none";
      });
    });
  });

  /* ---------- Size & Color Dropdowns ---------- */
  // Attach listeners to size/color selects inside product cards
  document.querySelectorAll(".product-card").forEach(card => {
    const sizeSelect = card.querySelector("select[name='size']");
    const colorSelect = card.querySelector("select[name='color']");

    function updateVariantAttributes() {
      const addBtn = card.querySelector(".add-cart-btn");
      if (!addBtn) return;

      if (sizeSelect) {
        const selectedSize = sizeSelect.value;
        const variantId = sizeSelect.options[sizeSelect.selectedIndex]?.dataset.variantId;
        addBtn.setAttribute("data-size", selectedSize);
        if (variantId) addBtn.setAttribute("data-variant-id", variantId);
      }

      if (colorSelect) {
        const selectedColor = colorSelect.value;
        addBtn.setAttribute("data-color", selectedColor);
      }
    }

    if (sizeSelect) sizeSelect.addEventListener("change", updateVariantAttributes);
    if (colorSelect) colorSelect.addEventListener("change", updateVariantAttributes);

    // Initialize attributes on page load
    updateVariantAttributes();
  });
  
  // ---------- Handle navigation hash ----------
const hash = window.location.hash.replace("#", "");
if (hash) {
  const targetBtn = document.querySelector(`.tab-btn[data-target="${hash}"]`);
  if (targetBtn) {
    targetBtn.click(); // simulate click to activate section + subcategories
  }
}

  /* ---------- Product Carousel ---------- */
  document.querySelectorAll(".product-carousel").forEach(carousel => {
    const track = carousel.querySelector(".product-carousel-track");
    const dotsContainer = carousel.querySelector(".product-carousel-dots");
    if (!track || !dotsContainer) return;

    const slides = Array.from(track.children);
    if (!slides.length) return;

    let currentIndex = 0;
    let timer;

    slides.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.classList.add("product-dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        currentIndex = i;
        updateCarousel();
        restartTimer();
      });
      dotsContainer.appendChild(dot);
    });

    function updateCarousel() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dotsContainer.querySelectorAll(".product-dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
      });
    }
    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    }
    function startTimer() {
      timer = setInterval(nextSlide, 4000);
    }
    function restartTimer() {
      clearInterval(timer);
      startTimer();
    }

    updateCarousel();
    startTimer();
  });

  /* ---------- Quote Carousel ---------- */
  (function initQuoteCarousel() {
    const quoteCarousel = document.querySelector(".quote-carousel");
    if (!quoteCarousel) return;
    const track = quoteCarousel.querySelector(".carousel-track");
    const slides = quoteCarousel.querySelectorAll(".quote-slide");
    const dots = quoteCarousel.querySelectorAll(".dot");
    const prevBtn = quoteCarousel.querySelector(".carousel-btn.prev");
    const nextBtn = quoteCarousel.querySelector(".carousel-btn.next");
    if (!track || !slides.length || !dots.length) return;

    let currentIndex = 0;
    let carouselTimer = null;

    function showSlide(index) {
      slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
      dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
      currentIndex = index;
    }
    function nextSlide() {
      showSlide((currentIndex + 1) % slides.length);
    }
    function prevSlide() {
      showSlide((currentIndex - 1 + slides.length) % slides.length);
    }
    function startCarousel() {
      carouselTimer = setInterval(nextSlide, 5000);
    }
    function restartCarousel() {
      clearInterval(carouselTimer);
      startCarousel();
    }

    dots.forEach((dot, i) =>
      dot.addEventListener("click", () => {
        showSlide(i);
        restartCarousel();
      })
    );
    if (nextBtn) nextBtn.addEventListener("click", () => {
      nextSlide();
      restartCarousel();
    });
    if (prevBtn) prevBtn.addEventListener("click", () => {
      prevSlide();
      restartCarousel();
    });

    showSlide(0);
    startCarousel();
  })();
});
// ---------- Handle navigation hash ----------
const hash = window.location.hash.replace("#", "");
if (hash) {
  const targetBtn = document.querySelector(`.tab-btn[data-target="${hash}"]`);
  if (targetBtn) {
    targetBtn.click(); // simulate click to activate section + subcategories
  }
}
