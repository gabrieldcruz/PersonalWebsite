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
  school: 'Georgia Tech',
  degree: 'Computer Science + Mathematics',
  year: 'Junior',
  expectedGraduation: '2028',
  focus: 'Software engineering / Systems / Embedded',
  intro: 'Computer Science and Mathematics student at Georgia Tech.',
  bio: 'Hey — I’m Gabriel Cruz. I’m a Computer Science and Mathematics student at Georgia Tech who genuinely enjoys building things that are challenging.',
  background: 'I worked as an intern at Johns Hopkins Applied Physics Laboratory.',
  internshipDates: 'June 2023 – May 2024',
  internshipLocation: 'Laurel, MD',
  interests: 'I enjoy watching soccer and football, playing basketball, doing puzzles, and listening to music.',
  phone: '240-810-4092',
  github: '',
  linkedin: '',
  email: 'gabriel.david.cruz12@gmail.com',
  resume: '', // Add a file to static/resume.pdf, then set this to '/resume.pdf'.
};

export const options: OptionValue[] = [
  { id: 'about', name: 'ABOUT ME', rotation: -19, zIndex: 5, offsetX: 0, offsetY: 0, description: 'Meet the person behind the projects.' },
  { id: 'projects', name: 'PROJECTS', rotation: -12, zIndex: 4, offsetX: 24, offsetY: -4, description: 'Explore web apps, trading automation, and embedded hardware.' },
  { id: 'skills', name: 'SKILLS', rotation: -16, zIndex: 3, offsetX: -12, offsetY: -5, description: 'The languages and tools I build with.' },
  { id: 'resume', name: 'RESUME', rotation: -6, zIndex: 2, offsetX: 18, offsetY: -3, description: 'My background, project experience, and next chapter.' },
  { id: 'links', name: 'LINKS', rotation: 7, zIndex: 1, offsetX: 38, offsetY: 0, description: 'Find my code or get in touch.' },
];

export const projects = [
  { name: 'Movies Store', category: 'FULL-STACK WEB APPLICATION', stack: ['Python', 'Django', 'SQLite'], summary: 'A movie application with search, accounts, reviews, and threaded conversations.', features: ['Search movies and open detailed listings.', 'Create and edit reviews through user accounts.', 'Organize replies with parent-linked database records.'], github: '', demo: '' },
  { name: 'Pairs Trading Bot', category: 'DATA & AUTOMATION', stack: ['Python', 'Pandas', 'Statsmodels', 'Alpaca API'], summary: 'A research and paper-trading pipeline that turns statistical relationships into trading signals.', features: ['Separate data loading, signal generation, and backtesting.', 'Screen pairs for correlation and cointegration.', 'Connect signals to Alpaca paper trading.'], github: '', demo: '' },
  { name: 'Smart Cane', category: 'EMBEDDED PROTOTYPE', stack: ['C++', 'ESP32', 'Ultrasonic sensors'], summary: 'A cane attachment prototype that detects obstacles and provides distance-based audible feedback.', features: ['Read ultrasonic sensors and translate proximity into audio.', 'Integrate physical buttons with ESP32 firmware.', 'Send SOS messages over Wi-Fi using Telegram.'], github: '', demo: '' },
];

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
