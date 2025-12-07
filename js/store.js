(function () {
  /* ---------- Safe helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const isFunction = fn => typeof fn === "function";
  const toNumber = v => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };

  /* ---------- Config: selectors & attribute mapping ---------- */
  const cfg = {
    // Sidebar/cart controls
    cartToggleId: "cart-toggle",
    cartSidebarId: "cart",
    cartCloseId: "close-cart",
    cartItemsId: "cart-items",
    cartTotalId: "cart-total",
    cartCountId: "cart-count",
    checkoutBtnId: "checkout-btn",

    // Product markup
    productCardSel: ".product-card",
    addCartBtnSel: ".add-cart-btn",
    sizeSelectSel: "select[name='size']",

    // Attribute names used in your HTML
    attrs: {
      name: ["data-name", "data-title", "data-label"],
      price: ["data-price", "data-amount"],
      type: ["data-type", "data-category"],
      bundleKey: ["data-bundle-key", "data-key", "data-bundle"],
      productId: ["data-product-id", "data-digital-id", "data-id"],
      printifyProductId: ["data-printify-product-id", "data-merch-id", "data-product-id"],
      // variant usually on the <option>
      variantId: ["data-variant-id"]
    },

    // Optional: build backend URL base for relative calls
    apiBase: "", // e.g., "" for same origin, or "https://api.beansdreams.org"
  };

  /* ---------- AOS ---------- */
  if (typeof AOS !== "undefined" && isFunction(AOS.init)) {
    try { AOS.init(); } catch (e) { /* ignore */ }
  }

  /* ---------- Tabs ---------- */
  const tabButtons = $$(".tab-btn");
  const storeSections = $$(".store-section");
  const productSections = $$(".product-section");
  const subcategoryMenus = $$(".subcategories");
  const selects = $$(".subcategory-select");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const target = btn.dataset.target;

      storeSections.forEach(sec => sec.classList.toggle("active", sec.id === target));
      productSections.forEach(sec => sec.classList.toggle("active", sec.id === target));
      subcategoryMenus.forEach(menu => {
        menu.classList.toggle("hidden", !(menu.id || "").startsWith(target));
      });
    });
  });

  // Subcategory filtering
  selects.forEach(select => {
    select.addEventListener("change", () => {
      const sectionId = select.dataset.section;
      const selectedCategory = select.value;
      const products = $$(cfg.productCardSel, document.getElementById(sectionId) || document);
      products.forEach(card => {
        const cat = card.dataset.category || card.getAttribute("data-type") || "any";
        card.style.display = (selectedCategory === "all" || cat === selectedCategory) ? "block" : "none";
      });
    });
  });

  /* ---------- Product Carousel ---------- */
  $$(".product-carousel").forEach(carousel => {
    const track = $(".product-carousel-track", carousel);
    const dotsContainer = $(".product-carousel-dots", carousel);
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
      $$(".product-dot", dotsContainer).forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
      });
    }
    function nextSlide() { currentIndex = (currentIndex + 1) % slides.length; updateCarousel(); }
    function startTimer() { timer = setInterval(nextSlide, 4000); }
    function restartTimer() { clearInterval(timer); startTimer(); }

    updateCarousel();
    startTimer();
  });

  /* ---------- Quote Carousel ---------- */
  (function initQuoteCarousel() {
    const quoteCarousel = $(".quote-carousel");
    if (!quoteCarousel) return;
    const track = $(".carousel-track", quoteCarousel);
    const slides = $$(".quote-slide", quoteCarousel);
    const dots = $$(".dot", quoteCarousel);
    const prevBtn = $(".carousel-btn.prev", quoteCarousel);
    const nextBtn = $(".carousel-btn.next", quoteCarousel);
    if (!track || !slides.length || !dots.length) return;

    let currentIndex = 0;
    let carouselTimer = null;

    function showSlide(index) {
      slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
      dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
      currentIndex = index;
    }
    function nextSlide() { showSlide((currentIndex + 1) % slides.length); }
    function prevSlide() { showSlide((currentIndex - 1 + slides.length) % slides.length); }
    function startCarousel() { carouselTimer = setInterval(nextSlide, 5000); }
    function restartCarousel() { clearInterval(carouselTimer); startCarousel(); }

    dots.forEach((dot, i) => dot.addEventListener("click", () => { showSlide(i); restartCarousel(); }));
    if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); restartCarousel(); });
    if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); restartCarousel(); });

    showSlide(0);
    startCarousel();
  })();
})();