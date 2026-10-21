(() => {
  const root = document.documentElement;
  const key = "prdxq-color-mode";
  let mode = "light";
  try {
    const saved = localStorage.getItem(key);
    if (saved === "dark" || saved === "light") mode = saved;
  } catch (_) {}

  const apply = (next) => {
    mode = next === "dark" ? "dark" : "light";
    root.dataset.theme = mode;
    root.style.colorScheme = mode;
    const control = document.querySelector(".prdxq-theme-switch");
    if (control) {
      control.setAttribute("aria-checked", String(mode === "dark"));
      control.setAttribute("aria-label", mode === "dark" ? "Dark Glass Mode aktiv. Zu Light Mode wechseln" : "Light Mode aktiv. Zu Dark Glass Mode wechseln");
      const label = control.querySelector(".prdxq-theme-label");
      const icon = control.querySelector(".prdxq-theme-icon");
      if (label) label.textContent = mode === "dark" ? "Dark" : "Light";
      if (icon) icon.textContent = mode === "dark" ? "☾" : "☼";
    }
    try { localStorage.setItem(key, mode); } catch (_) {}
  };

  const nav = document.querySelector(".nav-right");
  if (nav && !nav.querySelector(".prdxq-theme-switch")) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "prdxq-theme-switch";
    button.setAttribute("role", "switch");
    button.innerHTML = '<span class="prdxq-theme-icon" aria-hidden="true">☼</span><span class="prdxq-theme-label">Light</span><span class="prdxq-theme-track" aria-hidden="true"><i></i></span>';
    const firstLink = nav.querySelector(".nav-cta");
    if (firstLink) nav.insertBefore(button, firstLink);
    else nav.insertBefore(button, nav.firstChild);
    let downX = 0;
    let downY = 0;
    let dragged = false;
    let pointerId = null;
    button.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      downX = event.clientX;
      downY = event.clientY;
      dragged = false;
      pointerId = event.pointerId;
      try { button.setPointerCapture(pointerId); } catch (_) {}
    });
    button.addEventListener("pointermove", (event) => {
      if (pointerId !== event.pointerId) return;
      if (Math.abs(event.clientX - downX) > 7 || Math.abs(event.clientY - downY) > 10) dragged = true;
      if (dragged) apply(event.clientX >= downX ? "dark" : "light");
    });
    button.addEventListener("pointerup", (event) => {
      if (pointerId !== event.pointerId) return;
      if (dragged) {
        const rect = button.getBoundingClientRect();
        apply(event.clientX >= rect.left + rect.width / 2 ? "dark" : "light");
      }
      pointerId = null;
    });
    button.addEventListener("pointercancel", () => { pointerId = null; });
    button.addEventListener("click", () => {
      if (dragged) { dragged = false; return; }
      apply(mode === "dark" ? "light" : "dark");
    });
    button.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") { event.preventDefault(); apply("light"); }
      if (event.key === "ArrowRight") { event.preventDefault(); apply("dark"); }
    });
  }
  apply(mode);
})();
