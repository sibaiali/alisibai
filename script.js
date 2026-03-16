/* =====================================================
   Ali Sibai Portfolio — script.js
   ===================================================== */

// ── Custom cursor ──────────────────────────────────────
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');

let mouseX = 0, mouseY = 0;
let curX = 0,   curY = 0;
let dotX = 0,   dotY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  // Trailing effect for the ring
  curX += (mouseX - curX) * 0.14;
  curY += (mouseY - curY) * 0.14;
  cursor.style.left = curX + 'px';
  cursor.style.top  = curY + 'px';

  // Instant snapping for the dot
  dotX += (mouseX - dotX) * 0.5;
  dotY += (mouseY - dotY) * 0.5;
  cursorDot.style.left = dotX + 'px';
  cursorDot.style.top  = dotY + 'px';

  requestAnimationFrame(animateCursor);
}
animateCursor();

// ── Scroll-based section reveal ────────────────────────
const sections = document.querySelectorAll('.section');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

sections.forEach(sec => revealObserver.observe(sec));

// ── Active nav highlight on scroll ────────────────────
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === id);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => navObserver.observe(sec));

// ── Smooth scroll for nav links ────────────────────────
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Skill bar animation on section visible ─────────────
// Bars animate via CSS when .section.visible is applied,
// using the transition on .pill-fill { width: var(--w) }

// ── Stat counter animation ─────────────────────────────
function animateCount(el, target, duration = 1200) {
  let start = 0;
  const startTime = performance.now();
  const isDecimal = String(target).includes('.');

  function step(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    const value    = Math.floor(ease * target);
    el.textContent = value + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Observe stat cards to trigger count-up
const statNums = document.querySelectorAll('.stat-num');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const text = el.textContent.trim();
      const hasPlus = text.includes('+');
      // detect ordinal suffix: th, st, nd, rd
      const ordinalMatch = text.match(/(st|nd|rd|th)$/i);
      const num = parseInt(text.replace(/\D/g, ''), 10);
      if (!isNaN(num) && num > 0) {
        if (ordinalMatch) {
          el.dataset.suffix = ordinalMatch[0];
        } else {
          el.dataset.suffix = hasPlus ? '+' : '';
        }
        animateCount(el, num);
      }
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.8 });

statNums.forEach(el => countObserver.observe(el));

// ── Particle sparkles on click ─────────────────────────
document.addEventListener('click', e => {
  const colors = ['#a855f7', '#e040fb', '#2dd4bf', '#38bdf8', '#34d399'];
  for (let i = 0; i < 8; i++) {
    const spark = document.createElement('div');
    spark.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 9998;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      transition: transform 0.6s ease-out, opacity 0.6s ease-out;
      opacity: 1;
    `;
    document.body.appendChild(spark);
    const angle = (i / 8) * 360;
    const distance = 40 + Math.random() * 40;
    const rad = (angle * Math.PI) / 180;
    requestAnimationFrame(() => {
      spark.style.transform = `translate(${Math.cos(rad) * distance}px, ${Math.sin(rad) * distance}px) scale(0)`;
      spark.style.opacity = '0';
    });
    setTimeout(() => spark.remove(), 700);
  }
});

// ── Tilt effect on project cards ──────────────────────
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-6px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});

// ── Typing effect for tagline in sidebar ──────────────
const taglineEl = document.querySelector('.tagline');
if (taglineEl) {
  const originalHTML = taglineEl.innerHTML;
  const text1 = 'Building intelligent systems &';
  const text2 = 'game-driven software.';
  taglineEl.innerHTML = '';

  let charIdx = 0;
  const fullText = text1 + '\n' + text2;
  const processedLines = [text1, text2];

  function typeChar() {
    const line0Done = charIdx >= processedLines[0].length;
    const totalLen = processedLines[0].length + processedLines[1].length + 1; // +1 for <br>

    if (charIdx === 0) {
      taglineEl.innerHTML = '';
    }

    if (charIdx < processedLines[0].length) {
      taglineEl.innerHTML = processedLines[0].slice(0, charIdx + 1);
    } else if (charIdx === processedLines[0].length) {
      taglineEl.innerHTML = processedLines[0] + '<br>';
    } else {
      const secondIdx = charIdx - processedLines[0].length - 1;
      taglineEl.innerHTML = processedLines[0] + '<br>' + processedLines[1].slice(0, secondIdx + 1);
    }

    charIdx++;
    if (charIdx <= processedLines[0].length + processedLines[1].length + 1) {
      setTimeout(typeChar, 45);
    }
  }

  // Delay to let page load
  setTimeout(typeChar, 800);
}

// ── Mobile nav toggle ─────────────────────────────────
// On small screens, add a floating nav button
if (window.innerWidth <= 768) {
  const sidebar = document.getElementById('sidebar');
  const mobileNavBtn = document.createElement('button');
  mobileNavBtn.id = 'mobile-nav-btn';
  mobileNavBtn.setAttribute('aria-label', 'Navigation');
  mobileNavBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
  mobileNavBtn.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 1000;
    width: 52px; height: 52px; border-radius: 50%;
    background: linear-gradient(135deg, #7c3aed, #e040fb);
    border: none; display: flex; align-items: center; justify-content: center;
    color: white; cursor: pointer; box-shadow: 0 8px 24px rgba(124,58,237,0.4);
  `;
  document.body.appendChild(mobileNavBtn);

  const mobileNav = document.createElement('div');
  mobileNav.id = 'mobile-nav-overlay';
  mobileNav.style.cssText = `
    display: none; position: fixed; inset: 0; z-index: 999;
    background: rgba(5,11,24,0.95); backdrop-filter: blur(12px);
    flex-direction: column; align-items: center; justify-content: center; gap: 28px;
  `;
  const sectionNames = ['About','Experience','Projects','Skills','Education','Contact'];
  const sectionIds   = ['about','experience','projects','skills','education','contact'];
  sectionNames.forEach((name, i) => {
    const a = document.createElement('a');
    a.href = '#' + sectionIds[i];
    a.textContent = name;
    a.style.cssText = `font-family: 'Fira Code', monospace; font-size: 1.4rem; color: #cdd9f5; transition: color 0.2s;`;
    a.addEventListener('click', () => {
      mobileNav.style.display = 'none';
      document.querySelector('#' + sectionIds[i]).scrollIntoView({ behavior: 'smooth' });
    });
    a.addEventListener('mouseover', () => a.style.color = '#a855f7');
    a.addEventListener('mouseout',  () => a.style.color = '#cdd9f5');
    mobileNav.appendChild(a);
  });
  document.body.appendChild(mobileNav);

  mobileNavBtn.addEventListener('click', () => {
    const open = mobileNav.style.display === 'flex';
    mobileNav.style.display = open ? 'none' : 'flex';
  });
}

// ── Page load entrance animation ──────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});

// ── Internship day-log accordion ──────────────────────
const internLogBtn  = document.getElementById('intern-log-btn');
const internLogBody = document.getElementById('intern-log-body');

if (internLogBtn && internLogBody) {
  internLogBtn.addEventListener('click', () => {
    const isOpen = internLogBody.classList.toggle('open');
    internLogBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    internLogBody.setAttribute('aria-hidden',  isOpen ? 'false' : 'true');
  });
}
