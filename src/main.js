import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initParticles } from './particles.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Interactive Particles Canvas
let cleanupParticles = null;
try {
  cleanupParticles = initParticles();
} catch (e) {
  console.error("Failed to initialize particles background:", e);
}

// -------------------------------------------------------------
// 1. PRELOADER & COUNTER INITIALIZATION
// -------------------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
  let count = 0;
  const counterElement = document.getElementById('preloader-counter');
  const barElement = document.getElementById('preloader-bar');
  const preloaderElement = document.getElementById('preloader');

  // Fast fake-loading sequence
  const interval = setInterval(() => {
    count += Math.floor(Math.random() * 8) + 4; // Increment randomly
    if (count >= 100) {
      count = 100;
      clearInterval(interval);

      // Slide-up preloader once loading reaches 100%
      gsap.to(preloaderElement, {
        yPercent: -100,
        duration: 1.2,
        ease: 'power4.inOut',
        onComplete: () => {
          preloaderElement.style.display = 'none';
          triggerHeroEntrance(); // Trigger main entrance animations
        }
      });
    }
    if (counterElement) counterElement.textContent = `${count}%`;
    if (barElement) barElement.style.width = `${count}%`;
  }, 45);
});

// -------------------------------------------------------------
// 2. HERO ENTRANCE ANIMATIONS
// -------------------------------------------------------------
function triggerHeroEntrance() {
  // Animate Hero tags, headings, typing text, and buttons
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

function typeEffect() {
  if (!typingTextElement) return;

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
      mobileMenu.classList.remove('translate-x-full');
      hamLine1.classList.add('rotate-45', 'translate-y-2');
      hamLine2.classList.add('opacity-0');
      hamLine3.classList.add('-rotate-45', '-translate-y-2');
      document.body.classList.add('overflow-hidden');
    } else {
      mobileMenu.classList.add('translate-x-full');
      hamLine1.classList.remove('rotate-45', 'translate-y-2');
      hamLine2.classList.remove('opacity-0');
      hamLine3.classList.remove('-rotate-45', '-translate-y-2');
      document.body.classList.remove('overflow-hidden');
    }
  });

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      isMenuOpen = false;
      mobileMenu.classList.add('translate-x-full');
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

// -------------------------------------------------------------
// 8. SCROLL TRIGGER ANIMATIONS & STATISTICS COUNTERS
// -------------------------------------------------------------
function initScrollAnimations() {
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
// 9. PROJECT FILTERING LOGIC
// -------------------------------------------------------------
const filterButtons = document.querySelectorAll('.project-filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Reset active button class styles
    filterButtons.forEach(b => {
      b.classList.remove('bg-purple-500', 'text-white', 'border-purple-500');
      b.classList.add('bg-white/5', 'text-slate-300', 'border-white/10');
    });

    // Make clicked button primary style
    btn.classList.add('bg-purple-500', 'text-white', 'border-purple-500');
    btn.classList.remove('bg-white/5', 'text-slate-300', 'border-white/10');

    const filterVal = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      if (filterVal === 'all' || cardCategory === filterVal) {
        card.style.display = 'flex';
        gsap.fromTo(card, {
          scale: 0.92,
          opacity: 0
        }, {
          scale: 1,
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out'
        });
      } else {
        card.style.display = 'none';
      }
    });

    // Refresh ScrollTrigger calculations
    ScrollTrigger.refresh();
  });
});

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

const modal = document.getElementById('project-modal');
const modalContainer = document.getElementById('project-modal-container');
const modalContent = document.getElementById('modal-content');

document.querySelectorAll('.project-details-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const prjKey = btn.getAttribute('data-project');
    const data = projectDetailsData[prjKey];
    if (!data) return;

    modalContent.innerHTML = `
      <div class="relative rounded-2xl overflow-hidden aspect-video border border-white/10 mb-6 bg-slate-900">
        <img src="${data.image}" alt="${data.title}" class="w-full h-full object-cover">
      </div>
      <div class="space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span class="text-xs uppercase tracking-widest text-purple-400 font-bold font-mono">${data.category}</span>
            <h3 class="text-3xl sm:text-4xl font-extrabold text-white mt-1">${data.title}</h3>
          </div>
          <a href="${data.demoLink}" class="magnetic-btn px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold text-sm shadow-[0_4px_15px_rgba(147,51,234,0.3)] transition-all">
            Launch Live Demo <i class="fas fa-external-link-alt ml-2 text-xs"></i>
          </a>
        </div>
        
        <p class="text-slate-300 text-base leading-relaxed pt-2">${data.description}</p>
        
        <div class="pt-4 space-y-3">
          <h4 class="text-lg font-bold text-white">Core Project Features</h4>
          <ul class="space-y-2 text-sm text-slate-400">
            ${data.features.map(feat => `
              <li class="flex items-start">
                <i class="fas fa-check text-purple-500 mt-1 mr-3 text-xs"></i>
                <span>${feat}</span>
              </li>
            `).join('')}
          </ul>
        </div>
        
        <div class="pt-6">
          <h4 class="text-sm uppercase tracking-widest text-slate-500 font-bold font-mono mb-3">Technologies Employed</h4>
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
      modal.classList.remove('pointer-events-none');
      gsap.to(modal, { opacity: 1, duration: 0.3 });
      gsap.to(modalContainer, { y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.2)' });
    }
  });
});

function closeModal() {
  if (modal && modalContainer) {
    document.body.classList.remove('modal-open');
    gsap.to(modal, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        modal.classList.add('pointer-events-none');
      }
    });
    gsap.to(modalContainer, {
      y: 50,
      scale: 0.95,
      duration: 0.3
    });
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
    gsap.killTweensOf(slide);
    if (i === index) {
      slide.classList.remove('pointer-events-none');
      gsap.fromTo(slide, 
        { x: 35, opacity: 0, display: 'flex' }, 
        { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    } else {
      slide.classList.add('pointer-events-none');
      gsap.to(slide, { 
        opacity: 0, 
        x: -35, 
        duration: 0.35, 
        onComplete: () => {
          gsap.set(slide, { display: 'none' });
        }
      });
    }
  });

  dots.forEach((dot, i) => {
    if (i === index) {
      dot.classList.remove('bg-white/20');
      dot.classList.add('bg-purple-500');
    } else {
      dot.classList.remove('bg-purple-500');
      dot.classList.add('bg-white/20', 'hover:bg-white/40');
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
        gsap.to(formStatus, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            formStatus.classList.add('hidden');
            formStatus.style.opacity = '1';
          }
        });
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
      scrollToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
      scrollToTopBtn.classList.add('opacity-100', 'translate-y-0');
    } else {
      scrollToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
      scrollToTopBtn.classList.remove('opacity-100', 'translate-y-0');
    }
  });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
