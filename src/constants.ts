export const DEFAULT_BIO = {
  name: "Mukul",
  role: "Product & Frontend Engineer",
  experience: 3.5,
  shippedRepos: 24,
  location: "Hyderabad, India",
  bioText1: "I am a Product & Frontend Engineer with 3.5 years of experience at TCS, specializing in building high-performance, responsive, and visually stunning web applications. I focus on clean code, modern design patterns, and seamless user experiences.",
  bioText2: "With a strong foundation in Angular, React, and TypeScript, I enjoy solving complex engineering challenges, optimizing performance, and bringing creative designs to life."
};

export const DEFAULT_PROJECTS = [
  {
    id: "sadhvi-grains",
    name: "Golden Grain Emporium",
    category: "SaaS Platform",
    description: "A premium B2B and B2C digital storefront for Sadhvi Grains Rice Mill, featuring an offline-first sync engine and a 3D bag viewer.",
    languages: ["React", "Three.js", "TailwindCSS", "Firebase"],
    challenge: "Designing a high-fidelity 3D product showcase and offline synchronization for rural grain markets.",
    research: "Analyzed low-bandwidth constraints and 3D rendering overhead on mobile browsers.",
    solution: "Created a custom lightweight WebGL showcase and implemented a service-worker-backed IndexedDB sync engine.",
    challenges: "Handling WebGL context loss and optimizing asset load times.",
    performanceOptimizations: "Mesh simplification, texture compression, and lazy-loaded assets.",
    outcome: "Successful deployment with 45% faster load times and 100% offline reliability.",
    lessonsLearned: "Asset optimization is critical for mobile WebGL performance.",
    impact: "Streamlined B2B order placements by 30%.",
    architecture: "React -> Three.js -> Service Worker -> IndexedDB -> Firestore",
    githubUrl: "https://github.com/MukulMBR/dheerajk-251c29b1.git",
    liveUrl: "https://mukulmbr.github.io/dheerajk-251c29b1",
    featured: true
  },
  {
    id: "portfolio-hub",
    name: "MukulMBR Portfolio Hub",
    category: "Frontend Eng",
    description: "A retro-futuristic developer portfolio featuring interactive CLI terminals, 3D skyline canvas grids, and real-time CRUD controls.",
    languages: ["React", "TypeScript", "Canvas", "Firebase"],
    challenge: "Creating a highly interactive developer hub with real-time editing capabilities and lightweight 3D graphics.",
    research: "Researched isometric 2D canvas projections to avoid heavy WebGL library imports.",
    solution: "Built a custom 2D canvas-based 3D skyline grid and integrated Firestore for live content updates.",
    challenges: "Managing state synchronization between local constants and remote database collections.",
    performanceOptimizations: "Debounced inputs, memoized renders, and CSS hardware acceleration.",
    outcome: "A blazing fast, interactive portfolio that showcases advanced frontend and product design skills.",
    lessonsLearned: "Custom canvas drawing can be a lightweight alternative to heavy 3D frameworks.",
    impact: "100% lighthouse performance score.",
    architecture: "React -> Canvas -> Firebase Auth -> Firestore",
    githubUrl: "https://github.com/MukulMBR/mukulmbr-hub.git",
    liveUrl: "https://mukulmbr-hub.vercel.app",
    featured: true
  }
];

export const DEFAULT_SKILLS = [
  { name: "Angular", level: 90, desc: "Enterprise application architecture, NgRx, RxJS, custom directives, performance optimization, and modular lazy loading" },
  { name: "React", level: 85, desc: "Custom hooks, state management, performance optimization, context API, and concurrent rendering features" },
  { name: "TypeScript", level: 90, desc: "Type safety, advanced generics, design patterns, decorates, and compiler configuration" },
  { name: "JavaScript", level: 95, desc: "ES6+, asynchronous programming, DOM manipulation, closures, prototypes, and event loop mechanics" },
  { name: "CSS/Tailwind", level: 85, desc: "Responsive design, modern layouts (Grid/Flexbox), custom animations, transitions, and theme configurations" },
  { name: "Firebase", level: 80, desc: "Authentication, Firestore CRUD operations, hosting, cloud security rules, and real-time synchronization" }
];

export const DEFAULT_EXPERIENCE = [
  {
    company: "Tata Consultancy Services (TCS)",
    role: "Systems Engineer & Frontend Lead",
    period: "2022 - Present",
    description: "Led the frontend architecture and development of multiple high-traffic enterprise Angular applications. Designed and implemented complex state management systems using NgRx and RxJS, reducing memory leaks by 40% and improving page load times by 25%. Directed a team of 4 junior developers, establishing code quality standards, automated testing pipelines, and clean Git workflows.",
    skills: ["Angular", "RxJS", "NgRx", "TypeScript", "Agile", "Git"]
  },
  {
    company: "TCS Digit Program",
    role: "Frontend Developer Specialist",
    period: "2022 - 2023",
    description: "Selected as one of the top 5% of engineers for the elite TCS Digit Program. Specialized in advanced frontend development, responsive web design, and modern JavaScript frameworks. Built highly interactive dashboards and visualization widgets, adhering to strict accessibility (WCAG 2.1) and performance benchmarks.",
    skills: ["React", "JavaScript", "CSS Grid", "Sass", "Web Accessibility", "Lighthouse"]
  }
];
