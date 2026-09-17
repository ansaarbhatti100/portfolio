/**
 * Centralized Portfolio Data Configuration
 * Edit content easily from this single file without touching HTML structure.
 */

export const PORTFOLIO_DATA = {
  personal: {
    name: "Muhammad Ansaar",
    title: "WordPress & Web Developer",
    secondaryExpertise: "Websites • eCommerce • SEO • AI Automation",
    tagline: "I build modern, responsive and high-performance websites for businesses, brands and eCommerce.",
    availability: "Available for Freelance Projects",
    experienceYears: "3+",
    location: "Pakistan (Remote / Worldwide)",
    email: "ansaar.bhatti100@gmail.com",
    whatsapp: "923401350380",
    whatsappUrl: "https://wa.me/923401350380",
    cvUrl: "assets/cv.pdf",
    profileImg: "assets/profile.jpg",
    bioP1: "I'm Muhammad Ansaar, a WordPress & Web Developer focused on building modern business websites, eCommerce stores and custom web solutions.",
    bioP2: "I specialize in clean architecture, performance optimization, technical SEO, and automated workflows. Whether it's building a bespoke WooCommerce store, optimizing Core Web Vitals, or integrating intelligent AI assistants, I deliver reliable, human-centered digital experiences."
  },

  stats: [
    { label: "Projects Built", value: "150", suffix: "+" },
    { label: "Websites Developed", value: "95", suffix: "+" },
    { label: "Core Technologies", value: "12", suffix: "+" },
    { label: "Worldwide Clients", value: "40", suffix: "+" }
  ],

  services: [
    {
      id: "web-dev",
      icon: "fa-solid fa-code",
      title: "Web Development",
      description: "Modern business, corporate and landing websites built with clean code and high performance standards.",
      highlights: ["Custom Landing Pages", "Corporate Portals", "Responsive Layouts", "Fast Load Speed"]
    },
    {
      id: "wp-dev",
      icon: "fa-brands fa-wordpress",
      title: "WordPress Development",
      description: "Custom WordPress websites, bespoke theme customizations, advanced plugin setup and dynamic functionality.",
      highlights: ["Custom Theme Styling", "Plugin Integration", "Elementor Pro", "ACF & Custom Post Types"]
    },
    {
      id: "woocommerce",
      icon: "fa-solid fa-bag-shopping",
      title: "WooCommerce",
      description: "Professional eCommerce stores, high-converting product pages, secure checkout flows and online shopping systems.",
      highlights: ["Payment Gateways", "Cart Optimization", "Product Filtering", "Inventory Tracking"]
    },
    {
      id: "frontend",
      icon: "fa-solid fa-laptop-code",
      title: "UI / Frontend Development",
      description: "Responsive, modern and user-friendly interfaces crafted with HTML5, modern CSS3, and JavaScript.",
      highlights: ["Mobile-First Approach", "Micro-Interactions", "Clean Semantic Code", "Cross-Browser Testing"]
    },
    {
      id: "seo-performance",
      icon: "fa-solid fa-gauge-high",
      title: "Technical SEO & Performance",
      description: "Technical SEO, website structure, speed optimization, Core Web Vitals and search console alignment.",
      highlights: ["Core Web Vitals", "Schema & Sitemaps", "Image Compression", "Speed Optimization"]
    },
    {
      id: "ai-automation",
      icon: "fa-solid fa-brain",
      title: "AI & Automation",
      description: "AI assistants, AI calling agents, WhatsApp automation, and API-based workflows for business scaling.",
      highlights: ["WhatsApp Bot Workflows", "AI Customer Agents", "Webhook Sync", "n8n Automations"]
    }
  ],

  projects: [
    {
      id: "arman-leather",
      title: "ArmanLeather",
      category: "eCommerce",
      categoryDisplay: "Premium Leather E-commerce",
      technologies: ["WordPress", "WooCommerce", "Elementor", "Stripe"],
      shortDesc: "Modern eCommerce experience for a premium leather brand with bespoke product configurator and global payment gateway.",
      image: "assets/project2.jpg",
      liveUrl: "https://leathercraft-store.com",
      caseStudy: {
        client: "ArmanLeather Goods",
        role: "Lead WordPress & WooCommerce Developer",
        challenge: "The client needed a sophisticated luxury eCommerce portal to showcase handcrafted leather products with custom variation selectors, fast loading speeds, and international multi-currency checkout.",
        solution: "Engineered a custom WooCommerce architecture utilizing Elementor Pro and lightweight styling, integrated secure payment gateways, and optimized product imagery to achieve sub-second page loads.",
        features: [
          "Interactive sizing and custom leather color variation picker",
          "Automated stock management and abandoned cart recovery",
          "One-page frictionless checkout integration with Stripe & PayPal",
          "Technical SEO setup with rich product schema markup"
        ],
        results: "Significant increase in mobile checkout conversions and 95+ desktop performance rating."
      }
    },
    {
      id: "ansaar-global",
      title: "ANSAAR GLOBAL EXPORT",
      category: "Manufacturing",
      categoryDisplay: "Manufacturing & Export",
      technologies: ["WordPress", "Elementor", "SEO", "PHP"],
      shortDesc: "Comprehensive B2B export portal designed for international buyers, featuring dynamic catalog request workflows and compliance tracking.",
      image: "assets/project1.jpg",
      liveUrl: "#",
      caseStudy: {
        client: "Ansaar Global Export Corp",
        role: "Web Architect & SEO Specialist",
        challenge: "Creating an authoritative digital identity for an export business to capture verified overseas B2B inquiries across multiple continents.",
        solution: "Developed a structured B2B catalog platform with dynamic RFQ (Request for Quote) forms, multi-language readiness, and targeted international technical SEO.",
        features: [
          "Bespoke inquiry builder with instant quotation routing",
          "Product specification and regulatory compliance download hub",
          "Schema-backed international company identity for high search rankings",
          "Mobile-optimized catalog browsing"
        ],
        results: "Streamlined overseas lead capture with direct WhatsApp & Email quotation notifications."
      }
    },
    {
      id: "sportswear-mfg",
      title: "Sportswear Manufacturing",
      category: "Manufacturing",
      categoryDisplay: "B2B Manufacturing",
      technologies: ["WordPress", "WooCommerce", "AI", "Tailwind CSS"],
      shortDesc: "B2B teamwear and athletic apparel platform with bespoke bulk order calculators and AI inquiry assistants.",
      image: "assets/project3.jpg",
      liveUrl: "#",
      caseStudy: {
        client: "ActiveFit Teamwear Ltd.",
        role: "Full Stack WordPress Developer",
        challenge: "Managing custom team uniforms, minimum order quantity tier pricing, and technical mockups for custom athletic gear.",
        solution: "Implemented custom WooCommerce wholesale tiers, instant tier-pricing tables, and an AI chat agent to answer frequent supplier questions.",
        features: [
          "Tiered bulk pricing matrix for custom sports apparel",
          "Direct tech-pack and vector logo upload engine",
          "Integrated WhatsApp support agent for urgent orders",
          "High performance responsive media grid"
        ],
        results: "Reduced inquiry response time by 70% with automated quotation flows."
      }
    },
    {
      id: "wp-manager-sys",
      title: "Web Portal Management",
      category: "Business",
      categoryDisplay: "Business Management",
      technologies: ["PHP", "MySQL", "JavaScript", "REST API"],
      shortDesc: "Internal management portal with secure database querying, automated backup scheduling, and customer support tracking.",
      image: "assets/project4.jpg",
      liveUrl: "#",
      caseStudy: {
        client: "Horizon Business Solutions",
        role: "Backend & Frontend Developer",
        challenge: "Centralizing disparate customer data, billing history, and maintenance tasks into a unified dashboard.",
        solution: "Constructed a secure PHP/MySQL web utility with role-based access control, analytics telemetry, and automated weekly backup reports.",
        features: [
          "Secure authentication and granular role permissions",
          "Automated database maintenance scripts with email logs",
          "Dynamic client project status monitor",
          "Clean responsive UI with dark mode support"
        ],
        results: "Eliminated manual tracking errors and simplified client site management."
      }
    }
  ],

  techStack: {
    frontend: [
      { name: "HTML5", desc: "Semantic, accessible markup" },
      { name: "CSS3 / Modern CSS", desc: "Flexbox, Grid, Custom Properties" },
      { name: "JavaScript (ES6+)", desc: "DOM manipulation, Fetch API, Async" },
      { name: "Tailwind CSS", desc: "Utility-first modern UI styling" }
    ],
    wordpress: [
      { name: "WordPress", desc: "Core CMS, custom post types & hooks" },
      { name: "Elementor & Elementor Pro", desc: "Pixel-perfect custom visual building" },
      { name: "WooCommerce", desc: "Scalable eCommerce & payment gateways" },
      { name: "WordPress Plugins", desc: "ACF, WP Rocket, RankMath, Yoast" }
    ],
    backend: [
      { name: "PHP", desc: "Server logic, custom functions, theme hooks" },
      { name: "MySQL", desc: "Relational database structuring & queries" },
      { name: "REST API", desc: "JSON endpoints & third-party integrations" },
      { name: "Webhooks", desc: "Real-time event triggering & sync" }
    ],
    seo: [
      { name: "Technical SEO", desc: "Crawlability, architecture & indexing" },
      { name: "Schema Markup", desc: "JSON-LD structured data for rich snippets" },
      { name: "XML Sitemap & Robots.txt", desc: "Search engine guidance & directives" },
      { name: "Canonical URLs", desc: "Duplicate content prevention" },
      { name: "Core Web Vitals", desc: "LCP, FID, INP, CLS optimization" }
    ],
    aiAutomation: [
      { name: "AI Agents", desc: "Context-aware conversational business bots" },
      { name: "WhatsApp Automation", desc: "Automated customer inquiry handling" },
      { name: "n8n Workflows", desc: "Self-hosted automated API pipelines" },
      { name: "API Integration", desc: "OpenAI, CRM, and webhook bridges" }
    ]
  },

  developmentProcess: [
    { step: "01", title: "Discover", desc: "Understand business goals, target audience, technical specifications, and key deliverables." },
    { step: "02", title: "Plan", desc: "Define information architecture, page wireframes, content strategy, and tech stack choices." },
    { step: "03", title: "Design", desc: "Create a modern, responsive, human-crafted UI/UX with clean visual hierarchy and accessibility." },
    { step: "04", title: "Develop", desc: "Build clean, semantic code, integrate WordPress / WooCommerce / APIs, and optimize performance." },
    { step: "05", title: "Test", desc: "Conduct thorough cross-browser testing, mobile verification, form validation, and speed checks." },
    { step: "06", title: "Launch", desc: "Configure technical SEO, security hardening, analytics tracking, and deploy smoothly." }
  ],

  experience: [
    {
      role: "WordPress & Web Developer",
      type: "Freelance / Project-Based Development",
      period: "2023 — Present",
      description: "Building custom WordPress websites, WooCommerce stores, and responsive web applications for international clients and businesses. Implementing technical SEO, speed optimization, and API automations."
    }
  ],

  education: [
    {
      degree: "Master in Physical Education",
      institution: "University of Sargodha",
      period: "Graduated"
    }
  ],

  testimonials: [
    {
      quote: "Muhammad rebuilt our entire eCommerce store on WooCommerce. The website is exceptionally fast, clean, and has noticeably improved our client conversions.",
      author: "Verified Client",
      company: "ArmanLeather",
      country: "International"
    },
    {
      quote: "His technical approach to WordPress architecture, speed optimization, and clean page structure made our business website project an absolute success.",
      author: "Verified Client",
      company: "Export & Manufacturing Partner",
      country: "United Kingdom"
    },
    {
      quote: "Reliable, transparent, and skilled in both WordPress customization and modern web standards. Always delivers clean and maintainable work.",
      author: "Verified Client",
      company: "Tech & Services Agency",
      country: "UAE"
    }
  ],

  blogPosts: [
    {
      id: "wp-performance-guide",
      category: "Performance",
      title: "WordPress Performance Optimization: A Practical 2026 Guide",
      excerpt: "How to systematically optimize asset loading, database overhead, and server caching to achieve 95+ PageSpeed scores without breaking functionality.",
      readTime: "5 min read",
      date: "2026",
      content: `
        <h3>Why Speed is a Core Business Requirement</h3>
        <p>A fast website directly improves user retention, Core Web Vitals rankings, and conversion rates. When optimizing WordPress, focus on four key pillars:</p>
        <ul>
          <li><strong>Image Optimization:</strong> Serve modern formats (WebP/AVIF) and specify explicit dimensions to prevent Cumulative Layout Shift (CLS).</li>
          <li><strong>Asset Cleanliness:</strong> Disable unused Gutenberg blocks and third-party scripts on pages where they are not required.</li>
          <li><strong>Efficient Caching:</strong> Implement server-level microcaching and object caching (Redis/Memcached) for database queries.</li>
          <li><strong>Font Loading:</strong> Use modern CSS font-display swap and locally host critical typeface weights.</li>
        </ul>
      `
    },
    {
      id: "woocommerce-scaling",
      category: "WooCommerce",
      title: "Structuring WooCommerce for High-Conversion & Scale",
      excerpt: "Key architectural decisions for high-volume WooCommerce stores: checkout friction reduction, custom attributes, and database hygiene.",
      readTime: "6 min read",
      date: "2026",
      content: `
        <h3>Streamlining the eCommerce Journey</h3>
        <p>Friction in the checkout process is the primary cause of abandoned carts. By implementing one-page checkouts, clear shipping estimates, and instant validation, store owners see immediate conversion improvements.</p>
        <p>Additionally, keeping WooCommerce databases clean by pruning transient logs and optimizing postmeta indices ensures consistent sub-second page loads during peak promotion events.</p>
      `
    },
    {
      id: "technical-seo-essentials",
      category: "Technical SEO",
      title: "Technical SEO Checklist for Modern Business Websites",
      excerpt: "The vital technical checklist every developer must review before launching: Schema JSON-LD, sitemaps, canonical tags, and mobile hierarchy.",
      readTime: "4 min read",
      date: "2026",
      content: `
        <h3>Building Search-Engine Friendly Foundations</h3>
        <p>Technical SEO is not about keyword stuffing; it is about providing search engine crawlers with an unambiguous, well-structured representation of your website's content.</p>
        <ul>
          <li>Ensure valid JSON-LD schema is output for Organization, WebSite, and BreadcrumbList.</li>
          <li>Maintain clean canonical URLs to prevent duplicate indexing across URL parameters.</li>
          <li>Ensure clean, logical heading hierarchies (H1 -> H2 -> H3) on every landing page.</li>
        </ul>
      `
    }
  ],

  faqAssistant: [
    {
      keywords: ["services", "offer", "what do you do", "skills", "capabilities"],
      answer: "Muhammad Ansaar offers professional Web Development, custom WordPress Development, WooCommerce store setup, Frontend UI Development, Technical SEO & Performance Optimization, and AI/WhatsApp Automations."
    },
    {
      keywords: ["projects", "portfolio", "work", "examples", "case study", "arman"],
      answer: "Key featured projects include ArmanLeather (Premium Leather WooCommerce store), ANSAAR GLOBAL EXPORT (B2B export catalog portal), and Sportswear Manufacturing (B2B apparel platform with bulk pricing). You can explore full case studies in the Projects section!"
    },
    {
      keywords: ["woocommerce", "ecommerce", "store", "shop", "payment", "online store"],
      answer: "Yes! Muhammad specializes in building robust WooCommerce stores with custom product filters, multi-currency checkout, Stripe/PayPal integrations, and speed-optimized product pages."
    },
    {
      keywords: ["technologies", "tech", "stack", "tools", "language"],
      answer: "His core tech stack includes WordPress, WooCommerce, Elementor Pro, HTML5, CSS3, JavaScript, PHP, MySQL, REST APIs, Technical SEO schemas, n8n, and WhatsApp AI automation workflows."
    },
    {
      keywords: ["contact", "hire", "start", "quote", "whatsapp", "email", "price", "budget"],
      answer: "You can easily start a project by filling out the Contact Form below, emailing ansaar.bhatti100@gmail.com, or chatting directly on WhatsApp at 0340-1350380."
    }
  ]
};
