(function () {
  "use strict";

  // Anti-framing (backs up X-Frame-Options / frame-ancestors headers).
  try {
    if (window.top !== window.self) window.top.location.replace(window.self.location.href);
  } catch (e) {
    document.documentElement.style.display = "none";
  }

  // Mobile navigation
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navigation = document.querySelector("[data-nav]");

  function closeNavigation(restoreFocus) {
    if (!navToggle || !navigation) return;
    navToggle.setAttribute("aria-expanded", "false");
    navigation.removeAttribute("data-open");
    if (restoreFocus) navToggle.focus();
  }

  if (navToggle && navigation) {
    navToggle.addEventListener("click", function () {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      if (isOpen) navigation.removeAttribute("data-open");
      else navigation.setAttribute("data-open", "true");
    });
    navigation.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNavigation(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && navigation.hasAttribute("data-open")) closeNavigation(true);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeNavigation(false);
    });
  }

  // Active section highlighting
  const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${visible.target.id}`) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-28% 0px -62% 0px", threshold: [0.01, 0.2, 0.5] }
    );
    sections.forEach((section) => observer.observe(section));
  }

  // Copy email
  const copyButton = document.querySelector("[data-copy-email]");
  const copyStatus = document.querySelector("[data-copy-status]");
  let toastTimer;
  function showCopyStatus(message) {
    if (!copyStatus) return;
    copyStatus.textContent = message;
    copyStatus.setAttribute("data-visible", "true");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => copyStatus.removeAttribute("data-visible"), 2200);
  }
  if (copyButton) {
    copyButton.addEventListener("click", async function () {
      const email =
        copyButton.getAttribute("data-email") ||
        `${copyButton.getAttribute("data-user")}@${copyButton.getAttribute("data-domain")}`;
      try {
        await navigator.clipboard.writeText(email);
        copyButton.textContent = "Email copied";
        showCopyStatus("Email copied to clipboard.");
        window.setTimeout(() => { copyButton.textContent = "Copy email"; }, 2200);
      } catch (error) {
        showCopyStatus(`Copy failed. Email: ${email}`);
      }
    });
  }
})();
