import { projectDetails } from './projectDetails';

export type ChapterId = 'about' | 'projects' | 'skills' | 'resume' | 'links';
export interface OptionValue {
  id: ChapterId;
  name: string;
  rotation: number;
  zIndex: number;
  offsetX: number;
  offsetY: number;
  description: string;
}

// Edit your personal details and URLs here. Empty links stay visibly unavailable.
export const profile = {
  name: 'Gabriel Cruz',
  shortName: 'Gabriel',
  school: 'Georgia Institute of Technology',
  degree: 'Double Major in Computer Science and Mathematics',
  year: 'Junior',
  expectedGraduation: '2028',
  focus: 'Software engineering / Systems / Embedded',
  intro: 'Double majoring in Computer Science and Mathematics at the Georgia Institute of Technology.',
  bio: 'Hey — I’m Gabriel Cruz. I’m double majoring in Computer Science and Mathematics at the Georgia Institute of Technology, and I enjoy building things that challenge me.',
  background: 'I interned at Johns Hopkins Applied Physics Laboratory, where I explored wireless technology and worked on projects connecting hardware and software.',
  internshipDates: 'June 2023 – May 2024',
  internshipLocation: 'Laurel, MD',
  interests: 'I enjoy watching soccer and football, playing basketball, doing puzzles, and listening to music.',
  phone: '240-810-4092',
  github: 'https://github.com/gabrieldcruz',
  linkedin: '',
  email: 'gabriel.david.cruz12@gmail.com',
  resume: '', // Add a file to static/resume.pdf, then set this to '/resume.pdf'.
};

export const options: OptionValue[] = [
  { id: 'about', name: 'ABOUT ME', rotation: -19, zIndex: 5, offsetX: 0, offsetY: 0, description: 'Meet the person behind the projects.' },
  { id: 'projects', name: 'PROJECTS', rotation: -12, zIndex: 4, offsetX: 24, offsetY: -4, description: 'Explore the things I build.' },
  { id: 'skills', name: 'SKILLS', rotation: -16, zIndex: 3, offsetX: -12, offsetY: -5, description: 'The languages and tools I build with.' },
  { id: 'resume', name: 'RESUME', rotation: -6, zIndex: 2, offsetX: 18, offsetY: -3, description: 'My background, project experience, and next chapter.' },
  { id: 'links', name: 'LINKS', rotation: 7, zIndex: 1, offsetX: 38, offsetY: 0, description: 'Find my code or get in touch.' },
];

export interface ProjectMedia {
  kind: 'image' | 'video';
  src: string;
  alt: string;
  caption: string;
  poster?: string;
  captions?: string;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  stack: string[];
  summary: string;
  features: string[];
  story?: { reason: string; challenge: string; improvement: string };
  media?: ProjectMedia[];
  github?: string;
  demo?: string;
}

// Project descriptions summarize the work in each repository.
export const projects: Project[] = [
  { id: 'aimockinterviewer', name: 'AI Mock Interviewer', category: '', stack: [], summary: 'AI interview practice with résumé-based questions, voice conversations, and feedback tailored to a target role.', features: [], github: 'https://github.com/gabrieldcruz/aimockinterviewer' },
  { id: 'breastcancersurvival', name: 'Breast Cancer Survival', category: '', stack: [], summary: 'Survival model research using clinical and genomic data, with risk predictions and feature explanations.', features: [], github: 'https://github.com/gabrieldcruz/breastcancersurvival' },
  { id: 'claudehackathon', name: 'Fridge Food Detector', category: '', stack: [], summary: 'Turn fridge photos into ingredient lists and recipe ideas, with pantry, grocery, and nutrition tools.', features: [], github: 'https://github.com/gabrieldcruz/claudehackathon' },
  { id: 'international-football-prediction', name: 'International Football Prediction', category: '', stack: [], summary: 'Predict international match outcomes using machine learning, rankings, recent form, and head-to-head results.', features: [], github: 'https://github.com/gabrieldcruz/International-Football-Prediction' },
  { id: 'matrix-multiplication', name: 'Matrix Multiplication', category: '', stack: [], summary: 'Compare standard and cache-blocked matrix multiplication in C++ with timing and performance benchmarks.', features: [], github: 'https://github.com/gabrieldcruz/Matrix-Multiplication' },
  { id: 'moviesstore', name: 'Movies Store', category: '', stack: [], summary: 'Django movie storefront with search, reviews, a cart, order history, and voting on requested movies.', features: [], github: 'https://github.com/gabrieldcruz/moviesstore' },
  { id: 'option-pricer', name: 'Option Pricer', category: '', stack: [], summary: 'Compare four European option pricing models in C++, with parallel Monte Carlo simulations and CSV exports.', features: [], github: 'https://github.com/gabrieldcruz/Option-Pricer' },
  { id: 'pairs-trading', name: 'Pairs Trading', category: '', stack: [], summary: 'Python stock-pair research using correlation, cointegration tests, spread signals, and historical backtesting.', features: [], github: 'https://github.com/gabrieldcruz/Pairs-Trading' },
  { id: 'personalwebsite', name: 'Personal Website', category: '', stack: [], summary: 'A Persona-inspired Svelte portfolio with keyboard navigation, responsive layouts, and audio and motion controls.', features: [], github: 'https://github.com/gabrieldcruz/PersonalWebsite' },
  { id: 'wayfinder', name: 'Wayfinder', category: '', stack: [], summary: 'Arduino smart cane with ultrasonic obstacle detection, distance-based audio alerts, and Telegram SOS messages.', features: [], github: 'https://github.com/gabrieldcruz/wayfinder' },
].map(project => ({ ...project, ...projectDetails[project.id] }))
  .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));

export const skillGroups = [
  { name: 'Programming', note: 'Core languages', items: ['Python', 'C++', 'Java'] },
  { name: 'Web & data', note: 'Applications and analysis', items: ['Django', 'SQL', 'Pandas', 'NumPy', 'REST APIs'] },
  { name: 'Hardware', note: 'Beyond the screen', items: ['ESP32', 'Arduino', 'VHDL', 'Quartus'] },
];

export function externalLink(value: string): string | undefined {
  if (!value) return undefined;
  try { const url = new URL(value); return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : undefined; }
  catch { return undefined; }
}
export function resumeLink(value: string): string | undefined {
  return /^\/(?!\/)[^\s]*\.pdf$/i.test(value) ? value : externalLink(value);
}
export function emailLink(value: string): string | undefined {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(value)}`
    : undefined;
}

export function phoneLink(value: string): string | undefined {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 10) return `tel:+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `tel:+${digits}`;
  return undefined;
}
