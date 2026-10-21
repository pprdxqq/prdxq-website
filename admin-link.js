(() => {
  const navRight = document.querySelector(".nav-right");
  if (navRight && !navRight.querySelector(".prdxq-admin-link")) {
    const link = document.createElement("a");
    link.className = "nav-cta prdxq-admin-link";
    link.href = "admin.html";
    link.textContent = "ADMIN ↗";
    link.setAttribute("aria-label", "Admin-Bereich öffnen");
    const menu = navRight.querySelector(".menu-toggle");
    if (menu) navRight.insertBefore(link, menu); else navRight.appendChild(link);
  }
})();