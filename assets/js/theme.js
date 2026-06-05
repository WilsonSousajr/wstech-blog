// Light/dark theme toggle — mirrors the portfolio's ThemeContext behavior.
// The initial data-theme is set by an inline blocking script in <head> (see
// partials/head.html) to avoid a flash of the wrong theme before this runs.
(function () {
  const STORAGE_KEY = "theme";

  function current() {
    return document.documentElement.getAttribute("data-theme") || "dark";
  }

  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* localStorage unavailable (private mode) — toggle still works for the session */
    }
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      const isDark = theme === "dark";
      btn.setAttribute("aria-pressed", String(isDark));
      btn.querySelector("[data-icon-sun]").hidden = !isDark;
      btn.querySelector("[data-icon-moon]").hidden = isDark;
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    apply(current());
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        apply(current() === "dark" ? "light" : "dark");
      });
    }
  });
})();
