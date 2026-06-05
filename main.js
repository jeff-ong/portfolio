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

if ("IntersectionObserver" in window && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveNav(entry.target.dataset.section);
        }
      });
    },
    { threshold: 0.2, rootMargin: "-15% 0px -65% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
} else if (navLinks.length) {
  setActiveNav(navLinks[0].dataset.nav);
}
