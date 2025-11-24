document.addEventListener("DOMContentLoaded", () => {
  fetch("nav.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("nav-placeholder").innerHTML = data;

      // Highlight active link
      const currentPage = window.location.pathname.split("/").pop();
      document.querySelectorAll(".nav-link").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
          link.classList.add("active");
        }
      });

      // Mobile dropdown toggle
      document.querySelectorAll('.dropdown > a').forEach(link => {
        link.addEventListener('click', e => {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            const dropdownMenu = link.nextElementSibling;
            if (!dropdownMenu) return;  // safety
            dropdownMenu.style.display =
              dropdownMenu.style.display === 'block' ? 'none' : 'block';
          }
        });
      });
    })
    .catch(error => console.error("Error loading nav:", error));
});

function toggleMenu() {
  const navMenu = document.getElementById("navMenu");
  if (navMenu) navMenu.classList.toggle("show");
}
