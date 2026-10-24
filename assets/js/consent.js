// GA4 behind consent (basic Consent Mode): gtag is never loaded until the visitor accepts.
// Same cookie as the portfolio (wstech/src/lib/analytics.ts), on .wstech.tech, so one answer covers both sites.
(function () {
  const COOKIE = "wstech_consent";
  const ROOT_DOMAIN = "wstech.tech";
  const banner = document.getElementById("consent");
  if (!banner) return;
  const id = banner.getAttribute("data-ga");

  function onRootDomain() {
    const host = location.hostname;
    return host === ROOT_DOMAIN || host.endsWith("." + ROOT_DOMAIN);
  }

  function setCookie(name, value, maxAge) {
    const domain = onRootDomain() ? "; Domain=." + ROOT_DOMAIN : "";
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = name + "=" + value + "; Max-Age=" + maxAge + "; Path=/; SameSite=Lax" + domain + secure;
  }

  function read() {
    const match = document.cookie.match(/(?:^|; )wstech_consent=(granted|denied)/);
    return match ? match[1] : null;
  }

  function load() {
    if (window.gtag) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + id;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    // gtag.js expects the Arguments object, not an array
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", id); // static pages: the default page_view is what we want
  }

  // Withdrawing consent also drops the cookies Google already set
  function clearGaCookies() {
    document.cookie.split("; ").forEach(function (pair) {
      const name = pair.split("=")[0];
      if (name === "_ga" || name.indexOf("_ga_") === 0) setCookie(name, "", 0);
    });
  }

  const consent = read();
  if (consent === "granted") load();
  else if (!consent) banner.hidden = false;

  banner.querySelector("[data-accept]").addEventListener("click", function () {
    setCookie(COOKIE, "granted", 60 * 60 * 24 * 365);
    banner.hidden = true;
    load();
  });
  banner.querySelector("[data-decline]").addEventListener("click", function () {
    setCookie(COOKIE, "denied", 60 * 60 * 24 * 365);
    clearGaCookies();
    banner.hidden = true;
  });

  const settings = document.getElementById("cookie-settings");
  if (settings) {
    settings.hidden = false;
    settings.addEventListener("click", function () {
      banner.hidden = false;
    });
  }
})();
