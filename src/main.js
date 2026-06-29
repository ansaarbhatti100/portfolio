import './style.css';
import { initParticles } from './particles.js';

let gsap = null;
let ScrollTrigger = null;
let loadGSAPPromise = null;

// Dynamic GSAP Loader
async function loadGSAP() {
  if (loadGSAPPromise) return loadGSAPPromise;
  loadGSAPPromise = (async () => {
    try {
      const gsapModule = await import('gsap');
      const scrollTriggerModule = await import('gsap/ScrollTrigger');
      gsap = gsapModule.gsap;
      ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
    } catch (e) {
      console.error("Failed to load GSAP dynamically:", e);
    }
  })();
  return loadGSAPPromise;
}

// Initialize Interactive Particles Canvas (Only on Desktop/Tablets for performance)
let cleanupParticles = null;
if (window.innerWidth >= 768) {
  try {
    cleanupParticles = initParticles();
  } catch (e) {
    console.error("Failed to initialize particles background:", e);
  }
} else {
  // Hide canvas on mobile
  const canvas = document.getElementById('particles-canvas');
  if (canvas) canvas.style.display = 'none';
}

// -------------------------------------------------------------
// 1. PRELOADER & COUNTER INITIALIZATION
// -------------------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
  const counterElement = document.getElementById('preloader-counter');
  const barElement = document.getElementById('preloader-bar');
  const preloaderElement = document.getElementById('preloader');

  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    // Skip preloader entirely on mobile to optimize First Contentful Paint (FCP)
    if (preloaderElement) preloaderElement.style.display = 'none';
    
    // Set counters instantly on mobile
    const counters = document.querySelectorAll('.counter-value');
    counters.forEach(counter => {
      const target = counter.getAttribute('data-target');
      if (target) counter.textContent = target;
    });
    
    typeEffect();
    return;
  }

  // Desktop: start preloading GSAP in parallel immediately
  loadGSAP();

  let count = 0;
  // Fast fake-loading sequence
  const interval = setInterval(() => {
    count += Math.floor(Math.random() * 8) + 5;
    if (count >= 100) {
      count = 100;
      clearInterval(interval);

      // Slide-up preloader once GSAP has loaded and preloading is complete
      loadGSAP().then(() => {
        if (!gsap) {
          if (preloaderElement) preloaderElement.style.display = 'none';
          triggerHeroEntrance();
          return;
        }
        gsap.to(preloaderElement, {
          yPercent: -100,
          duration: 1.2,
          ease: 'power4.inOut',
          onComplete: () => {
            preloaderElement.style.display = 'none';
            triggerHeroEntrance(); // Trigger main entrance animations
          }
        });
      });
    }
    if (counterElement) counterElement.textContent = `${count}%`;
    if (barElement) barElement.style.width = `${count}%`;
  }, 35);
});

// -------------------------------------------------------------
// 2. HERO ENTRANCE ANIMATIONS
// -------------------------------------------------------------
function triggerHeroEntrance() {
  // Desktop timeline (beautiful slow animations)
  const tl = gsap.timeline();
  
  tl.from('#home .inline-flex', {
    opacity: 0,
    y: -20,
    duration: 0.6,
    ease: 'power3.out'
  })
  .from('#home h1', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.4')
  .from('#home #typing-text', {
    opacity: 0,
    duration: 0.5
  }, '-=0.4')
  .from('#home p', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power3.out'
  }, '-=0.4')
  .from('#home .flex-wrap', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power3.out'
  }, '-=0.4')
  .from('#home .lg\\:col-span-5', {
    opacity: 0,
    scale: 0.9,
    rotate: 2,
    duration: 1,
    ease: 'back.out(1.2)'
  }, '-=0.6');

  // Trigger typing effect
  typeEffect();

  // Initialize other scroll animations
  initScrollAnimations();

  // Setup magnetic hover script
  setupMagneticButtons();

  // Initialize custom desktop cursor
  initCustomCursor();
}

// -------------------------------------------------------------
// 3. TYPING SUBTITLE EFFECT
// -------------------------------------------------------------
const words = [
  "Full Stack Web Applications",
  "Premium WordPress Sites",
  "High-Converting eCommerce Stores",
  "Custom Plugin Solutions"
];
let wordIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typingSpeed = 70;
const erasingSpeed = 40;
const delayBetweenWords = 2500;
const typingTextElement = document.getElementById('typing-text');
let isTypingPaused = false;

// Pause typing animation when offscreen to optimize layout CPU thread usage
if ('IntersectionObserver' in window) {
  const heroSection = document.getElementById('home');
  if (heroSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isTypingPaused = !entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    observer.observe(heroSection);
  }
}

function typeEffect() {
  if (!typingTextElement) return;

  if (isTypingPaused) {
    // Recheck visibility in 500ms
    setTimeout(typeEffect, 500);
    return;
  }

  const currentWord = words[wordIdx];
  if (isDeleting) {
    typingTextElement.textContent = currentWord.substring(0, charIdx - 1);
    charIdx--;
  } else {
    typingTextElement.textContent = currentWord.substring(0, charIdx + 1);
    charIdx++;
  }

  let speed = isDeleting ? erasingSpeed : typingSpeed;

  if (!isDeleting && charIdx === currentWord.length) {
    isDeleting = true;
    speed = delayBetweenWords; // Wait before starting deletion
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    wordIdx = (wordIdx + 1) % words.length; // Move to next word
    speed = 400; // Small delay before typing next word
  }

  setTimeout(typeEffect, speed);
}

// -------------------------------------------------------------
// 4. CUSTOM DESKTOP INTERACTIVE CURSOR
// -------------------------------------------------------------
const cursorDot = document.getElementById('custom-cursor-dot');
const cursorCircle = document.getElementById('custom-cursor-circle');

function initCustomCursor() {
  if (!gsap) return;
  if (window.matchMedia('(hover: hover) and (min-width: 1024px)').matches) {
    document.body.classList.add('custom-cursor-active');
    if (cursorDot) cursorDot.style.opacity = '1';
    if (cursorCircle) cursorCircle.style.opacity = '1';

    // Smooth trail quick setter using GSAP
    const setDotX = gsap.quickTo(cursorDot, "x", { duration: 0.1, ease: "power3" });
    const setDotY = gsap.quickTo(cursorDot, "y", { duration: 0.1, ease: "power3" });
    const setCircleX = gsap.quickTo(cursorCircle, "x", { duration: 0.35, ease: "power3" });
    const setCircleY = gsap.quickTo(cursorCircle, "y", { duration: 0.35, ease: "power3" });

    window.addEventListener('mousemove', (e) => {
      setDotX(e.clientX - 4);
      setDotY(e.clientY - 4);
      setCircleX(e.clientX - 16);
      setCircleY(e.clientY - 16);
    });

    // Cursor expansion states on hover of interactive nodes
    const interactives = document.querySelectorAll('a, button, .project-filter-btn, .project-details-btn, input, textarea');
    interactives.forEach(element => {
      element.addEventListener('mouseenter', () => {
        gsap.to(cursorCircle, {
          scale: 1.6,
          borderColor: '#a855f7',
          backgroundColor: 'rgba(168, 85, 247, 0.08)',
          duration: 0.2
        });
        gsap.to(cursorDot, {
          scale: 0.5,
          backgroundColor: '#60a5fa',
          duration: 0.2
        });
      });
      element.addEventListener('mouseleave', () => {
        gsap.to(cursorCircle, {
          scale: 1,
          borderColor: '#60a5fa',
          backgroundColor: 'transparent',
          duration: 0.2
        });
        gsap.to(cursorDot, {
          scale: 1,
          backgroundColor: '#a855f7',
          duration: 0.2
        });
      });
    });
  }
}


// -------------------------------------------------------------
// 5. NAVBAR STICKY EFFECT & NAV ACTIVE HIGHLIGHTING
// -------------------------------------------------------------
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('bg-[#080710]/80', 'backdrop-blur-md', 'border-b', 'border-white/5', 'shadow-2xl', 'py-4');
      navbar.classList.remove('py-6');
    } else {
      navbar.classList.remove('bg-[#080710]/80', 'backdrop-blur-md', 'border-b', 'border-white/5', 'shadow-2xl', 'py-4');
      navbar.classList.add('py-6');
    }
  }
});

// Navigation links auto-active highlighting on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let currentSec = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    // Highlight when section takes up the middle of the viewport
    if (window.scrollY >= sectionTop - 250) {
      currentSec = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active-nav');
    if (link.getAttribute('href').slice(1) === currentSec) {
      link.classList.add('active-nav');
    }
  });
});

// -------------------------------------------------------------
// 6. MOBILE NAVIGATION OVERLAY
// -------------------------------------------------------------
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const hamLine1 = document.getElementById('hamburger-line1');
const hamLine2 = document.getElementById('hamburger-line2');
const hamLine3 = document.getElementById('hamburger-line3');
let isMenuOpen = false;

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
      mobileMenu.classList.remove('translate-x-full', 'invisible');
      mobileMenu.classList.add('visible');
      menuBtn.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
      hamLine1.classList.add('rotate-45', 'translate-y-2');
      hamLine2.classList.add('opacity-0');
      hamLine3.classList.add('-rotate-45', '-translate-y-2');
      document.body.classList.add('overflow-hidden');
    } else {
      mobileMenu.classList.add('translate-x-full', 'invisible');
      mobileMenu.classList.remove('visible');
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      hamLine1.classList.remove('rotate-45', 'translate-y-2');
      hamLine2.classList.remove('opacity-0');
      hamLine3.classList.remove('-rotate-45', '-translate-y-2');
      document.body.classList.remove('overflow-hidden');
    }
  });

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      isMenuOpen = false;
      mobileMenu.classList.add('translate-x-full', 'invisible');
      mobileMenu.classList.remove('visible');
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      hamLine1.classList.remove('rotate-45', 'translate-y-2');
      hamLine2.classList.remove('opacity-0');
      hamLine3.classList.remove('-rotate-45', '-translate-y-2');
      document.body.classList.remove('overflow-hidden');
    });
  });
}

// -------------------------------------------------------------
// 7. MAGNETIC CTA BUTTON INTERACTIONS
// -------------------------------------------------------------
function setupMagneticButtons() {
  if (window.matchMedia('(hover: hover) and (min-width: 1024px)').matches) {
    document.querySelectorAll('.magnetic-btn').forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Pull button 25% of cursor offset distance
        gsap.to(button, {
          x: x * 0.25,
          y: y * 0.25,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      button.addEventListener('mouseleave', () => {
        // Snap back to base position with elastic bounce
        gsap.to(button, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)'
        });
      });
    });
  }
}

// -------------------------------------------------------------
// 8. SCROLL TRIGGER ANIMATIONS & STATISTICS COUNTERS
// -------------------------------------------------------------
function initScrollAnimations() {
  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    // Instantly set counter values to target values on mobile for performance
    const counters = document.querySelectorAll('.counter-value');
    counters.forEach(counter => {
      const target = counter.getAttribute('data-target');
      if (target) counter.textContent = target;
    });
    return;
  }

  // 1. About section fade-in
  gsap.from('#about .lg\\:col-span-7, #about .lg\\:col-span-5', {
    scrollTrigger: {
      trigger: '#about',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 50,
    duration: 0.9,
    stagger: 0.2,
    ease: 'power3.out'
  });

  // 2. Statistics Counter increments
  const counters = document.querySelectorAll('.counter-value');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      onEnter: () => {
        let current = 0;
        const duration = 1200; // ms
        const frames = 60;
        const step = target / frames;
        const stepTime = duration / frames;

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current);
          }
        }, stepTime);
      },
      once: true
    });
  });

  // 3. Skills Cards animations
  gsap.from('.skill-card', {
    scrollTrigger: {
      trigger: '#skills',
      start: 'top 80%'
    },
    opacity: 0,
    y: 40,
    scale: 0.95,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power2.out'
  });

  // 4. Services cards animation
  gsap.from('.service-card', {
    scrollTrigger: {
      trigger: '#services',
      start: 'top 80%'
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.08,
    ease: 'power3.out'
  });

  // 5. Project Cards entrance
  gsap.from('.project-card', {
    scrollTrigger: {
      trigger: '#projects',
      start: 'top 80%'
    },
    opacity: 0,
    y: 55,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out'
  });
}



// -------------------------------------------------------------
// 9. DYNAMIC PROJECTS SLIDER LOGIC (Puma-style)
// -------------------------------------------------------------
// -------------------------------------------------------------
// 9. DYNAMIC PROJECTS SLIDER LOGIC (Puma-style)
// -------------------------------------------------------------
const projectSlides = document.querySelectorAll('.slide-item');
const indicatorBtns = document.querySelectorAll('.slider-indicator-btn');
const prevProjectBtn = document.getElementById('prev-project-btn');
const nextProjectBtn = document.getElementById('next-project-btn');
const projectsSection = document.querySelector('.projects-section-container');
let currentProjectSlideIdx = 0;
let isProjectAnimating = false;

function goToProjectSlide(nextIdx) {
  if (isProjectAnimating || nextIdx === currentProjectSlideIdx) return;
  isProjectAnimating = true;

  const currentSlide = projectSlides[currentProjectSlideIdx];
  const nextSlide = projectSlides[nextIdx];
  const nextBgColor = nextSlide.getAttribute('data-bg');

  // Update section background color
  if (projectsSection && nextBgColor) {
    projectsSection.style.backgroundColor = nextBgColor;
  }

  // Update indicators
  indicatorBtns.forEach((btn, idx) => {
    if (idx === nextIdx) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  // Prepare next slide position before animating
  nextSlide.classList.add('active');
  
  if (gsap) {
    const tl = gsap.timeline({
      onComplete: () => {
        currentSlide.classList.remove('active');
        currentProjectSlideIdx = nextIdx;
        isProjectAnimating = false;
        if (ScrollTrigger) ScrollTrigger.refresh();
      }
    });

    // Determine slide direction
    const isNext = nextIdx > currentProjectSlideIdx;
    const slideDirectionMultiplier = isNext ? 1 : -1;
    // Slide out current slide details
    tl.to(currentSlide.querySelector('.slide-details-left'), {
      x: -100 * slideDirectionMultiplier,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in'
    }, 0)
    .to(currentSlide.querySelector('.browser-mockup-frame'), {
      scale: 0.8,
      rotationY: 45 * slideDirectionMultiplier,
      rotationX: -15,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in'
    }, 0)
    .to(currentSlide.querySelector('.slide-details-right'), {
      x: 100 * slideDirectionMultiplier,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in'
    }, 0)
    .to(currentSlide.querySelector('.giant-bg-text'), {
      opacity: 0,
      y: -50,
      duration: 0.4,
      ease: 'power2.in'
    }, 0);

    // Slide in next slide details
    tl.fromTo(nextSlide.querySelector('.slide-details-left'), {
      x: 100 * slideDirectionMultiplier,
      opacity: 0
    }, {
      x: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power3.out'
    }, 0.3)
    .fromTo(nextSlide.querySelector('.browser-mockup-frame'), {
      scale: 0.5,
      rotationY: -45 * slideDirectionMultiplier,
      rotationX: 15,
      opacity: 0
    }, {
      scale: 1,
      rotationY: -15,
      rotationX: 8,
      rotationZ: -3,
      opacity: 1,
      duration: 0.85,
      ease: 'back.out(1.1)'
    }, 0.15)
    .fromTo(nextSlide.querySelector('.slide-details-right'), {
      x: -100 * slideDirectionMultiplier,
      opacity: 0
    }, {
      x: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power3.out'
    }, 0.3)
    .fromTo(nextSlide.querySelector('.giant-bg-text'), {
      opacity: 0,
      y: 50
    }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, 0.2);
  } else {
    // Fallback if GSAP is not available
    currentSlide.classList.remove('active');
    nextSlide.classList.add('active');
    currentProjectSlideIdx = nextIdx;
    isProjectAnimating = false;
  }
}

if (prevProjectBtn && nextProjectBtn) {
  prevProjectBtn.addEventListener('click', () => {
    let nextIdx = currentProjectSlideIdx - 1;
    if (nextIdx < 0) nextIdx = projectSlides.length - 1;
    goToProjectSlide(nextIdx);
  });

  nextProjectBtn.addEventListener('click', () => {
    let nextIdx = (currentProjectSlideIdx + 1) % projectSlides.length;
    goToProjectSlide(nextIdx);
  });

  indicatorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetIdx = parseInt(btn.getAttribute('data-slide'), 10);
      goToProjectSlide(targetIdx);
    });
  });
}


// -------------------------------------------------------------
// 10. PROJECT DETAILED MODAL DATA & ACTION POPUPS
// -------------------------------------------------------------
const projectDetailsData = {
  project1: {
    title: "Hospital Management Website",
    category: "Custom Web Development",
    image: "/assets/project1.jpg",
    description: "A secure, enterprise-grade portal custom-tailored for hospital administrators and patient intake teams. The application simplifies scheduling workflows, manages patient intake records safely under strict privacy parameters, and tracks telemetry across patient bed inventories in real-time.",
    features: [
      "Secure role-based dashboard control (Patients, Physicians, and Super Administrators).",
      "Dynamic calendar booking system utilizing ajax checks on doctor shifts.",
      "Custom billing ledger and receipt generator exporting directly to optimized PDF logs.",
      "Live stats dashboard illustrating clinic bottlenecks, daily visits, and triage rates.",
      "Fully mobile-responsive workspace for physicians reviewing details on tablets."
    ],
    technologies: ["PHP", "MySQL", "Tailwind CSS", "JavaScript (ES6)", "GSAP ScrollTrigger"],
    demoLink: "#"
  },
  project2: {
    title: "Leather eCommerce Store",
    category: "WordPress & WooCommerce",
    image: "/assets/project2.jpg",
    description: "A luxury retail store designed to capture premium conversion metrics. Focused heavily on rich texture visibility, smooth zoom effects, customizable item variants, and lightning-fast checkout experiences.",
    features: [
      "Custom WordPress loop modules built from scratch for product catalogs.",
      "Complex taxonomy filter navigation enabling instant dynamic narrowing.",
      "Tailored leather sizing calculator reducing item returns by 30%.",
      "Integrated Stripe and Apple Pay transactions with secure webhook routing.",
      "Optimized load times achieving Grade A performance scores on GTmetrix."
    ],
    technologies: ["WordPress", "WooCommerce", "Elementor Pro", "Custom CSS Variables", "Stripe API"],
    demoLink: "#"
  },
  project3: {
    title: "Business Portfolio Website",
    category: "WordPress Development",
    image: "/assets/project3.jpg",
    description: "A cutting-edge modern portfolio site crafted for an architectural and design consulting agency. Employs large structural imagery, smooth horizontal scrolls, and visual triggers that present the company's projects elegantly.",
    features: [
      "Advanced parallax scroll effects and SVG outline drawings synced to timeline scrolls.",
      "Custom taxonomy filters representing project phases (Draft, Build, Finished).",
      "Dynamic Hubspot CRM syncing mapping intake form details directly into agent pipelines.",
      "Custom responsive media serving serving webp frames based on client screen density.",
      "Premium dark/light toggles with smooth transition themes."
    ],
    technologies: ["WordPress", "Elementor Pro", "Lottie Animations", "ScrollTrigger", "Hubspot API"],
    demoLink: "#"
  },
  project4: {
    title: "Custom WordPress Management System",
    category: "Full Stack Development",
    image: "/assets/project4.jpg",
    description: "An advanced bulk management web dashboard enabling development agencies to keep tabs on hundreds of independent client WordPress installations. It automates updates, backups, security tracking, and performance checkups from a single central viewport.",
    features: [
      "Bulk update trigger sending remote REST requests to install themes/plugins.",
      "Automated server uptime diagnostics checking server statuses every 60 seconds.",
      "Database snapshot compiler automatically archiving logs into AWS S3 buckets.",
      "Uptime status tracking providing instant notifications to slack webhooks.",
      "Modern dark theme user interface constructed on a lightweight, reactive frontend structure."
    ],
    technologies: ["PHP (Laravel)", "Vue.js", "WordPress REST API", "AWS S3 SDK", "Tailwind CSS"],
    demoLink: "#"
  }
};

let lastActiveElement = null;
const modal = document.getElementById('project-modal');
const modalContainer = document.getElementById('project-modal-container');
const modalContent = document.getElementById('modal-content');

document.querySelectorAll('.project-details-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const prjKey = btn.getAttribute('data-project');
    const data = projectDetailsData[prjKey];
    if (!data) return;

    lastActiveElement = document.activeElement;

    modalContent.innerHTML = `
      <div class="relative rounded-2xl overflow-hidden aspect-video border border-white/10 mb-6 bg-slate-900">
        <img src="${data.image}" alt="${data.title}" decoding="async" class="w-full h-full object-cover">
      </div>
      <div class="space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span class="text-xs uppercase tracking-widest text-purple-400 font-bold font-mono">${data.category}</span>
            <h3 id="modal-title" class="text-3xl sm:text-4xl font-extrabold text-white mt-1">${data.title}</h3>
          </div>
          <a href="${data.demoLink}" aria-label="Launch live demo of ${data.title}" class="magnetic-btn px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold text-sm shadow-[0_4px_15px_rgba(147,51,234,0.3)] transition-all">
            Launch Live Demo <i class="fas fa-external-link-alt ml-2 text-xs" aria-hidden="true"></i>
          </a>
        </div>
        
        <p class="text-slate-300 text-base leading-relaxed pt-2">${data.description}</p>
        
        <div class="pt-4 space-y-3">
          <h4 class="text-lg font-bold text-white">Core Project Features</h4>
          <ul class="space-y-2 text-sm text-slate-400">
            ${data.features.map(feat => `
              <li class="flex items-start">
                <i class="fas fa-check text-purple-500 mt-1 mr-3 text-xs" aria-hidden="true"></i>
                <span>${feat}</span>
              </li>
            `).join('')}
          </ul>
        </div>
        
        <div class="pt-6">
          <h4 class="text-sm uppercase tracking-widest text-slate-400 font-bold font-mono mb-3">Technologies Employed</h4>
          <div class="flex flex-wrap gap-2">
            ${data.technologies.map(tech => `
              <span class="bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300">${tech}</span>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Open Modal Visuals
    if (modal && modalContainer) {
      document.body.classList.add('modal-open');
      modal.classList.remove('pointer-events-none', 'invisible', 'opacity-0');
      modal.classList.add('visible', 'opacity-100');
      modalContainer.classList.remove('translate-y-10');
      modalContainer.classList.add('translate-y-0');
      
      // Focus the close button for accessibility
      setTimeout(() => {
        const closeBtn = document.getElementById('modal-close-btn');
        if (closeBtn) closeBtn.focus();
      }, 100);
    }
  });
});

function closeModal() {
  if (modal && modalContainer) {
    document.body.classList.remove('modal-open');
    modal.classList.add('opacity-0');
    modalContainer.classList.remove('translate-y-0');
    modalContainer.classList.add('translate-y-10');
    
    setTimeout(() => {
      modal.classList.add('pointer-events-none', 'invisible');
      modal.classList.remove('visible', 'opacity-100');
      if (lastActiveElement) {
        lastActiveElement.focus();
        lastActiveElement = null;
      }
    }, 300);
  }
}

const modalCloseBtn = document.getElementById('modal-close-btn');
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

// Close modal on Escape key press
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// -------------------------------------------------------------
// 11. TESTIMONIALS SLIDER
// -------------------------------------------------------------
let currentSlide = 0;
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('#testimonial-dots button');
const nextBtn = document.getElementById('next-testimonial-btn');
const prevBtn = document.getElementById('prev-testimonial-btn');

function showSlide(index) {
  if (slides.length === 0) return;

  slides.forEach((slide, i) => {
    if (i === index) {
      slide.classList.remove('opacity-0', 'pointer-events-none');
      slide.classList.add('active-slide', 'opacity-100', 'pointer-events-auto');
    } else {
      slide.classList.add('opacity-0', 'pointer-events-none');
      slide.classList.remove('active-slide', 'opacity-100', 'pointer-events-auto');
    }
  });

  dots.forEach((dot, i) => {
    const span = dot.querySelector('span');
    if (!span) return;
    if (i === index) {
      span.classList.remove('bg-white/20');
      span.classList.add('bg-purple-500');
    } else {
      span.classList.remove('bg-purple-500');
      span.classList.add('bg-white/20', 'hover:bg-white/40');
    }
  });

  currentSlide = index;
}

// Initial Call
showSlide(0);

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    const nextIdx = (currentSlide + 1) % slides.length;
    showSlide(nextIdx);
  });
}

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    const prevIdx = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prevIdx);
  });
}

dots.forEach((dot, idx) => {
  dot.addEventListener('click', () => showSlide(idx));
});

// Autoplay slide rotation
let autoplayTimer = setInterval(() => {
  const nextIdx = (currentSlide + 1) % slides.length;
  showSlide(nextIdx);
}, 7000);

// Reset autoplay timer on user click
const resetAutoplay = () => {
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(() => {
    const nextIdx = (currentSlide + 1) % slides.length;
    showSlide(nextIdx);
  }, 9000);
};

if (nextBtn) nextBtn.addEventListener('click', resetAutoplay);
if (prevBtn) prevBtn.addEventListener('click', resetAutoplay);
dots.forEach(dot => dot.addEventListener('click', resetAutoplay));

// -------------------------------------------------------------
// 12. CONTACT FORM VALIDATION & POPUP HANDLERS
// -------------------------------------------------------------
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const formSubmitBtn = document.getElementById('submit-btn');

if (contactForm && formStatus && formSubmitBtn) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !subject || !message) {
      formStatus.className = "mt-4 p-4 rounded-xl text-center text-sm font-semibold bg-red-500/20 text-red-300 border border-red-500/30";
      formStatus.textContent = "Please fill in all requested fields.";
      formStatus.classList.remove('hidden');
      return;
    }

    // Lock Submit buttons and trigger loader animation
    formSubmitBtn.disabled = true;
    const btnTextElement = formSubmitBtn.querySelector('span');
    const originalText = btnTextElement.innerHTML;
    btnTextElement.innerHTML = `Sending Message... <i class="fas fa-spinner animate-spin ml-2"></i>`;

    // Simulate standard server latency
    setTimeout(() => {
      formSubmitBtn.disabled = false;
      btnTextElement.innerHTML = originalText;

      formStatus.className = "mt-4 p-4 rounded-xl text-center text-sm font-semibold bg-green-500/20 text-green-300 border border-green-500/30";
      formStatus.textContent = "Success! Your inquiry has been sent to Ansaar. He will get back to you shortly.";
      formStatus.classList.remove('hidden');
      
      contactForm.reset();

      // Fade out success banner
      setTimeout(() => {
        if (gsap) {
          gsap.to(formStatus, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              formStatus.classList.add('hidden');
              formStatus.style.opacity = '1';
            }
          });
        } else {
          formStatus.classList.add('transition-opacity', 'duration-500', 'opacity-0');
          setTimeout(() => {
            formStatus.classList.add('hidden');
            formStatus.classList.remove('transition-opacity', 'duration-500', 'opacity-0');
          }, 500);
        }
      }, 6000);

    }, 1200);
  });
}

// -------------------------------------------------------------
// 13. SCROLL-TO-TOP BUTTON TELEPORTATION
// -------------------------------------------------------------
const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
if (scrollToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4', 'invisible');
      scrollToTopBtn.classList.add('opacity-100', 'translate-y-0', 'visible');
    } else {
      scrollToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4', 'invisible');
      scrollToTopBtn.classList.remove('opacity-100', 'translate-y-0', 'visible');
    }
  });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// -------------------------------------------------------------
// 14. AI CHATBOT WIDGET LOGIC
// -------------------------------------------------------------
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotPanel = document.getElementById('chatbot-panel');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSend = document.getElementById('chatbot-send');
const chatbotIconOpen = document.getElementById('chatbot-icon-open');
const chatbotIconClose = document.getElementById('chatbot-icon-close');

let chatHistory = [];

const SYSTEM_PROMPT = `
You are Ansaar Bhatti's virtual AI assistant. Your goal is to represent him professionally and answer client queries about him in a helpful, conversational manner.
Respond in the language the user speaks (e.g., Urdu, English, Hindi, German, etc.). Keep answers concise and polite.

Here is the exact information about Ansaar Bhatti:
- Name: Ansaar Bhatti
- Title: Full Stack Web Developer & WordPress Expert
- Experience: 3+ Years of professional experience in crafting high-speed, secure, and responsive web solutions.
- Completed Projects: 150+ successfully completed projects.
- Happy Clients: 99% satisfaction rate.
- Support: 24/7 availability for clients.
- Primary Skills:
  * WordPress Custom Theme & Plugin Development (98% proficiency)
  * Elementor Pro & Page Builders (96% proficiency)
  * HTML5 Semantic Architecture (95% proficiency)
  * Website Server Management (Linux, cPanel, SSH, Security) (94% proficiency)
  * CSS3 & Tailwind CSS Styling (92% proficiency)
  * JavaScript ES6+ & GSAP Animations (88% proficiency)
  * PHP Development (85% proficiency)
  * MySQL Database Design (82% proficiency)
- Services Offered:
  * WordPress Development (Custom themes, hooks, plugins)
  * eCommerce Stores (WooCommerce, stripe, checkout filters)
  * Business & Corporate Websites (visual portfolios, fast landing)
  * Landing Pages (High-converting, optimized page speed)
  * Website Maintenance (Database optimization, security patches, backups)
  * Custom Web Solutions (custom dashboards, CRM sync, booking APIs)
- Recent Highlight Projects:
  * Hospital Management Website (PHP, MySQL, Tailwind, GSAP) - Features booking, patient histories, invoicing.
  * Leather eCommerce Store (WooCommerce, Elementor Pro, Stripe) - Features product attributes, sizing calculators.
  * Business Portfolio Website (WordPress, Elementor Pro, Lottie) - Features landing flows, 98+ PageSpeed.
  * Custom WordPress Management System (PHP/Laravel, WP API, Vue.js, Tailwind) - Centralized database backup, resource telemetry.
- Contact Details:
  * Email: ansaar.bhatti100@gmail.com
  * WhatsApp: +923401350380 (Direct WhatsApp link: https://wa.me/923401350380)
  * CV / Resume download is available on the website at "/assets/cv.pdf"
  * Clients can hire him directly using the "Hire Me" buttons on the page.

Important guidelines:
- If a client asks for contact information, always provide the WhatsApp link and Email.
- If asked about projects, briefly explain the ones listed above.
- If asked about anything outside this context (e.g., general knowledge, personal questions unrelated to work), politely state: "I am Ansaar's AI assistant, so I only answer questions related to his portfolio. For other queries or specific project discussions, you can reach out to him directly on WhatsApp: https://wa.me/923401350380"
- Always speak in a friendly, conversational tone.
`;

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

if (chatbotToggle && chatbotPanel) {
  chatbotToggle.addEventListener('click', toggleChatbot);
  chatbotClose.addEventListener('click', toggleChatbot);

  function toggleChatbot() {
    const isActive = chatbotPanel.classList.contains('active');
    if (isActive) {
      chatbotPanel.classList.remove('active');
      chatbotIconOpen.classList.remove('hidden');
      chatbotIconClose.classList.add('hidden');
      setTimeout(() => chatbotPanel.classList.add('hidden'), 300);
    } else {
      chatbotPanel.classList.remove('hidden');
      setTimeout(() => {
        chatbotPanel.classList.add('active');
        chatbotIconOpen.classList.add('hidden');
        chatbotIconClose.classList.remove('hidden');
        chatbotInput.focus();
      }, 50);
    }
  }

  chatbotSend.addEventListener('click', handleSendMessage);
  chatbotInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSendMessage();
  });

  async function handleSendMessage() {
    const text = chatbotInput.value.trim();
    if (!text) return;

    // Render User Message
    appendMessage(text, 'user');
    chatbotInput.value = '';

    // Render Loading Indicator
    const loaderId = appendMessage('AI is typing...', 'bot', true);

    // Call Gemini API
    const reply = await callGeminiAPI(text);

    // Remove Loading Indicator and Render Reply
    removeLoader(loaderId);
    appendMessage(reply, 'bot');
  }

  function appendMessage(text, sender, isLoader = false) {
    const msgDiv = document.createElement('div');
    const msgId = 'msg-' + Date.now();
    msgDiv.id = msgId;

    if (sender === 'user') {
      msgDiv.className = 'flex items-start justify-end space-x-2.5';
      msgDiv.innerHTML = `
        <div class="user-msg text-white text-sm p-3 rounded-2xl rounded-tr-none max-w-[80%] shadow-md whitespace-pre-wrap">
          ${escapeHTML(text)}
        </div>
      `;
    } else {
      msgDiv.className = 'flex items-start space-x-2.5';
      msgDiv.innerHTML = `
        <div class="w-7 h-7 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xs font-bold flex-shrink-0">AI</div>
        <div class="${isLoader ? 'animate-pulse text-slate-400' : 'bot-msg text-slate-200'} text-sm p-3 rounded-2xl rounded-tl-none max-w-[80%] shadow-md whitespace-pre-wrap">
          ${isLoader ? text : formatMarkdown(text)}
        </div>
      `;
    }

    chatbotMessages.appendChild(msgDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return msgId;
  }

  function removeLoader(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  async function callGeminiAPI(userQuery) {
    chatHistory.push({
      role: 'user',
      parts: [{ text: userQuery }]
    });

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: chatHistory
        })
      });

      const data = await response.json();

      if (data.error) {
        console.error("Gemini API Error:", data.error);
        chatHistory.pop(); // Remove the last message from history if it failed
        return "I'm sorry, I'm experiencing connection issues. Please try again later or reach out to Ansaar on WhatsApp: https://wa.me/923401350380";
      }

      const replyText = data.candidates[0].content.parts[0].text;
      
      chatHistory.push({
        role: 'model',
        parts: [{ text: replyText }]
      });

      return replyText;
    } catch (error) {
      console.error("Fetch error:", error);
      chatHistory.pop();
      return "Unable to connect. Please message Ansaar on WhatsApp: https://wa.me/923401350380";
    }
  }

  function escapeHTML(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatMarkdown(text) {
    // Simple bolding and link formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:underline">$1</a>');
  }
}

