(function () {
  "use strict";

  const data = window.portfolioData;
  const projectGrid = document.querySelector("#project-grid");
  const researchGrid = document.querySelector("#research-grid");
  const capabilityGrid = document.querySelector("#capability-grid");
  const trainingGrid = document.querySelector("#training-grid");

  function createProjectCard(project) {
    const article = document.createElement("article");
    article.className = "project-card";

    const statusClass = project.status === "verified" ? "status--verified" : "status--evaluation";
    const target = project.external ? ' target="_blank" rel="noopener noreferrer"' : "";
    const arrow = project.external ? "↗" : "→";

    article.innerHTML = `
      <div class="project-card__topline">
        <span class="project-card__index">${project.index}</span>
        <span class="status ${statusClass}">${project.statusLabel}</span>
      </div>
      <h3>${project.title}</h3>
      <p class="project-card__description">${project.description}</p>
      <ul class="project-card__points">
        ${project.points.map((point) => `<li>${point}</li>`).join("")}
      </ul>
      <div class="project-card__footer">
        <div class="tag-list" aria-label="Technology stack">
          ${project.stack.map((item) => `<span class="tag">${item}</span>`).join("")}
        </div>
        <a class="project-card__link" href="${project.link}"${target}>${project.linkLabel} <span aria-hidden="true">${arrow}</span></a>
      </div>
    `;

    return article;
  }

  function createCapabilityCard(capability) {
    const article = document.createElement("article");
    article.className = "capability-card";
    article.innerHTML = `
      <span class="capability-card__icon" aria-hidden="true">${capability.code}</span>
      <h3>${capability.title}</h3>
      <ul class="capability-list">
        ${capability.items.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    `;
    return article;
  }

  function createResearchCard(item) {
    const article = document.createElement("article");
    article.className = "research-card";
    article.innerHTML = `
      <div>
        <span class="status status--evaluation">${item.statusLabel}</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
      <div class="research-card__footer">
        <div class="tag-list" aria-label="Research topics">
          ${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
        <a href="${item.link}">${item.linkLabel} <span aria-hidden="true">→</span></a>
      </div>
    `;
    return article;
  }

  function createTrainingCard(item) {
    const article = document.createElement("article");
    article.className = "training-card";
    article.innerHTML = `
      <span class="status status--verified">Completed</span>
      <h3>${item.name}</h3>
      <p>${item.provider}</p>
      <strong>${item.detail}</strong>
    `;
    return article;
  }

  if (data && projectGrid) {
    const projectFragment = document.createDocumentFragment();
    data.supportingProjects.forEach((project) => projectFragment.append(createProjectCard(project)));
    projectGrid.append(projectFragment);
  }

  if (data && capabilityGrid) {
    const capabilityFragment = document.createDocumentFragment();
    data.capabilities.forEach((capability) => capabilityFragment.append(createCapabilityCard(capability)));
    capabilityGrid.append(capabilityFragment);
  }

  if (data && researchGrid) {
    const researchFragment = document.createDocumentFragment();
    data.researchWriting.forEach((item) => researchFragment.append(createResearchCard(item)));
    researchGrid.append(researchFragment);
  }

  if (data && trainingGrid) {
    const trainingFragment = document.createDocumentFragment();
    data.selectedTraining.forEach((item) => trainingFragment.append(createTrainingCard(item)));
    trainingGrid.append(trainingFragment);
  }

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
      if (isOpen) {
        navigation.removeAttribute("data-open");
      } else {
        navigation.setAttribute("data-open", "true");
      }
    });

    navigation.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNavigation(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && navigation.hasAttribute("data-open")) closeNavigation(true);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) closeNavigation(false);
    });
  }

  const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const observedSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && observedSections.length) {
    const activeSectionObserver = new IntersectionObserver(
      function (entries) {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        navLinks.forEach((link) => {
          const matches = link.getAttribute("href") === `#${visible.target.id}`;
          if (matches) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-28% 0px -62% 0px", threshold: [0.01, 0.2, 0.5] }
    );

    observedSections.forEach((section) => activeSectionObserver.observe(section));
  }

  const copyButton = document.querySelector("[data-copy-email]");
  const copyStatus = document.querySelector("[data-copy-status]");
  let toastTimer;

  function showCopyStatus(message) {
    if (!copyStatus) return;
    copyStatus.textContent = message;
    copyStatus.setAttribute("data-visible", "true");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      copyStatus.removeAttribute("data-visible");
    }, 2200);
  }

  if (copyButton) {
    copyButton.addEventListener("click", async function () {
      const email = copyButton.getAttribute("data-email");
      try {
        await navigator.clipboard.writeText(email);
        copyButton.textContent = "Email copied";
        showCopyStatus("Email copied to clipboard.");
        window.setTimeout(() => {
          copyButton.textContent = "Copy email";
        }, 2200);
      } catch (error) {
        showCopyStatus(`Copy failed. Email: ${email}`);
      }
    });
  }
})();
