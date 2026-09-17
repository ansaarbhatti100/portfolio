import { PORTFOLIO_DATA } from './portfolio-data.js';

export function initInteractions() {
  // 1. Theme Switcher (Dark / Light Mode)
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'dark';

  if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
    updateThemeIcon(true);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-theme');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      updateThemeIcon(isLight);
    });
  }

  function updateThemeIcon(isLight) {
    if (!themeToggle) return;
    themeToggle.innerHTML = isLight 
      ? '<i class="fa-solid fa-moon text-sm"></i>' 
      : '<i class="fa-solid fa-sun text-sm"></i>';
  }

  // 2. Scroll Progress Bar & Compact Header & Back to Top
  const scrollProgressBar = document.getElementById('scroll-progress');
  const header = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;

    if (scrollProgressBar) scrollProgressBar.style.width = `${progress}%`;

    if (header) {
      if (scrollTop > 50) {
        header.classList.add('py-2', 'shadow-lg');
        header.classList.remove('py-4');
      } else {
        header.classList.add('py-4');
        header.classList.remove('py-2', 'shadow-lg');
      }
    }

    if (backToTopBtn) {
      if (scrollTop > 400) {
        backToTopBtn.classList.remove('opacity-0', 'invisible', 'pointer-events-none');
        backToTopBtn.classList.add('opacity-100', 'visible', 'pointer-events-auto');
      } else {
        backToTopBtn.classList.add('opacity-0', 'invisible', 'pointer-events-none');
        backToTopBtn.classList.remove('opacity-100', 'visible', 'pointer-events-auto');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. Render Projects Grid & Interactive Filtering
  renderProjects('all');

  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-filter');
      renderProjects(category);
    });
  });

  function renderProjects(filterCategory) {
    const container = document.getElementById('projects-grid');
    if (!container) return;

    const filtered = filterCategory === 'all' 
      ? PORTFOLIO_DATA.projects 
      : PORTFOLIO_DATA.projects.filter(p => 
          p.category.toLowerCase() === filterCategory.toLowerCase() ||
          p.technologies.some(t => t.toLowerCase().includes(filterCategory.toLowerCase()))
        );

    container.innerHTML = filtered.map(proj => `
      <div class="dev-card p-6 sm:p-8 flex flex-col justify-between group">
        <div>
          <div class="rounded-xl overflow-hidden bg-slate-950 border border-white/10 mb-6 relative aspect-video">
            <img src="${proj.image}" alt="${proj.title}" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
            <div class="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-mono text-purple-300">
              ${proj.categoryDisplay}
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h3 class="text-2xl font-bold text-white font-display">${proj.title}</h3>
          </div>

          <p class="text-slate-400 text-sm leading-relaxed mb-6">
            ${proj.shortDesc}
          </p>

          <div class="flex flex-wrap gap-2 mb-6">
            ${proj.technologies.map(t => `<span class="badge-pill text-xs">${t}</span>`).join('')}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
          <a href="${proj.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-solid text-xs py-2.5">
            <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
            <span>Live Website</span>
          </a>
          <button class="btn-outline text-xs py-2.5 view-case-study-btn" data-project-id="${proj.id}">
            <i class="fa-solid fa-file-lines text-xs"></i>
            <span>View Case Study</span>
          </button>
        </div>
      </div>
    `).join('');

    // Attach Case Study Modal Handlers
    document.querySelectorAll('.view-case-study-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.getAttribute('data-project-id');
        openCaseStudyModal(pId);
      });
    });
  }

  // 4. Case Study Modal Logic
  const caseStudyModal = document.getElementById('case-study-modal');
  const caseStudyContent = document.getElementById('case-study-content');
  const caseStudyClose = document.getElementById('case-study-close');

  function openCaseStudyModal(projectId) {
    const proj = PORTFOLIO_DATA.projects.find(p => p.id === projectId);
    if (!proj || !caseStudyModal || !caseStudyContent) return;

    const cs = proj.caseStudy;
    caseStudyContent.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span class="badge-pill text-xs mb-2">${proj.categoryDisplay}</span>
            <h2 class="text-3xl sm:text-4xl font-bold text-white font-display">${proj.title}</h2>
            <div class="text-sm text-slate-400 mt-1">Client / Industry: <strong class="text-slate-200">${cs.client}</strong></div>
            <div class="text-sm text-slate-400">Role: <strong class="text-purple-400">${cs.role}</strong></div>
          </div>
          <a href="${proj.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-solid text-xs py-2.5 px-5">
            <span>Visit Live Website</span> <i class="fa-solid fa-external-link text-xs"></i>
          </a>
        </div>

        <!-- Media Preview -->
        <div class="rounded-xl overflow-hidden border border-white/10 aspect-video max-h-[360px] bg-slate-950">
          <img src="${proj.image}" alt="${proj.title}" class="w-full h-full object-cover">
        </div>

        <!-- Challenge & Solution Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="dev-card p-6">
            <h4 class="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <i class="fa-solid fa-triangle-exclamation text-amber-400 text-sm"></i> The Challenge
            </h4>
            <p class="text-slate-300 text-sm leading-relaxed">${cs.challenge}</p>
          </div>

          <div class="dev-card p-6">
            <h4 class="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <i class="fa-solid fa-lightbulb text-emerald-400 text-sm"></i> The Solution
            </h4>
            <p class="text-slate-300 text-sm leading-relaxed">${cs.solution}</p>
          </div>
        </div>

        <!-- Key Features -->
        <div class="dev-card p-6 space-y-3">
          <h4 class="text-lg font-bold text-white">Key Implemented Features</h4>
          <ul class="space-y-2">
            ${cs.features.map(f => `
              <li class="flex items-start gap-2.5 text-sm text-slate-300">
                <i class="fa-solid fa-check text-purple-400 mt-1 text-xs"></i>
                <span>${f}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Technologies Used -->
        <div>
          <h4 class="text-sm font-bold uppercase font-mono text-slate-400 mb-3">Technologies</h4>
          <div class="flex flex-wrap gap-2">
            ${proj.technologies.map(t => `<span class="badge-pill text-xs">${t}</span>`).join('')}
          </div>
        </div>

        <!-- Results -->
        <div class="bg-purple-950/30 border border-purple-500/20 rounded-xl p-5">
          <h4 class="text-sm font-bold text-purple-300 mb-1">Impact & Outcome</h4>
          <p class="text-sm text-slate-300">${cs.results}</p>
        </div>
      </div>
    `;

    caseStudyModal.classList.remove('opacity-0', 'invisible', 'pointer-events-none');
    caseStudyModal.classList.add('opacity-100', 'visible', 'pointer-events-auto');
    document.body.style.overflow = 'hidden';
  }

  function closeCaseStudy() {
    if (!caseStudyModal) return;
    caseStudyModal.classList.add('opacity-0', 'invisible', 'pointer-events-none');
    caseStudyModal.classList.remove('opacity-100', 'visible', 'pointer-events-auto');
    document.body.style.overflow = 'auto';
  }

  if (caseStudyClose) caseStudyClose.addEventListener('click', closeCaseStudy);
  if (caseStudyModal) {
    caseStudyModal.addEventListener('click', (e) => {
      if (e.target === caseStudyModal) closeCaseStudy();
    });
  }

  // 5. Render Blog Posts & Blog Modal
  const blogContainer = document.getElementById('blog-grid');
  if (blogContainer) {
    blogContainer.innerHTML = PORTFOLIO_DATA.blogPosts.map(post => `
      <div class="dev-card p-6 flex flex-col justify-between group">
        <div>
          <div class="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
            <span class="badge-pill text-[11px]">${post.category}</span>
            <span>${post.readTime}</span>
          </div>
          <h3 class="text-xl font-bold text-white font-display mb-3 group-hover:text-purple-400 transition-colors">
            ${post.title}
          </h3>
          <p class="text-slate-400 text-sm leading-relaxed mb-6">
            ${post.excerpt}
          </p>
        </div>
        <button class="read-blog-btn text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 self-start" data-blog-id="${post.id}">
          <span>Read Article</span> <i class="fa-solid fa-arrow-right text-[10px]"></i>
        </button>
      </div>
    `).join('');

    document.querySelectorAll('.read-blog-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const bId = btn.getAttribute('data-blog-id');
        openBlogModal(bId);
      });
    });
  }

  const blogModal = document.getElementById('blog-modal');
  const blogContent = document.getElementById('blog-modal-content');
  const blogClose = document.getElementById('blog-modal-close');

  function openBlogModal(blogId) {
    const post = PORTFOLIO_DATA.blogPosts.find(b => b.id === blogId);
    if (!post || !blogModal || !blogContent) return;

    blogContent.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span class="badge-pill text-[11px]">${post.category}</span>
          <span>•</span>
          <span>${post.readTime}</span>
          <span>•</span>
          <span>Published ${post.date}</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-bold text-white font-display">${post.title}</h2>
        <div class="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 border-t border-white/10 pt-4">
          ${post.content}
        </div>
      </div>
    `;

    blogModal.classList.remove('opacity-0', 'invisible', 'pointer-events-none');
    blogModal.classList.add('opacity-100', 'visible', 'pointer-events-auto');
    document.body.style.overflow = 'hidden';
  }

  function closeBlogModal() {
    if (!blogModal) return;
    blogModal.classList.add('opacity-0', 'invisible', 'pointer-events-none');
    blogModal.classList.remove('opacity-100', 'visible', 'pointer-events-auto');
    document.body.style.overflow = 'auto';
  }

  if (blogClose) blogClose.addEventListener('click', closeBlogModal);
  if (blogModal) {
    blogModal.addEventListener('click', (e) => {
      if (e.target === blogModal) closeBlogModal();
    });
  }

  // 6. AI Portfolio Assistant Logic
  const aiToggle = document.getElementById('ai-assistant-toggle');
  const aiPanel = document.getElementById('ai-assistant-panel');
  const aiClose = document.getElementById('ai-assistant-close');
  const aiSend = document.getElementById('ai-send-btn');
  const aiInput = document.getElementById('ai-input-text');
  const aiMessages = document.getElementById('ai-messages-box');

  if (aiToggle && aiPanel) {
    aiToggle.addEventListener('click', () => {
      const isHidden = aiPanel.classList.contains('hidden');
      if (isHidden) {
        aiPanel.classList.remove('hidden');
        setTimeout(() => {
          aiPanel.classList.remove('scale-95', 'opacity-0');
          aiPanel.classList.add('scale-100', 'opacity-100');
        }, 10);
      } else {
        aiPanel.classList.add('scale-95', 'opacity-0');
        aiPanel.classList.remove('scale-100', 'opacity-100');
        setTimeout(() => aiPanel.classList.add('hidden'), 200);
      }
    });

    if (aiClose) {
      aiClose.addEventListener('click', () => {
        aiPanel.classList.add('scale-95', 'opacity-0');
        aiPanel.classList.remove('scale-100', 'opacity-100');
        setTimeout(() => aiPanel.classList.add('hidden'), 200);
      });
    }

    // Suggested question buttons
    document.querySelectorAll('.ai-prompt-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.textContent.trim();
        handleUserQuery(query);
      });
    });

    const handleUserQuery = (text) => {
      if (!text) return;

      // Add user message
      const userBubble = document.createElement('div');
      userBubble.className = 'flex items-start justify-end';
      userBubble.innerHTML = `
        <div class="bg-purple-600/30 border border-purple-500/40 text-slate-100 text-xs p-3 rounded-2xl rounded-tr-none max-w-[85%]">
          ${text}
        </div>
      `;
      aiMessages.appendChild(userBubble);
      if (aiInput) aiInput.value = '';
      aiMessages.scrollTop = aiMessages.scrollHeight;

      // Match response from FAQ configuration
      setTimeout(() => {
        let matchedAnswer = "I'm Muhammad's portfolio assistant. For specific custom requirements or inquiries, you can reach out directly via the Contact form or WhatsApp at 0340-1350380!";
        
        const lower = text.toLowerCase();
        for (const item of PORTFOLIO_DATA.faqAssistant) {
          if (item.keywords.some(k => lower.includes(k))) {
            matchedAnswer = item.answer;
            break;
          }
        }

        const botBubble = document.createElement('div');
        botBubble.className = 'flex items-start gap-2.5';
        botBubble.innerHTML = `
          <div class="w-6 h-6 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 text-[10px] font-mono font-bold flex-shrink-0">AI</div>
          <div class="bg-white/5 border border-white/10 text-slate-200 text-xs p-3 rounded-2xl rounded-tl-none max-w-[85%] leading-relaxed shadow-sm">
            ${matchedAnswer}
          </div>
        `;
        aiMessages.appendChild(botBubble);
        aiMessages.scrollTop = aiMessages.scrollHeight;
      }, 450);
    };

    if (aiSend) {
      aiSend.addEventListener('click', () => {
        handleUserQuery(aiInput.value.trim());
      });
    }

    if (aiInput) {
      aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserQuery(aiInput.value.trim());
      });
    }
  }

  // 7. Contact Form Submission Handler
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin text-xs"></i> <span>Sending...</span>';
      }

      setTimeout(() => {
        if (formStatus) {
          formStatus.classList.remove('hidden');
          formStatus.className = 'p-4 rounded-xl text-center text-sm font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300';
          formStatus.textContent = 'Thank you! Your message has been sent successfully. Muhammad will respond shortly.';
        }
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Start a Project</span> <i class="fa-solid fa-arrow-right text-xs"></i>';
        }
      }, 1000);
    });
  }

  // 8. Mobile Navigation Drawer
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
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
