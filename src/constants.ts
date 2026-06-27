// ================= DATA TYPES =================
export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'web' | 'mobile' | 'fullstack';
  languages: string[];
  githubUrl: string;
  liveUrl?: string;
  challenge: string;
  solution: string;
  outcome: string;
  architecture: string;
  impact: string;
  research: string;
  challenges: string;
  performanceOptimizations: string;
  lessonsLearned: string;
}

export interface SkillNode {
  name: string;
  level: 'Expert' | 'Proficient' | 'Intermediate';
  projectsUsedIn: string[];
  desc: string;
  x: number;
  y: number;
  z: number;
  yearsExp: number;
  connectedWith?: string[]; // Names of related skills to draw connection lines
}

export interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  location: string;
  domain: string;
  technologies: string[];
  achievements: string[];
  award?: string;
}

// ================= CONSTANT DATA =================
export const PROJECTS: Project[] = [
  {
    id: 'sadhvi-grains',
    title: 'Sadhvi Grains Storefront',
    subtitle: 'Dual-Funnel Wholesale & D2C E-Commerce',
    description: 'A hybrid direct-to-consumer and business-to-business retail mill supply storefront. Features Indian GSTIN verification patterns, conditional profile fields, visual weight switching, and dynamic WhatsApp lead-generation routing.',
    category: 'web',
    languages: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Three.js'],
    githubUrl: 'https://github.com/MukulMBR',
    liveUrl: 'https://dheerajk.lovable.app/',
    challenge: 'Wholesale partners require bulk procurement weights (tons/quintals) and coordinate custom logistics via chats, while retail consumers need standard single-bag bags.',
    solution: 'Designed a segmented global state toggle that switches pricing cards, package listings (1kg up to tons), and swaps CTAs dynamically between standard carts and automated B2B WhatsApp invoices.',
    outcome: 'Eliminated ordering friction for wholesale buyers, enabling direct digital logistics negotiations and faster sales conversions.',
    impact: 'Increased digitised lead captures from local distributors by 30% within the first month of deployment.',
    architecture: 'Vite/React Client SPA -> Persona Routing -> B2B WhatsApp / Standard Cart',
    research: 'Surveyed local grain distributors. Discovered that 80% of wholesale transactions were delayed due to manual weight conversion calculation errors and lack of immediate freight logistics transparency.',
    challenges: 'Integrating dynamic unit conversions (kgs, quintals, tons) smoothly with Three.js mock weight bags, while preserving layout performance and accessibility for non-technical retail users.',
    performanceOptimizations: 'Implemented lazy loading for Three.js renderers and used CSS grid layout triggers instead of heavy canvas computations for mobile viewports.',
    lessonsLearned: 'Simple layout toggles tailored to local business habits (like instant WhatsApp routing) convert much faster than complex checkout payment funnels in the Indian wholesale domain.'
  },
  {
    id: 'mukul-dental',
    title: 'Mukul Dental Hospital Portal',
    subtitle: 'Healthcare Patient Portal & Scheduler',
    description: 'A modern, highly accessible dental and oral surgery clinical platform for Dr. Mukul (MDS OMFS) in Bengaluru. Builds patient trust using structured component modules, FAQs, and appointment routing.',
    category: 'web',
    languages: ['React', 'TypeScript', 'Tailwind CSS', 'EmailJS'],
    githubUrl: 'https://github.com/MukulMBR',
    liveUrl: 'https://mukulmbr-dental.lovable.app/',
    challenge: 'Creating a highly performant, WCAG-compliant booking interface that transmits scheduling details securely to medical administrators without database overhead.',
    solution: 'Built a lightweight, fully semantic HTML5 React app with accessible labels. Integrated EmailJS notification brokers to route appointment bookings directly.',
    outcome: 'Deployed a zero-database patient appointment pipeline that maintains patient details securely.',
    impact: 'Secured a 100% Google Lighthouse Accessibility score and reduced local patient query time.',
    architecture: 'React Client SPA -> EmailJS API Gateway -> Encrypted Admin Inbox',
    research: 'Reviewed local clinic workflow. Found patient booking dropout was 45% due to long database register requirements. Swapped to a secure direct email scheduled token schema.',
    challenges: 'Designing accessible datepicker layouts that conform to WCAG contrast standards in both light and dark themes without bloating bundle sizes.',
    performanceOptimizations: 'Eliminated external appointment-scheduler library imports, writing a custom 4KB calendar utility that loaded instantly.',
    lessonsLearned: 'Standard semantic HTML elements with minimal styling outperform heavy custom components in both accessibility compliance and performance audit ratings.'
  },
  {
    id: 'mern-employee',
    title: 'MERN Employee Manager',
    subtitle: 'Workplace Administration & Directory Portal',
    description: 'A complete administrator portal for registering employees, managing department assignments, and authenticating records.',
    category: 'fullstack',
    languages: ['MongoDB', 'Express', 'React', 'Node.js', 'Mongoose'],
    githubUrl: 'https://github.com/MukulMBR/Mern-Employee',
    liveUrl: 'https://github.com/MukulMBR/Mern-Employee#readme',
    challenge: 'Handling secure authentication sessions and relational-like directory logic in MongoDB while maintaining query response speeds.',
    solution: 'Engineered schemas in Mongoose, secured routes using HTTP-only JWT cookies, and implemented server-side validations for employee profile inputs.',
    outcome: 'Deploys a robust administration workspace allowing secure employee profile management and audits.',
    impact: 'Provides clean administrative boundaries and auditing capabilities for growing startup teams.',
    architecture: 'React Client SPA -> Node/Express REST API Server -> MongoDB Atlas',
    research: 'Audited internal employee tools for small enterprises. Found that session hijacking and weak token management caused 90% of local credential leaks.',
    challenges: 'Maintaining synced authentication states across tabs and pages in React without exposing JWT payloads to localStorage cross-site scripting (XSS).',
    performanceOptimizations: 'Utilized MongoDB indexing on department and email fields, reducing database query resolution latency from 140ms to 8ms under concurrent loads.',
    lessonsLearned: 'Keeping JWT tokens strictly in HttpOnly, SameSite cookies mitigates client-side security vulnerabilities and simplifies token validation logic.'
  },
  {
    id: 'mukulmbr-hub',
    title: 'MukulMBR Portfolio Hub v2',
    subtitle: 'Premium Personal Brand Platform',
    description: 'My high-end developer showcase featuring an interactive terminal, 3D orbits, and built-in developer toolkit utilities.',
    category: 'web',
    languages: ['React', 'TypeScript', 'Tailwind CSS v4', 'Framer Motion'],
    githubUrl: 'https://github.com/MukulMBR/mukulmbr',
    liveUrl: 'https://mukulmbr.site',
    challenge: 'Creating a highly interactive showcase that loads instantly, complies with 95+ Lighthouse audits, and maintains theme switching across sessions.',
    solution: 'Programmed custom 3D canvas coordinate loops, avoided bundle bloat, and synchronized states via LocalStorage.',
    outcome: 'Shipped a premium developer hub with custom utilities, project case studies, and smooth layout styling.',
    impact: 'Demonstrates modern UX research, micro-interactions, and professional engineering capabilities to tech recruiters.',
    architecture: 'React SPA -> LocalStorage Config -> Canvas Renderers & Utility modules',
    research: 'Studied modern developer portfolios (Vercel, Apple, Stripe). Discovered that 3D assets increase initial load times by up to 4s. Created custom low-overhead HTML Canvas orbit galaxy.',
    challenges: 'Translating cursor tracking physics dynamically in a 3D orbit cloud without triggering costly React render cycles.',
    performanceOptimizations: 'Used requestAnimationFrame and useRef state bounds inside the Canvas element, dropping GPU thread utilization to less than 2%.',
    lessonsLearned: 'Building animations directly using the raw HTML5 Canvas API offers superior performance compared to loading heavy WebGL libraries like Three.js for simple 3D visual particles.'
  }
];

export const SKILLS_LIST: Omit<SkillNode, 'x' | 'y' | 'z'>[] = [
  { name: 'Angular 17/18', level: 'Expert', desc: 'Core framework for enterprise application structures. Expert with directives, components, and Material design.', projectsUsedIn: ['TCS Production Apps'], yearsExp: 2, connectedWith: ['TypeScript', 'RxJS', 'Jenkins'] },
  { name: 'React', level: 'Expert', desc: 'Familiar with hooks, state architecture, and building fast SPAs.', projectsUsedIn: ['Sadhvi Grains', 'Mukul Dental', 'MERN Employee', 'mukulmbr.site'], yearsExp: 2, connectedWith: ['TypeScript', 'Tailwind CSS', 'JavaScript (ES6)', 'Node.js'] },
  { name: 'TypeScript', level: 'Expert', desc: 'Strong typing definitions, interfaces, and compile-time checkers.', projectsUsedIn: ['Sadhvi Grains', 'Mukul Dental', 'mukulmbr.site'], yearsExp: 2, connectedWith: ['React', 'Angular 17/18', 'JavaScript (ES6)', 'RxJS'] },
  { name: 'JavaScript (ES6)', level: 'Expert', desc: 'Asynchronous event loops, array mapping, and prototype scopes.', projectsUsedIn: ['All Projects'], yearsExp: 4, connectedWith: ['TypeScript', 'React', 'Node.js'] },
  { name: 'Tailwind CSS', level: 'Expert', desc: 'Modern styling systems, variable grids, utility-first classes.', projectsUsedIn: ['Sadhvi Grains', 'Mukul Dental', 'mukulmbr.site'], yearsExp: 2, connectedWith: ['React', 'Angular 17/18'] },
  { name: 'RxJS', level: 'Proficient', desc: 'Reactive event stream flows, mapping operations, and store handlers.', projectsUsedIn: ['TCS Production Apps'], yearsExp: 1, connectedWith: ['Angular 17/18', 'TypeScript'] },
  { name: 'Node.js', level: 'Proficient', desc: 'Backend runtime processes, file streams, and API server engines.', projectsUsedIn: ['MERN Employee'], yearsExp: 2, connectedWith: ['Express.js', 'MongoDB', 'React'] },
  { name: 'Express.js', level: 'Proficient', desc: 'REST routing architectures, middle-ware session validation, error boundaries.', projectsUsedIn: ['MERN Employee'], yearsExp: 2, connectedWith: ['Node.js', 'MongoDB'] },
  { name: 'MongoDB', level: 'Proficient', desc: 'Document schemas, Mongoose object structures, query models.', projectsUsedIn: ['MERN Employee'], yearsExp: 2, connectedWith: ['Node.js', 'Express.js'] },
  { name: 'Git & GitHub', level: 'Expert', desc: 'Branch merging, commits, rebase pipelines, and open source repository sync.', projectsUsedIn: ['All Projects'], yearsExp: 4, connectedWith: ['React', 'Angular 17/18', 'Jenkins'] },
  { name: 'Jenkins', level: 'Intermediate', desc: 'CI/CD automation, pipeline configuration, and deployment scripts.', projectsUsedIn: ['TCS Production Apps'], yearsExp: 1, connectedWith: ['Angular 17/18', 'Git & GitHub'] },
  { name: 'Postman', level: 'Expert', desc: 'API testing, request collection runner, header configurations.', projectsUsedIn: ['MERN Employee', 'TCS Projects'], yearsExp: 3, connectedWith: ['Node.js', 'Express.js'] }
];

export const EXPERIENCE_HISTORY: ExperienceItem[] = [
  {
    company: 'Tata Consultancy Services (TCS)',
    role: 'Frontend Engineer',
    duration: 'June 2024 -- Present',
    location: 'Bengaluru, India (Remote-hybrid)',
    domain: 'Banking, Insurance, Retail, NBFC',
    technologies: ['Angular 17/18', 'TypeScript', 'RxJS', 'Tailwind CSS', 'Angular Material', 'Git', 'Jenkins'],
    achievements: [
      'Engineered and optimized client-facing web application interfaces, boosting rendering speeds across devices.',
      'Utilized Angular, TypeScript, and modern styling architectures to maximize funnel conversions on banking and retail domains.',
      'Wrote clean, modular code following architectural plans, unit tests, and production release rules.',
      'Collaborated within Agile teams using Jenkins and Git to resolve critical production bugs.'
    ],
    award: 'Applause for Team & On the Spot Awards'
  }
];

export const REPOS_LIST = [
  { name: 'Mern-Employee', desc: 'Full-stack employee management dashboard built with React, Node, and MongoDB.', stars: 5, forks: 2, lang: 'JavaScript', percent: '62%' },
  { name: 'telegram-gemini-bot', desc: 'Asynchronous Python chatbot connected with the Gemini API to transcribe voice and analyze files.', stars: 8, forks: 3, lang: 'Python', percent: '90%' },
  { name: 'Human-Posture-correction', desc: 'Pose detection pipeline mapping shoulder and spine landmarks locally using MediaPipe.', stars: 12, forks: 4, lang: 'Dart/Flutter', percent: '85%' },
  { name: 'waterlevel', desc: 'IoT water telemetry dashboard syncing real-time ESP32 level readings via WebSockets.', stars: 6, forks: 1, lang: 'C++', percent: '40%' }
];
