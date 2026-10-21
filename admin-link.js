(() => {
  const navRight = document.querySelector(".nav-right");
  const mobileMenu = document.querySelector(".mobile-menu");
  if (!navRight) return;
  let link = document.querySelector(".prdxq-admin-link");
  if (!link) {
    link = document.createElement("a");
    link.className = "nav-cta prdxq-admin-link";
    link.href = "admin.html";
    link.textContent = "ADMIN ↗";
    link.setAttribute("aria-label", "Admin-Bereich öffnen");
  }
  const placeLink = () => {
    const isMobile = window.matchMedia("(max-width: 700px)").matches;
    if (isMobile && mobileMenu) {
      link.classList.add("mobile-menu-admin");
      mobileMenu.appendChild(link);
    } else {
      link.classList.remove("mobile-menu-admin");
      const menuToggle = navRight.querySelector(".menu-toggle");
      if (menuToggle) navRight.insertBefore(link, menuToggle);
      else navRight.appendChild(link);
    }
  };
  placeLink();
  window.addEventListener("resize", placeLink, { passive: true });
})();