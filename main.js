const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#nav-menu");
const navLinks = document.querySelectorAll(".nav-links a[data-nav]");
const sections = document.querySelectorAll("[data-section]");
const themeToggle = document.querySelector(".theme-toggle");
const root = document.documentElement;

const storedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (storedTheme) {
  root.dataset.theme = storedTheme;
} else if (prefersDark) {
  root.dataset.theme = "dark";
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("theme", next);
  });
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setActiveNav(id) {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.nav === id);
  });
}

if (sections.length) {
  function updateActiveNav() {
    const triggerY = window.innerHeight * 0.35;
    let activeId = null;
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= triggerY) {
        activeId = section.dataset.section;
      }
    });
    setActiveNav(activeId);
  }

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  updateActiveNav();
}

const GA_MEASUREMENT_ID = "G-0L2J4LWQRB";
const CONSENT_KEY = "analytics-consent";
const cookieBanner = document.querySelector("#cookie-banner");

function loadAnalytics() {
  if (window.__gaLoaded) return;
  window.__gaLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_MEASUREMENT_ID);
  document.head.appendChild(script);
}

function saveConsent(choice) {
  localStorage.setItem(CONSENT_KEY, choice);
  if (cookieBanner) cookieBanner.hidden = true;
  if (choice === "granted") loadAnalytics();
}

const storedConsent = localStorage.getItem(CONSENT_KEY);

if (storedConsent === "granted") {
  loadAnalytics();
} else if (storedConsent !== "denied" && cookieBanner) {
  cookieBanner.hidden = false;
}

document.querySelector("#cookie-accept")?.addEventListener("click", () => {
  saveConsent("granted");
});

document.querySelector("#cookie-reject")?.addEventListener("click", () => {
  saveConsent("denied");
});
