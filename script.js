const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let scrollIdleTimer;
window.addEventListener('scroll', () => {
  document.documentElement.classList.add('is-scrolling');
  window.clearTimeout(scrollIdleTimer);
  scrollIdleTimer = window.setTimeout(() => {
    document.documentElement.classList.remove('is-scrolling');
  }, 140);
}, { passive: true });

const closeMenu = () => {
  menu?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
};

menuButton?.addEventListener('click', () => {
  const isOpen = menu?.classList.toggle('open') ?? false;
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

document.addEventListener('click', (event) => {
  if (menu?.classList.contains('open') && !menu.contains(event.target) && !menuButton?.contains(event.target)) {
    closeMenu();
  }
});

menu?.addEventListener('click', (event) => {
  const target = event.target;
  const sectionLink = target instanceof Element ? target.closest('a[href^="#"]') : null;

  if (menu.classList.contains('open') && sectionLink) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const faqItems = document.querySelectorAll('.faq-list .faq-item');
faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;

    faqItems.forEach((otherItem) => {
      if (otherItem !== item) otherItem.open = false;
    });
  });
});

const revealItems = document.querySelectorAll('.reveal');
if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const finishLoading = () => document.body.classList.add('loaded');

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', finishLoading, { once: true });
} else {
  finishLoading();
}

window.setTimeout(finishLoading, 5000);

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
