// Light/dark theme toggle — mirrors the portfolio's ThemeContext behavior.
// The initial data-theme is set by an inline blocking script in <head> (see
// partials/head.html) to avoid a flash of the wrong theme before this runs.
(function () {
  const STORAGE_KEY = "theme";
  const GISCUS_ORIGIN = "https://giscus.app";

  function current() {
    return document.documentElement.getAttribute("data-theme") || "dark";
  }

  // transparent_dark lets the page's own near-black show through; light already matches white
  function giscusTheme(theme) {
    return theme === "light" ? "light" : "transparent_dark";
  }

  function syncGiscus(theme) {
    const frame = document.querySelector("iframe.giscus-frame");
    if (frame) {
      frame.contentWindow.postMessage({ giscus: { setConfig: { theme: giscusTheme(theme) } } }, GISCUS_ORIGIN);
    }
  }

  // The client script is injected here (not in the template) so it starts in the current theme
  function mountGiscus() {
    const host = document.getElementById("giscus");
    if (!host) return;
    const script = document.createElement("script");
    script.src = GISCUS_ORIGIN + "/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    host.getAttributeNames().forEach(function (name) {
      if (name.indexOf("data-") === 0) script.setAttribute(name, host.getAttribute(name));
    });
    script.setAttribute("data-theme", giscusTheme(current()));
    host.appendChild(script);
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
    syncGiscus(theme);
  }

  document.addEventListener("DOMContentLoaded", function () {
    apply(current());
    mountGiscus();
    const btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        apply(current() === "dark" ? "light" : "dark");
      });
    }
  });
})();
