/**
 * Modern Micro-Interactions & UI Features
 * - 3D Card Tilt with Cursor Spotlight
 * - Typing Effect
 * - Counters
 * - Project Modal
 * - Testimonial Slider
 * - AI Assistant Simulation
 */

export function initInteractions() {
  // 1. Mouse Spotlight & 3D Tilt for Cards
  const cards = document.querySelectorAll('.spotlight-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // 3D Tilt
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // 2. Typing Animation
  const typingElement = document.getElementById('typing-text');
  if (typingElement) {
    const words = [
      'WordPress Systems',
      'Full Stack Applications',
      'High-Speed Solutions',
      'Custom Web Platforms'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
      } else {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end of word
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500; // Pause before typing new word
      }

      setTimeout(type, typeSpeed);
    }

    type();
  }

  // 3. Stats Counter Animation on Scroll
  const counters = document.querySelectorAll('.counter-value');
  let animated = false;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 1500;
          const step = Math.max(1, Math.floor(target / (duration / 16)));
          let count = 0;

          const timer = setInterval(() => {
            count += step;
            if (count >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = count;
            }
          }, 16);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('about');
  if (statsSection) countObserver.observe(statsSection);

  // 4. Testimonials Slider
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('#testimonial-dots button');
  const prevBtn = document.getElementById('prev-testimonial-btn');
  const nextBtn = document.getElementById('next-testimonial-btn');
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add('opacity-100', 'translate-x-0', 'pointer-events-auto');
        slide.classList.remove('opacity-0', 'pointer-events-none', '-translate-x-4', 'translate-x-4');
      } else {
        slide.classList.remove('opacity-100', 'translate-x-0', 'pointer-events-auto');
        slide.classList.add('opacity-0', 'pointer-events-none');
      }
    });

    dots.forEach((dot, i) => {
      const dotInner = dot.querySelector('span');
      if (dotInner) {
        if (i === index) {
          dotInner.className = 'w-6 h-2 rounded-full bg-purple-500 transition-all duration-300';
        } else {
          dotInner.className = 'w-2 h-2 rounded-full bg-white/20 hover:bg-white/40 transition-all duration-300';
        }
      }
    });
    currentSlide = index;
  }

  if (slides.length > 0) {
    showSlide(0);

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        let next = (currentSlide + 1) % slides.length;
        showSlide(next);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        let prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => showSlide(i));
    });
  }

  // 5. Project Details Modal Data
  const projectDetails = {
    project1: {
      title: "Hospital Management",
      category: "Custom Web Application",
      value: "$500+ Est. Value",
      image: "/assets/project1.jpg",
      tags: ["PHP", "MySQL", "Tailwind CSS", "GSAP"],
      desc: "A secure web application featuring real-time doctor appointment bookings, patient histories, dynamic prescription databases, invoicing systems, and administrative telemetry portals.",
      liveUrl: "#"
    },
    project2: {
      title: "Leather eCommerce",
      category: "WordPress & WooCommerce",
      value: "$1,200+ Est. Value",
      image: "/assets/project2.jpg",
      tags: ["WordPress", "WooCommerce", "Elementor Pro", "Stripe"],
      desc: "Premium retail eCommerce store constructed on WooCommerce with highly customizable product attributes, sizing calculators, responsive category filter sidebars, and direct stripe processing.",
      liveUrl: "https://leathercraft-store.com"
    },
    project3: {
      title: "Business Portfolio",
      category: "WordPress Agency",
      value: "$800+ Est. Value",
      image: "/assets/project3.jpg",
      tags: ["WordPress", "Elementor Pro", "Lottie Animations", "SEO"],
      desc: "A sleek corporate agency website displaying advanced landing flows, dynamic project filtering widgets, custom lead analytics integration, and speed optimizations reaching 98+ PageSpeed.",
      liveUrl: "https://horizon-agency.com"
    },
    project4: {
      title: "Management System",
      category: "Custom Web Platform",
      value: "$1,500+ Est. Value",
      image: "/assets/project4.jpg",
      tags: ["PHP (Laravel)", "WP REST API", "Vue.js", "Tailwind"],
      desc: "An advanced multi-site administration dashboard allowing bulk core/plugin installations, centralized database backup, uptime tracking, and real-time site resource usage analytics.",
      liveUrl: "https://ansaar.dev/wp-manager"
    }
  };

  const modal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close-btn');

  document.querySelectorAll('.project-details-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const projId = btn.getAttribute('data-project');
      const data = projectDetails[projId];
      if (!data || !modal || !modalContent) return;

      modalContent.innerHTML = `
        <div class="rounded-2xl overflow-hidden border border-white/10 max-h-[350px]">
          <img src="${data.image}" alt="${data.title}" class="w-full h-full object-cover">
        </div>
        <div class="space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span class="text-xs uppercase font-mono text-purple-400 tracking-wider">${data.category}</span>
              <h3 class="text-2xl sm:text-3xl font-bold text-white font-display">${data.title}</h3>
            </div>
            <span class="px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono font-bold text-sm">${data.value}</span>
          </div>
          <p class="text-slate-300 text-sm sm:text-base leading-relaxed">${data.desc}</p>
          <div class="flex flex-wrap gap-2 pt-2">
            ${data.tags.map(t => `<span class="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs text-slate-300 font-mono">${t}</span>`).join('')}
          </div>
          <div class="pt-4 flex gap-4">
            <a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary text-sm py-2.5 px-6">
              <span>View Live Demo</span> <i class="fas fa-external-link-alt text-xs"></i>
            </a>
          </div>
        </div>
      `;

      modal.classList.remove('opacity-0', 'invisible', 'pointer-events-none');
      modal.classList.add('opacity-100', 'visible', 'pointer-events-auto');
    });
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.add('opacity-0', 'invisible', 'pointer-events-none');
      modal.classList.remove('opacity-100', 'visible', 'pointer-events-auto');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('opacity-0', 'invisible', 'pointer-events-none');
        modal.classList.remove('opacity-100', 'visible', 'pointer-events-auto');
      }
    });
  }

  // 6. AI Assistant Widget Simulation
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotPanel = document.getElementById('chatbot-panel');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatbotSend = document.getElementById('chatbot-send');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotMessages = document.getElementById('chatbot-messages');

  if (chatbotToggle && chatbotPanel) {
    chatbotToggle.addEventListener('click', () => {
      const isClosed = chatbotPanel.classList.contains('hidden');
      if (isClosed) {
        chatbotPanel.classList.remove('hidden');
        setTimeout(() => {
          chatbotPanel.classList.remove('scale-95', 'opacity-0');
          chatbotPanel.classList.add('scale-100', 'opacity-100');
        }, 10);
      } else {
        chatbotPanel.classList.add('scale-95', 'opacity-0');
        chatbotPanel.classList.remove('scale-100', 'opacity-100');
        setTimeout(() => chatbotPanel.classList.add('hidden'), 200);
      }
    });

    if (chatbotClose) {
      chatbotClose.addEventListener('click', () => {
        chatbotPanel.classList.add('scale-95', 'opacity-0');
        chatbotPanel.classList.remove('scale-100', 'opacity-100');
        setTimeout(() => chatbotPanel.classList.add('hidden'), 200);
      });
    }

    const handleSendMessage = () => {
      const text = chatbotInput.value.trim();
      if (!text) return;

      // Append User message
      const userMsg = document.createElement('div');
      userMsg.className = 'flex items-start justify-end space-x-2.5';
      userMsg.innerHTML = `
        <div class="bg-purple-600/30 border border-purple-500/40 text-slate-100 text-sm p-3 rounded-2xl rounded-tr-none max-w-[80%]">
          ${text}
        </div>
      `;
      chatbotMessages.appendChild(userMsg);
      chatbotInput.value = '';
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

      // Simulated Response
      setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'flex items-start space-x-2.5';
        botMsg.innerHTML = `
          <div class="w-7 h-7 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xs font-bold flex-shrink-0">AI</div>
          <div class="bg-white/5 border border-white/10 text-slate-200 text-sm p-3 rounded-2xl rounded-tl-none max-w-[80%]">
            Thanks for reaching out! You can contact Ansaar directly on WhatsApp at <strong>0340-1350380</strong> or email <strong>ansaar.bhatti100@gmail.com</strong>.
          </div>
        `;
        chatbotMessages.appendChild(botMsg);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
      }, 700);
    };

    if (chatbotSend) chatbotSend.addEventListener('click', handleSendMessage);
    if (chatbotInput) {
      chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
      });
    }
  }

  // 7. Scroll to Top
  const scrollTopBtn = document.getElementById('scroll-to-top-btn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn?.classList.remove('opacity-0', 'invisible', 'pointer-events-none', 'translate-y-4');
      scrollTopBtn?.classList.add('opacity-100', 'visible', 'pointer-events-auto', 'translate-y-0');
    } else {
      scrollTopBtn?.classList.add('opacity-0', 'invisible', 'pointer-events-none', 'translate-y-4');
      scrollTopBtn?.classList.remove('opacity-100', 'visible', 'pointer-events-auto', 'translate-y-0');
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 8. Mobile Navigation Drawer
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('translate-x-full');
      if (isOpen) {
        mobileMenu.classList.add('translate-x-full', 'invisible');
      } else {
        mobileMenu.classList.remove('translate-x-full', 'invisible');
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('translate-x-full', 'invisible');
      });
    });
  }
}
