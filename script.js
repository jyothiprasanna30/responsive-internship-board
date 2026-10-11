/**
 * InternPulse - Responsive Internship Board
 * Technology: Pure Vanilla JavaScript (ES6+)
 * Features: Dynamic DOM rendering, multi-criteria filtering, search,
 *           sorting, saved bookmarks (localStorage), accessible modals,
 *           responsive mobile drawer, and offline/CORS fallback.
 */

// --- Application State Management ---
const AppState = {
  internships: [],
  filteredInternships: [],
  activeFilters: {
    search: '',
    domain: 'all',
    workMode: 'all',
    sortBy: 'newest',
    savedOnly: false
  },
  savedInternshipIds: new Set(),
  activeModalInternship: null,
  lastFocusedElement: null
};

// --- Embedded Fallback Seed Data (Ensures 100% functionality even when opened directly via file://) ---
const FALLBACK_INTERNSHIPS = [
  {
    "id": "intern-001",
    "title": "Frontend Engineering Intern",
    "company": "TechNova Labs",
    "domain": "Web Development",
    "duration": "3 Months",
    "location": "Remote",
    "workMode": "Remote",
    "stipend": "$1,200 / month",
    "postedDate": "2026-10-04",
    "description": "Collaborate with senior developers to build responsive web interfaces, optimize frontend performance, and implement accessible UI components using modern web standards.",
    "skills": ["HTML5", "CSS3", "JavaScript", "Responsive Design", "Git"],
    "responsibilities": [
      "Develop responsive and accessible web layouts adhering to WCAG 2.1 AA standards.",
      "Translate Figma prototypes and design tokens into semantic, performant frontend code.",
      "Participate in daily stand-ups, code reviews, and cross-functional team sprints.",
      "Optimize core web vitals and cross-browser rendering compatibility."
    ],
    "requirements": [
      "Solid understanding of semantic HTML5, CSS3 Grid/Flexbox, and modern JavaScript (ES6+).",
      "Familiarity with version control workflows using Git and GitHub.",
      "Basic understanding of responsive mobile-first development principles.",
      "Strong problem-solving mindset and eagerness to learn engineering best practices."
    ],
    "perks": [
      "1-on-1 mentorship from Staff Engineers",
      "Flexible working hours across time zones",
      "Certificate of Internship Completion",
      "Opportunity for full-time pre-placement offer (PPO)"
    ],
    "applicationUrl": ""
  },
  {
    "id": "intern-002",
    "title": "UI/UX Design Intern",
    "company": "Aura Studio",
    "domain": "UI/UX Design",
    "duration": "3 Months",
    "location": "Bengaluru, India",
    "workMode": "Hybrid",
    "stipend": "₹28,000 / month",
    "postedDate": "2026-10-06",
    "description": "Work alongside product designers and researchers to conduct user testing, create wireframes, and design cohesive visual design systems for fintech and consumer applications.",
    "skills": ["Figma", "Wireframing", "User Research", "Design Systems", "Prototyping"],
    "responsibilities": [
      "Create high-fidelity interactive wireframes and interactive prototypes in Figma.",
      "Assist in user interviews, usability audits, and synthesis of feedback loops.",
      "Contribute to our expanding multi-platform design tokens and component library.",
      "Collaborate with developers to ensure design fidelity in production."
    ],
    "requirements": [
      "Portfolio displaying 2+ case studies with strong typography and layout hierarchy.",
      "Proficiency in Figma components, auto-layout, and prototyping tools.",
      "Understanding of human-centered design principles and accessibility standards.",
      "Pursuing a degree in Design, Human-Computer Interaction, or related discipline."
    ],
    "perks": [
      "Hands-on exposure to high-scale live consumer products",
      "Monthly wellness and learning stipend",
      "Design masterclasses with industry veterans",
      "Official certificate and portfolio recommendation"
    ],
    "applicationUrl": "https://example.com/apply/aura-design"
  },
  {
    "id": "intern-003",
    "title": "Data Science & Analytics Intern",
    "company": "Nexus Insights",
    "domain": "Data Science",
    "duration": "6 Months",
    "location": "San Francisco, CA",
    "workMode": "Remote",
    "stipend": "$1,600 / month",
    "postedDate": "2026-10-02",
    "description": "Extract actionable business insights from multi-terabyte datasets, build automated analytics dashboards, and assist in validating predictive machine learning pipelines.",
    "skills": ["Python", "SQL", "Pandas", "Data Visualization", "Statistical Analysis"],
    "responsibilities": [
      "Write optimized SQL queries and Python ETL scripts for aggregate data warehousing.",
      "Develop executive dashboards and self-service analytics reports.",
      "Perform exploratory data analysis (EDA) to detect behavioral trends and anomalies.",
      "Support data scientists in model evaluation and A/B test metric tracking."
    ],
    "requirements": [
      "Strong proficiency in Python (NumPy, Pandas, Matplotlib/Seaborn) and SQL.",
      "Solid grounding in probability, hypothesis testing, and descriptive statistics.",
      "Curiosity for business intelligence and narrative data storytelling.",
      "Experience with Git or version controlled data workflows."
    ],
    "perks": [
      "Full cloud credits budget for self-directed data projects",
      "Bi-weekly deep-dive sessions with Senior Data Scientists",
      "Remote home-office equipment allowance",
      "Letter of recommendation and networking access"
    ],
    "applicationUrl": ""
  },
  {
    "id": "intern-004",
    "title": "Cloud DevOps Intern",
    "company": "SkyScale Infrastructure",
    "domain": "Cloud & DevOps",
    "duration": "4 Months",
    "location": "Austin, TX",
    "workMode": "Hybrid",
    "stipend": "$1,400 / month",
    "postedDate": "2026-10-07",
    "description": "Assist our Cloud Reliability team in managing CI/CD pipelines, containerizing internal microservices, and monitoring high-availability cloud infrastructure.",
    "skills": ["Docker", "Linux", "CI/CD", "AWS / GCP", "Bash / Python"],
    "responsibilities": [
      "Write Dockerfiles and streamline container image builds for microservices.",
      "Assist in writing GitHub Actions and GitLab CI automated deployment workflows.",
      "Monitor cluster performance, server metrics, and alerting rules in Grafana.",
      "Document cloud architectures, runbooks, and disaster recovery checklists."
    ],
    "requirements": [
      "Familiarity with Linux command-line environments and Bash shell scripting.",
      "Fundamental understanding of networking (TCP/IP, DNS, HTTP/S, SSL).",
      "Hands-on experience with Docker and basic Git workflows.",
      "Interest in infrastructure as code (Terraform) and site reliability."
    ],
    "perks": [
      "Cloud certification exam voucher reimbursement (AWS / GCP)",
      "Hybrid workspace with catered lunches",
      "Direct guidance from Lead Infrastructure Architects",
      "Opportunity to work with enterprise Kubernetes environments"
    ],
    "applicationUrl": "https://example.com/apply/skyscale-devops"
  },
  {
    "id": "intern-005",
    "title": "Junior Cybersecurity Analyst Intern",
    "company": "CipherShield Defense",
    "domain": "Cybersecurity",
    "duration": "6 Months",
    "location": "New York, NY",
    "workMode": "On-site",
    "stipend": "$1,500 / month",
    "postedDate": "2026-10-01",
    "description": "Support our Security Operations Center (SOC) by analyzing network telemetry, triaging incident alerts, and participating in vulnerability assessments.",
    "skills": ["Network Security", "Wireshark", "Vulnerability Scanning", "SIEM", "Python"],
    "responsibilities": [
      "Monitor SIEM alerts and triage suspicious activity across endpoint logs.",
      "Assist in running automated vulnerability scans and patch compliance reviews.",
      "Analyze packet captures using Wireshark to understand anomalous traffic.",
      "Participate in tabletop crisis response exercises and security policy reviews."
    ],
    "requirements": [
      "Working knowledge of common vulnerabilities (OWASP Top 10) and network protocols.",
      "Familiarity with security tools (Nmap, Wireshark, Burp Suite, or Splunk).",
      "Strong analytical mindset with high attention to detail.",
      "Enrolled in Cybersecurity, Computer Science, or Information Assurance degree."
    ],
    "perks": [
      "Hands-on SOC floor simulation training",
      "Security training lab access (TryHackMe / HackTheBox VIP)",
      "Commuter transit subsidy",
      "Mentorship towards CompTIA Security+ or CEH"
    ],
    "applicationUrl": ""
  },
  {
    "id": "intern-006",
    "title": "Machine Learning Research Intern",
    "company": "CognitiveAI Systems",
    "domain": "Artificial Intelligence",
    "duration": "3 Months",
    "location": "Remote",
    "workMode": "Remote",
    "stipend": "$1,750 / month",
    "postedDate": "2026-10-08",
    "description": "Help evaluate large language models, curate fine-tuning datasets, benchmark inference latency, and build prototype AI workflows for developer productivity.",
    "skills": ["PyTorch", "Python", "Transformers", "NLP", "Model Evaluation"],
    "responsibilities": [
      "Clean, filter, and preprocess domain-specific text and multimodal datasets.",
      "Execute evaluation benchmarks across open-source foundation models.",
      "Build interactive test prototypes using lightweight web interfaces.",
      "Summarize research papers and present experimental findings in lab seminars."
    ],
    "requirements": [
      "Strong Python programming and familiarity with PyTorch or TensorFlow.",
      "Foundational grasp of deep learning, transformer architectures, and embeddings.",
      "Ability to read and implement methods from recent arXiv research papers.",
      "Eager to conduct disciplined, reproducible experimental evaluations."
    ],
    "perks": [
      "Dedicated GPU computing compute allocation (H100 / A100)",
      "Co-authorship opportunities on published technical research",
      "Flexible schedule with remote team across 4 continents",
      "Generous hardware and home-office equipment support"
    ],
    "applicationUrl": "https://example.com/apply/cognitiveai"
  },
  {
    "id": "intern-007",
    "title": "Mobile App Development Intern (iOS & Android)",
    "company": "PulseMobility",
    "domain": "Mobile Development",
    "duration": "3 Months",
    "location": "London, UK",
    "workMode": "Hybrid",
    "stipend": "£1,300 / month",
    "postedDate": "2026-10-05",
    "description": "Collaborate on cross-platform mobile apps for millions of commuters, focusing on offline data syncing, smooth animations, and platform-specific UX patterns.",
    "skills": ["Flutter", "Kotlin / Swift", "Mobile UI", "REST APIs", "State Management"],
    "responsibilities": [
      "Build polished mobile screens with responsive layouts across various screen densities.",
      "Integrate RESTful microservices and implement local caching with SQLite.",
      "Fix bugs, improve touch response latency, and reduce app startup times.",
      "Participate in weekly sprint reviews and QA smoke test cycles."
    ],
    "requirements": [
      "Experience developing mobile applications with Flutter, React Native, or native SDKs.",
      "Understanding of mobile lifecycle, state management, and asynchronous network calls.",
      "Demonstrable hobby or academic mobile app project published or on GitHub.",
      "Passion for smooth micro-interactions and high-fidelity mobile ergonomics."
    ],
    "perks": [
      "Free transit card passes for London transport network",
      "Testing device lab with latest flagship handsets and tablets",
      "Internship completion certificate and verified LinkedIn recommendation",
      "Full team hackathon participation"
    ],
    "applicationUrl": ""
  },
  {
    "id": "intern-008",
    "title": "Full Stack Developer Intern",
    "company": "OmniStack Solutions",
    "domain": "Software Engineering",
    "duration": "6 Months",
    "location": "Bengaluru, India",
    "workMode": "Hybrid",
    "stipend": "₹32,000 / month",
    "postedDate": "2026-10-09",
    "description": "Contribute across our end-to-end web architecture, from building RESTful APIs in Node.js to crafting responsive browser dashboards and database schemas.",
    "skills": ["JavaScript", "Node.js", "Express", "PostgreSQL", "HTML/CSS"],
    "responsibilities": [
      "Design and document secure REST APIs with JSON payloads and input validation.",
      "Write normalized SQL database migrations and optimize relational queries.",
      "Build modular, reusable frontend components that communicate with backend endpoints.",
      "Write unit tests and integration tests to maintain high code coverage."
    ],
    "requirements": [
      "Proficient in modern JavaScript (ES6+), Node.js, and asynchronous patterns.",
      "Working knowledge of relational databases (PostgreSQL or MySQL).",
      "Clear understanding of client-server architecture, HTTP headers, and CORS.",
      "Strong collaborative communication skills in code reviews and documentation."
    ],
    "perks": [
      "Comprehensive healthcare insurance coverage for interns",
      "Subsidized learning courses and tech book allowance",
      "High-spec developer laptop provided during internship",
      "Direct pathway to Full-time Associate Software Engineer"
    ],
    "applicationUrl": "https://example.com/apply/omnistack"
  },
  {
    "id": "intern-009",
    "title": "Backend Systems Intern",
    "company": "Krypton Core",
    "domain": "Software Engineering",
    "duration": "3 Months",
    "location": "Remote",
    "workMode": "Remote",
    "stipend": "$1,350 / month",
    "postedDate": "2026-10-03",
    "description": "Help optimize our core distributed processing services, write concurrency-safe message consumers, and benchmark Redis and database performance.",
    "skills": ["Go / Python", "Redis", "Distributed Systems", "SQL", "Docker"],
    "responsibilities": [
      "Implement performant backend worker services that process asynchronous tasks.",
      "Configure Redis caching strategies to reduce database query loads.",
      "Write profiling scripts to identify CPU bottlenecks and memory leaks.",
      "Participate in architectural design reviews for new backend microservices."
    ],
    "requirements": [
      "Comfortable with Go, Python, or Java and object-oriented / functional patterns.",
      "Good foundation in data structures, algorithms, and computational complexity.",
      "Understanding of caching concepts, key-value stores, and database indexing.",
      "Enthusiasm for backend reliability and clean, testable code."
    ],
    "perks": [
      "Complete remote flexibility with asynchronous communication culture",
      "Monthly technology and ergonomic chair stipend",
      "Dedicated senior engineer pair-programming buddy",
      "Internship completion certificate"
    ],
    "applicationUrl": ""
  },
  {
    "id": "intern-010",
    "title": "Product Growth & Marketing Intern",
    "company": "Elevate Digital",
    "domain": "UI/UX Design",
    "duration": "2 Months",
    "location": "Singapore",
    "workMode": "On-site",
    "stipend": "SGD 1,500 / month",
    "postedDate": "2026-09-28",
    "description": "Analyze digital funnel conversion, design landing page variants, and coordinate content marketing strategies across educational tech platforms.",
    "skills": ["Analytics", "A/B Testing", "Content Strategy", "Figma", "SEO"],
    "responsibilities": [
      "Design and test high-converting landing page layouts and call-to-actions.",
      "Measure funnel drop-offs using Google Analytics and heatmaps.",
      "Craft engaging technical blog posts and student onboarding newsletters.",
      "Conduct competitive benchmarking of top global developer platforms."
    ],
    "requirements": [
      "Strong written and verbal communication in English.",
      "Analytical mindset with familiarity with web metrics (CTR, bounce rate, CAC).",
      "Basic visual design literacy with Figma or Canva.",
      "Self-starter personality with quick turnaround execution."
    ],
    "perks": [
      "Modern office in downtown Singapore financial hub",
      "Catered team breakfasts and team building activities",
      "Direct mentorship from VP of Growth",
      "Letter of appreciation and career recommendation"
    ],
    "applicationUrl": "https://example.com/apply/elevate"
  },
  {
    "id": "intern-011",
    "title": "Applied AI Solutions Intern",
    "company": "NeuralPath Dynamics",
    "domain": "Artificial Intelligence",
    "duration": "6 Months",
    "location": "Bengaluru, India",
    "workMode": "Remote",
    "stipend": "₹35,000 / month",
    "postedDate": "2026-10-10",
    "description": "Build production retrieval-augmented generation (RAG) applications, integrate vector search databases, and evaluate semantic search accuracy.",
    "skills": ["Python", "Vector Databases", "LangChain / LlamaIndex", "FastAPI", "Docker"],
    "responsibilities": [
      "Implement semantic retrieval pipelines using vector embeddings.",
      "Build FastAPI microservices to expose AI capabilities to frontend apps.",
      "Evaluate retrieval relevance and ground truth factual accuracy.",
      "Implement rate-limiting and structured fallback mechanisms for AI endpoints."
    ],
    "requirements": [
      "Strong Python skills with experience building web APIs (FastAPI or Flask).",
      "Understanding of vector stores (Chroma, Pinecone, or Qdrant) and text chunking.",
      "Familiarity with prompt engineering and LLM evaluation frameworks.",
      "Curious and proactive approach to emerging open-source AI tooling."
    ],
    "perks": [
      "Access to premium AI API credits and computing resources",
      "Attend industry AI conferences and workshops",
      "Flexible work hours with milestone-driven evaluations",
      "Verified digital certificate of internship completion"
    ],
    "applicationUrl": ""
  },
  {
    "id": "intern-012",
    "title": "Quality Assurance Automation Intern",
    "company": "VeriCode Systems",
    "domain": "Software Engineering",
    "duration": "3 Months",
    "location": "Remote",
    "workMode": "Remote",
    "stipend": "$1,100 / month",
    "postedDate": "2026-09-25",
    "description": "Develop automated end-to-end regression suites, test responsive web applications, and collaborate with developers to catch edge cases early in the sprint.",
    "skills": ["Playwright / Cypress", "JavaScript", "Manual QA", "Bug Tracking", "Git"],
    "responsibilities": [
      "Author reliable automated browser test scripts using Playwright.",
      "Perform manual exploratory testing across multiple viewport sizes and browsers.",
      "File detailed bug reports with reproduction steps, logs, and screenshots.",
      "Integrate automated test runs into continuous integration pipelines."
    ],
    "requirements": [
      "Knowledge of web technologies (HTML, CSS selectors, DOM manipulation).",
      "Basic programming skills in JavaScript or Python.",
      "Methodical thinking and eye for catching subtle UI and functional glitches.",
      "Familiarity with bug tracking software such as Jira or GitHub Issues."
    ],
    "perks": [
      "Comprehensive training in modern test automation frameworks",
      "Weekly 1-on-1 career coaching with QA Leads",
      "Certificate of Internship and LinkedIn recommendation",
      "Opportunity to earn permanent QA Engineer offer"
    ],
    "applicationUrl": "https://example.com/apply/vericode"
  }
];

// --- Color Generator for Company Monograms ---
const COMPANY_COLORS = [
  'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
  'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
  'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
  'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
  'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
  'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
  'linear-gradient(135deg, #db2777 0%, #be185d 100%)',
  'linear-gradient(135deg, #475569 0%, #334155 100%)'
];

function getCompanyGradient(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COMPANY_COLORS.length;
  return COMPANY_COLORS[index];
}

function getCompanyInitials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || 'IP';
}

// --- LocalStorage for Saved Internships ---
function loadSavedInternships() {
  try {
    const raw = localStorage.getItem('internpulse_saved_ids');
    if (raw) {
      const arr = JSON.parse(raw);
      AppState.savedInternshipIds = new Set(arr);
    }
  } catch (err) {
    console.warn('LocalStorage not accessible:', err);
  }
  updateSavedBadges();
}

function saveToLocalStorage() {
  try {
    const arr = Array.from(AppState.savedInternshipIds);
    localStorage.setItem('internpulse_saved_ids', JSON.stringify(arr));
  } catch (err) {
    console.warn('Unable to persist to LocalStorage:', err);
  }
  updateSavedBadges();
}

function updateSavedBadges() {
  const count = AppState.savedInternshipIds.size;
  const badge = document.getElementById('saved-count-badge');
  const checkboxCount = document.getElementById('saved-checkbox-count');
  if (badge) badge.textContent = count;
  if (checkboxCount) checkboxCount.textContent = count;
}

function toggleBookmark(id) {
  if (AppState.savedInternshipIds.has(id)) {
    AppState.savedInternshipIds.delete(id);
    showToast('Internship removed from saved bookmarks.', 'info');
  } else {
    AppState.savedInternshipIds.add(id);
    showToast('Internship saved to your bookmarks!', 'success');
  }
  saveToLocalStorage();
  applyFiltersAndRender();

  // If active in modal, update modal button too
  if (AppState.activeModalInternship && AppState.activeModalInternship.id === id) {
    updateModalBookmarkBtn(id);
  }
}

// --- Data Fetching Layer ---
async function fetchInternships() {
  const skeletonGrid = document.getElementById('skeleton-grid');
  const errorState = document.getElementById('error-state');
  const emptyState = document.getElementById('empty-state');
  const internshipsGrid = document.getElementById('internships-grid');

  if (skeletonGrid) skeletonGrid.classList.add('loading');
  if (errorState) errorState.hidden = true;
  if (emptyState) emptyState.hidden = true;
  if (internshipsGrid) internshipsGrid.innerHTML = '';

  try {
    const response = await fetch('data/internships.json');
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid or empty dataset received');
    }
    AppState.internships = data;
  } catch (err) {
    console.warn('Fetch failed (network or CORS limitation). Utilizing bundled dataset:', err);
    // Graceful fallback to bundled seed records so the app works seamlessly under all environments
    AppState.internships = FALLBACK_INTERNSHIPS;
  } finally {
    if (skeletonGrid) skeletonGrid.classList.remove('loading');
    populateDomainFilterOptions();
    applyFiltersAndRender();
    updateStatsCounter();
  }
}

// --- Dynamic Stats Counter ---
function updateStatsCounter() {
  const total = AppState.internships.length;
  const domains = new Set(AppState.internships.map(item => item.domain || 'Other')).size;

  const totalEl = document.getElementById('stat-total-roles');
  const domainEl = document.getElementById('stat-total-domains');
  if (totalEl) totalEl.textContent = `${total}+`;
  if (domainEl) domainEl.textContent = `${domains}+`;
}

// --- Populate Domain Options Dynamically ---
function populateDomainFilterOptions() {
  const domainSelect = document.getElementById('domain-select');
  if (!domainSelect) return;

  const domainCounts = {};
  AppState.internships.forEach(item => {
    const d = item.domain || 'Other';
    domainCounts[d] = (domainCounts[d] || 0) + 1;
  });

  const currentVal = domainSelect.value;
  domainSelect.innerHTML = `<option value="all">All Domains (${AppState.internships.length})</option>`;

  Object.keys(domainCounts).sort().forEach(domain => {
    const option = document.createElement('option');
    option.value = domain;
    option.textContent = `${domain} (${domainCounts[domain]})`;
    domainSelect.appendChild(option);
  });

  if (currentVal && domainCounts[currentVal]) {
    domainSelect.value = currentVal;
  }
}

// --- Search, Filtering & Sorting Logic ---
function applyFiltersAndRender() {
  const { search, domain, workMode, sortBy, savedOnly } = AppState.activeFilters;
  const query = search.trim().toLowerCase();

  let results = AppState.internships.filter(item => {
    // 1. Keyword search (title, company, description, domain, location, skills)
    if (query) {
      const titleMatch = (item.title || '').toLowerCase().includes(query);
      const companyMatch = (item.company || '').toLowerCase().includes(query);
      const descMatch = (item.description || '').toLowerCase().includes(query);
      const domainMatch = (item.domain || '').toLowerCase().includes(query);
      const locationMatch = (item.location || '').toLowerCase().includes(query);
      const skillsMatch = Array.isArray(item.skills) && item.skills.some(s => s.toLowerCase().includes(query));

      if (!titleMatch && !companyMatch && !descMatch && !domainMatch && !locationMatch && !skillsMatch) {
        return false;
      }
    }

    // 2. Domain filter
    if (domain !== 'all') {
      if ((item.domain || '').toLowerCase() !== domain.toLowerCase()) {
        return false;
      }
    }

    // 3. Work mode filter
    if (workMode !== 'all') {
      if ((item.workMode || '').toLowerCase() !== workMode.toLowerCase()) {
        return false;
      }
    }

    // 4. Saved Only filter
    if (savedOnly) {
      if (!AppState.savedInternshipIds.has(item.id)) {
        return false;
      }
    }

    return true;
  });

  // 5. Sorting
  results.sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.postedDate || 0) - new Date(a.postedDate || 0);
    }
    if (sortBy === 'title-asc') {
      return (a.title || '').localeCompare(b.title || '');
    }
    if (sortBy === 'company-asc') {
      return (a.company || '').localeCompare(b.company || '');
    }
    if (sortBy === 'duration') {
      return (a.duration || '').localeCompare(b.duration || '');
    }
    return 0;
  });

  AppState.filteredInternships = results;
  renderInternshipsList(results);
  renderActiveFilterChips();
  updateResultsHeader(results.length, AppState.internships.length);
}

// --- UI Rendering of Internship Cards ---
function renderInternshipsList(internships) {
  const grid = document.getElementById('internships-grid');
  const emptyState = document.getElementById('empty-state');
  const emptyMessage = document.getElementById('empty-state-message');

  if (!grid) return;

  if (internships.length === 0) {
    grid.innerHTML = '';
    if (emptyState) {
      emptyState.hidden = false;
      if (AppState.activeFilters.savedOnly && AppState.savedInternshipIds.size === 0) {
        emptyMessage.textContent = "You haven't bookmarked any internships yet. Click the bookmark icon on any card to save it for later!";
      } else {
        emptyMessage.textContent = "We couldn't find any opportunities matching your active search and filter combinations.";
      }
    }
    return;
  }

  if (emptyState) emptyState.hidden = true;

  const cardsHtml = internships.map(item => {
    const isBookmarked = AppState.savedInternshipIds.has(item.id);
    const gradient = getCompanyGradient(item.company);
    const initials = getCompanyInitials(item.company);
    const modeClass = getWorkModeClass(item.workMode);

    const skillsHtml = Array.isArray(item.skills)
      ? item.skills.slice(0, 4).map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('')
      : '';

    return `
      <article class="internship-card" data-id="${escapeHtml(item.id)}">
        <div class="card-header">
          <div class="company-meta-group">
            <div class="company-avatar" style="background: ${gradient};" aria-hidden="true">
              ${initials}
            </div>
            <div class="company-text-meta">
              <span class="company-name">
                ${escapeHtml(item.company || 'Company')}
                <span class="verified-badge-mini" title="Verified employer" aria-label="Verified">✓</span>
              </span>
              <span class="card-location">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                ${escapeHtml(item.location || 'Multiple Locations')}
              </span>
            </div>
          </div>
          <button 
            type="button" 
            class="btn-bookmark ${isBookmarked ? 'bookmarked' : ''}" 
            data-id="${escapeHtml(item.id)}"
            aria-label="${isBookmarked ? 'Remove bookmark' : 'Bookmark this role'}"
            title="${isBookmarked ? 'Remove from saved' : 'Save internship'}"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
            </svg>
          </button>
        </div>

        <div class="card-body">
          <h3 class="role-title">${escapeHtml(item.title || 'Internship Role')}</h3>
          
          <div class="card-badges-row">
            <span class="badge-pill badge-domain">${escapeHtml(item.domain || 'Tech')}</span>
            <span class="badge-pill ${modeClass}">${escapeHtml(item.workMode || 'Flexible')}</span>
            <span class="badge-pill badge-duration">⏱ ${escapeHtml(item.duration || '3 Months')}</span>
            ${item.stipend ? `<span class="badge-pill badge-stipend">💰 ${escapeHtml(item.stipend)}</span>` : ''}
          </div>

          <p class="role-description-preview">
            ${escapeHtml(item.description || 'Join our team for a practical, mentor-driven internship experience.')}
          </p>

          ${skillsHtml ? `<div class="card-skills-row">${skillsHtml}</div>` : ''}
        </div>

        <div class="card-actions">
          <button type="button" class="btn btn-secondary btn-sm view-details-btn" data-id="${escapeHtml(item.id)}">
            View Details
          </button>
          <button type="button" class="btn btn-primary btn-sm apply-card-btn" data-id="${escapeHtml(item.id)}">
            Apply Now
          </button>
        </div>
      </article>
    `;
  }).join('');

  grid.innerHTML = cardsHtml;
}

function getWorkModeClass(mode = '') {
  const m = mode.toLowerCase();
  if (m === 'remote') return 'badge-mode-remote';
  if (m === 'hybrid') return 'badge-mode-hybrid';
  if (m === 'on-site' || m === 'onsite') return 'badge-mode-onsite';
  return 'badge-mode-remote';
}

// --- Active Filter Chips UI ---
function renderActiveFilterChips() {
  const container = document.getElementById('active-filters-container');
  const list = document.getElementById('active-filters-list');
  if (!container || !list) return;

  const chips = [];
  const { search, domain, workMode, savedOnly } = AppState.activeFilters;

  if (search.trim()) {
    chips.push({
      key: 'search',
      label: `Keyword: "${search.trim()}"`
    });
  }
  if (domain !== 'all') {
    chips.push({
      key: 'domain',
      label: `Domain: ${domain}`
    });
  }
  if (workMode !== 'all') {
    chips.push({
      key: 'workMode',
      label: `Mode: ${workMode}`
    });
  }
  if (savedOnly) {
    chips.push({
      key: 'savedOnly',
      label: 'Saved Bookmarks Only'
    });
  }

  if (chips.length === 0) {
    container.classList.remove('has-filters');
    list.innerHTML = '';
    return;
  }

  container.classList.add('has-filters');
  list.innerHTML = chips.map(c => `
    <span class="filter-chip">
      ${escapeHtml(c.label)}
      <button type="button" class="filter-chip-remove" data-filter-key="${c.key}" aria-label="Remove filter ${escapeHtml(c.label)}">
        &times;
      </button>
    </span>
  `).join('');
}

function removeActiveFilter(key) {
  if (key === 'search') {
    AppState.activeFilters.search = '';
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search-btn');
    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.hidden = true;
  } else if (key === 'domain') {
    AppState.activeFilters.domain = 'all';
    const domainSelect = document.getElementById('domain-select');
    if (domainSelect) domainSelect.value = 'all';
  } else if (key === 'workMode') {
    AppState.activeFilters.workMode = 'all';
    const modeSelect = document.getElementById('mode-select');
    if (modeSelect) modeSelect.value = 'all';
  } else if (key === 'savedOnly') {
    AppState.activeFilters.savedOnly = false;
    const checkbox = document.getElementById('saved-only-checkbox');
    if (checkbox) checkbox.checked = false;
  }
  applyFiltersAndRender();
}

function resetAllFilters() {
  AppState.activeFilters.search = '';
  AppState.activeFilters.domain = 'all';
  AppState.activeFilters.workMode = 'all';
  AppState.activeFilters.sortBy = 'newest';
  AppState.activeFilters.savedOnly = false;

  const searchInput = document.getElementById('search-input');
  const clearBtn = document.getElementById('clear-search-btn');
  const domainSelect = document.getElementById('domain-select');
  const modeSelect = document.getElementById('mode-select');
  const sortSelect = document.getElementById('sort-select');
  const savedCheckbox = document.getElementById('saved-only-checkbox');

  if (searchInput) searchInput.value = '';
  if (clearBtn) clearBtn.hidden = true;
  if (domainSelect) domainSelect.value = 'all';
  if (modeSelect) modeSelect.value = 'all';
  if (sortSelect) sortSelect.value = 'newest';
  if (savedCheckbox) savedCheckbox.checked = false;

  applyFiltersAndRender();
  showToast('All search and domain filters have been reset.', 'info');
}

// --- Live Results Header Info ---
function updateResultsHeader(currentCount, totalCount) {
  const title = document.getElementById('results-count-text');
  const subtext = document.getElementById('results-subtext');
  if (!title) return;

  if (currentCount === totalCount) {
    title.textContent = `Showing all ${totalCount} internships`;
    if (subtext) subtext.textContent = 'All curated opportunities currently open for application.';
  } else {
    title.textContent = `Showing ${currentCount} of ${totalCount} internships`;
    if (subtext) subtext.textContent = 'Filtered according to your search, domain, and mode preferences.';
  }
}

// --- Modal Dialog System ---
function openDetailsModal(internshipId) {
  const item = AppState.internships.find(i => i.id === internshipId);
  if (!item) return;

  AppState.activeModalInternship = item;
  AppState.lastFocusedElement = document.activeElement;

  const modal = document.getElementById('details-modal');
  const avatar = document.getElementById('modal-company-avatar');
  const companyName = document.getElementById('modal-company-name');
  const title = document.getElementById('modal-title');
  const badgesRow = document.getElementById('modal-badges-row');
  const domain = document.getElementById('modal-domain');
  const workMode = document.getElementById('modal-work-mode');
  const duration = document.getElementById('modal-duration');
  const location = document.getElementById('modal-location');
  const stipend = document.getElementById('modal-stipend');
  const postedDate = document.getElementById('modal-posted-date');
  const description = document.getElementById('modal-description');
  const skillsWrap = document.getElementById('modal-skills-wrap');
  const skillsSection = document.getElementById('modal-skills-section');
  const respList = document.getElementById('modal-responsibilities-list');
  const respSection = document.getElementById('modal-resp-section');
  const reqList = document.getElementById('modal-requirements-list');
  const reqSection = document.getElementById('modal-req-section');
  const perksList = document.getElementById('modal-perks-list');
  const perksSection = document.getElementById('modal-perks-section');
  const noticeDesc = document.getElementById('notice-desc');
  const applyBtn = document.getElementById('modal-apply-btn');

  // Populate Header & Meta
  if (avatar) {
    avatar.style.background = getCompanyGradient(item.company);
    avatar.textContent = getCompanyInitials(item.company);
  }
  if (companyName) companyName.textContent = item.company || 'Company';
  if (title) title.textContent = item.title || 'Internship Title';

  if (badgesRow) {
    const modeClass = getWorkModeClass(item.workMode);
    badgesRow.innerHTML = `
      <span class="badge-pill badge-domain">${escapeHtml(item.domain || 'Tech')}</span>
      <span class="badge-pill ${modeClass}">${escapeHtml(item.workMode || 'Flexible')}</span>
      <span class="badge-pill badge-duration">⏱ ${escapeHtml(item.duration || '3 Months')}</span>
    `;
  }

  if (domain) domain.textContent = item.domain || 'Not specified';
  if (workMode) workMode.textContent = item.workMode || 'Flexible';
  if (duration) duration.textContent = item.duration || '3 Months';
  if (location) location.textContent = item.location || 'Multiple Locations';
  if (stipend) stipend.textContent = item.stipend || 'Competitive / Unpaid';
  if (postedDate) postedDate.textContent = formatDate(item.postedDate);
  if (description) description.textContent = item.description || 'No description provided.';

  // Skills
  if (skillsWrap && skillsSection) {
    if (Array.isArray(item.skills) && item.skills.length > 0) {
      skillsSection.hidden = false;
      skillsWrap.innerHTML = item.skills.map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('');
    } else {
      skillsSection.hidden = true;
    }
  }

  // Responsibilities
  if (respList && respSection) {
    if (Array.isArray(item.responsibilities) && item.responsibilities.length > 0) {
      respSection.hidden = false;
      respList.innerHTML = item.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('');
    } else {
      respSection.hidden = true;
    }
  }

  // Requirements
  if (reqList && reqSection) {
    if (Array.isArray(item.requirements) && item.requirements.length > 0) {
      reqSection.hidden = false;
      reqList.innerHTML = item.requirements.map(rq => `<li>${escapeHtml(rq)}</li>`).join('');
    } else {
      reqSection.hidden = true;
    }
  }

  // Perks
  if (perksList && perksSection) {
    if (Array.isArray(item.perks) && item.perks.length > 0) {
      perksSection.hidden = false;
      perksList.innerHTML = item.perks.map(p => `<li>${escapeHtml(p)}</li>`).join('');
    } else {
      perksSection.hidden = true;
    }
  }

  // Application Notice Details
  if (noticeDesc) {
    if (item.applicationUrl && item.applicationUrl.trim() !== '') {
      noticeDesc.textContent = `External application endpoint detected (${item.applicationUrl}). Clicking Apply Now will redirect you to the company portal.`;
    } else {
      noticeDesc.textContent = `Portfolio Demonstration Record: This fictional listing was created for student portfolio testing. Clicking "Apply Now" will present a confirmation without submitting real-world data.`;
    }
  }

  updateModalBookmarkBtn(item.id);

  // Show Modal & Trap Focus
  modal.hidden = false;
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) closeBtn.focus();
}

function updateModalBookmarkBtn(id) {
  const bookmarkBtn = document.getElementById('modal-bookmark-btn');
  const bookmarkText = document.getElementById('modal-bookmark-text');
  if (!bookmarkBtn || !bookmarkText) return;

  const isSaved = AppState.savedInternshipIds.has(id);
  if (isSaved) {
    bookmarkBtn.classList.add('btn-primary');
    bookmarkBtn.classList.remove('btn-secondary');
    bookmarkText.textContent = 'Saved in Bookmarks';
  } else {
    bookmarkBtn.classList.remove('btn-primary');
    bookmarkBtn.classList.add('btn-secondary');
    bookmarkText.textContent = 'Save Internship';
  }
}

function closeDetailsModal() {
  const modal = document.getElementById('details-modal');
  if (!modal || modal.hidden) return;

  modal.hidden = true;
  document.body.style.overflow = '';
  AppState.activeModalInternship = null;

  if (AppState.lastFocusedElement && typeof AppState.lastFocusedElement.focus === 'function') {
    AppState.lastFocusedElement.focus();
  }
}

// --- Apply Now Handler (Strict adherence to requirement #7) ---
function handleApplyAction(internshipId) {
  const item = AppState.internships.find(i => i.id === internshipId);
  if (!item) return;

  if (item.applicationUrl && item.applicationUrl.trim() !== '' && !item.applicationUrl.includes('#')) {
    // Valid external link
    window.open(item.applicationUrl, '_blank', 'noopener,noreferrer');
    showToast(`Redirecting to ${item.company}'s application page...`, 'success');
  } else {
    // Fictional record with no external link: Show clear message instead of pretending application submitted
    showToast(`Notice: "${item.title}" is a portfolio demonstration record. No external submission required.`, 'info');
  }
}

// --- Toast Notifications System ---
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 4000);
}

// --- Utility Helpers ---
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(isoStr = '') {
  if (!isoStr) return 'Recently posted';
  const date = new Date(isoStr);
  if (isNaN(date.getTime())) return isoStr;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// --- Event Listeners Setup ---
function setupEventListeners() {
  // 1. Search Input (Debounced)
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');

  let debounceTimer = null;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (clearSearchBtn) {
        clearSearchBtn.hidden = val.length === 0;
      }
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        AppState.activeFilters.search = val;
        applyFiltersAndRender();
      }, 180);
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      clearSearchBtn.hidden = true;
      AppState.activeFilters.search = '';
      applyFiltersAndRender();
    });
  }

  // 2. Domain Filter
  const domainSelect = document.getElementById('domain-select');
  if (domainSelect) {
    domainSelect.addEventListener('change', (e) => {
      AppState.activeFilters.domain = e.target.value;
      applyFiltersAndRender();
    });
  }

  // 3. Work Mode Filter
  const modeSelect = document.getElementById('mode-select');
  if (modeSelect) {
    modeSelect.addEventListener('change', (e) => {
      AppState.activeFilters.workMode = e.target.value;
      applyFiltersAndRender();
    });
  }

  // 4. Sort Dropdown
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      AppState.activeFilters.sortBy = e.target.value;
      applyFiltersAndRender();
    });
  }

  // 5. Reset Filters Buttons
  const resetBtn = document.getElementById('reset-filters-btn');
  const emptyResetBtn = document.getElementById('empty-reset-btn');
  const clearAllTagsBtn = document.getElementById('clear-all-tags-btn');

  if (resetBtn) resetBtn.addEventListener('click', resetAllFilters);
  if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAllFilters);
  if (clearAllTagsBtn) clearAllTagsBtn.addEventListener('click', resetAllFilters);

  // 6. Active Filter Chip Removals
  const activeFiltersList = document.getElementById('active-filters-list');
  if (activeFiltersList) {
    activeFiltersList.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.filter-chip-remove');
      if (removeBtn) {
        const key = removeBtn.getAttribute('data-filter-key');
        if (key) removeActiveFilter(key);
      }
    });
  }

  // 7. Saved Only Checkbox & Saved Header Toggle
  const savedCheckbox = document.getElementById('saved-only-checkbox');
  if (savedCheckbox) {
    savedCheckbox.addEventListener('change', (e) => {
      AppState.activeFilters.savedOnly = e.target.checked;
      applyFiltersAndRender();
    });
  }

  const savedToggleBtn = document.getElementById('saved-toggle-btn');
  if (savedToggleBtn) {
    savedToggleBtn.addEventListener('click', () => {
      AppState.activeFilters.savedOnly = !AppState.activeFilters.savedOnly;
      if (savedCheckbox) savedCheckbox.checked = AppState.activeFilters.savedOnly;
      applyFiltersAndRender();
      const browseSection = document.getElementById('browse-section');
      if (browseSection) {
        browseSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 8. Grid Card Actions Delegation (View Details, Apply Now, Bookmark)
  const grid = document.getElementById('internships-grid');
  if (grid) {
    grid.addEventListener('click', (e) => {
      // Bookmark button
      const bookmarkBtn = e.target.closest('.btn-bookmark');
      if (bookmarkBtn) {
        const id = bookmarkBtn.getAttribute('data-id');
        if (id) toggleBookmark(id);
        return;
      }

      // View details button
      const detailsBtn = e.target.closest('.view-details-btn');
      if (detailsBtn) {
        const id = detailsBtn.getAttribute('data-id');
        if (id) openDetailsModal(id);
        return;
      }

      // Apply button
      const applyBtn = e.target.closest('.apply-card-btn');
      if (applyBtn) {
        const id = applyBtn.getAttribute('data-id');
        if (id) handleApplyAction(id);
        return;
      }
    });
  }

  // 9. Modal Dialog Listeners
  const detailsModal = document.getElementById('details-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBookmarkBtn = document.getElementById('modal-bookmark-btn');
  const modalApplyBtn = document.getElementById('modal-apply-btn');

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeDetailsModal);
  }

  if (detailsModal) {
    detailsModal.addEventListener('click', (e) => {
      if (e.target === detailsModal) {
        closeDetailsModal();
      }
    });
  }

  if (modalBookmarkBtn) {
    modalBookmarkBtn.addEventListener('click', () => {
      if (AppState.activeModalInternship) {
        toggleBookmark(AppState.activeModalInternship.id);
      }
    });
  }

  if (modalApplyBtn) {
    modalApplyBtn.addEventListener('click', () => {
      if (AppState.activeModalInternship) {
        handleApplyAction(AppState.activeModalInternship.id);
      }
    });
  }

  // 10. Recruiter Modal Listeners
  const recruiterModal = document.getElementById('recruiter-modal');
  const postRoleBtn = document.getElementById('post-role-btn');
  const mobilePostRoleBtn = document.getElementById('mobile-post-role-btn');
  const recruiterCloseBtn = document.getElementById('recruiter-modal-close-btn');
  const recruiterOkBtn = document.getElementById('recruiter-modal-ok-btn');

  function openRecruiterModal() {
    if (recruiterModal) {
      recruiterModal.hidden = false;
      document.body.style.overflow = 'hidden';
      if (recruiterCloseBtn) recruiterCloseBtn.focus();
    }
  }

  function closeRecruiterModal() {
    if (recruiterModal) {
      recruiterModal.hidden = true;
      document.body.style.overflow = '';
    }
  }

  if (postRoleBtn) postRoleBtn.addEventListener('click', openRecruiterModal);
  if (mobilePostRoleBtn) mobilePostRoleBtn.addEventListener('click', openRecruiterModal);
  if (recruiterCloseBtn) recruiterCloseBtn.addEventListener('click', closeRecruiterModal);
  if (recruiterOkBtn) recruiterOkBtn.addEventListener('click', closeRecruiterModal);
  if (recruiterModal) {
    recruiterModal.addEventListener('click', (e) => {
      if (e.target === recruiterModal) closeRecruiterModal();
    });
  }

  // 11. Keyboard Accessibility: Close Modals on Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (detailsModal && !detailsModal.hidden) {
        closeDetailsModal();
      }
      if (recruiterModal && !recruiterModal.hidden) {
        closeRecruiterModal();
      }
    }
  });

  // 12. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenuBtn.classList.toggle('active', !isExpanded);
      mobileNavDrawer.classList.toggle('open', !isExpanded);
      mobileNavDrawer.setAttribute('aria-hidden', isExpanded);
    });

    // Close mobile nav when clicking a link
    mobileNavDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.classList.remove('active');
        mobileNavDrawer.classList.remove('open');
        mobileNavDrawer.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // 13. Back to Top Button & Sticky Header Styling
  const backToTopBtn = document.getElementById('back-to-top-btn');
  const siteHeader = document.getElementById('site-header');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (backToTopBtn) {
      backToTopBtn.hidden = scrollY < 350;
    }
    if (siteHeader) {
      siteHeader.classList.toggle('scrolled', scrollY > 20);
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 14. Error State Retry Button
  const errorRetryBtn = document.getElementById('error-retry-btn');
  if (errorRetryBtn) {
    errorRetryBtn.addEventListener('click', fetchInternships);
  }

  // 15. Footer Domain Quick Links
  const footerDomainLinks = document.getElementById('footer-domain-links');
  if (footerDomainLinks) {
    footerDomainLinks.addEventListener('click', (e) => {
      const target = e.target.closest('a[data-domain]');
      if (target) {
        e.preventDefault();
        const dom = target.getAttribute('data-domain');
        if (dom) {
          AppState.activeFilters.domain = dom;
          const select = document.getElementById('domain-select');
          if (select) select.value = dom;
          applyFiltersAndRender();
          const browseSection = document.getElementById('browse-section');
          if (browseSection) browseSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
}

// --- Application Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  loadSavedInternships();
  setupEventListeners();
  fetchInternships();
});
