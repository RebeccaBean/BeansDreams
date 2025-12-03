// nav.js

// Run after navigation has been injected
document.addEventListener("nav:loaded", () => {
  // Highlight active link
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });

  // Mobile dropdown toggle (click + keyboard)
  document.querySelectorAll('.dropdown > a').forEach(link => {
    link.addEventListener('click', e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        toggleDropdown(link);
      }
    });

    link.addEventListener('keydown', e => {
      if (window.innerWidth <= 768 && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        toggleDropdown(link);
      }
    });
  });
});

// Toggle hamburger menu
function toggleMenu() {
  const navMenu = document.getElementById("navMenu");
  const hamburger = document.querySelector(".hamburger");
  if (navMenu && hamburger) {
    navMenu.classList.toggle("show");
    const expanded = navMenu.classList.contains("show");
    hamburger.setAttribute("aria-expanded", expanded);
  }
}

// Toggle dropdown menus
function toggleDropdown(link) {
  const dropdownMenu = link.nextElementSibling;
  if (!dropdownMenu) return;

  const isOpen = dropdownMenu.classList.toggle("open");
  link.setAttribute("aria-expanded", isOpen);
}
