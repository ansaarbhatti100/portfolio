import { initHero3D } from './three-hero.js';
import { initInteractions } from './interactions.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Three.js Hero Canvas
  initHero3D();

  // Initialize UI interactions, 3D tilt, counters, typing
  initInteractions();

  // Reveal Animations on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-init').forEach(el => {
    observer.observe(el);
  });
});
