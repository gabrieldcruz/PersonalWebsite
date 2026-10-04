import { projectDetails } from './projectDetails';

export interface Skill {
  id: string;
  name: string;
  group: 'Programming' | 'Web & data' | 'Hardware';
  monogram: string;
  accent: string;
  summary: string;
  focus: string[];
  projectIds: string[];
}

function projectsUsing(...tools: string[]): string[] {
  const names = tools.map(tool => tool.toLowerCase());
  return Object.entries(projectDetails)
    .filter(([, project]) => project.stack.some(tool => names.includes(tool.toLowerCase())))
    .map(([id]) => id);
}

// Project associations come from the recorded stacks, not proficiency ratings.
// Skills without a matching project remain available with an empty project list.
export const skills: Skill[] = [
  {
    id: 'python',
    name: 'Python',
    group: 'Programming',
    monogram: 'Py',
    accent: '#f7e56b',
    summary: 'Build data analysis workflows, predictive models, and API backends across research and software projects.',
    focus: ['Data analysis', 'Modeling', 'API backends'],
    projectIds: projectsUsing('Python'),
  },
  {
    id: 'cpp',
    name: 'C++',
    group: 'Programming',
    monogram: 'C++',
    accent: '#ef4bd1',
    summary: 'Implement numerical algorithms, benchmark performance, and control sensors in embedded prototypes.',
    focus: ['Algorithms', 'Simulation', 'Embedded systems'],
    projectIds: projectsUsing('C++'),
  },
  {
    id: 'java',
    name: 'Java',
    group: 'Programming',
    monogram: 'Jv',
    accent: '#4f85ff',
    summary: 'Object-oriented programming with typed classes, collections, and reusable components.',
    focus: ['Object-oriented design', 'Collections', 'Typed programs'],
    projectIds: projectsUsing('Java'),
  },
  {
    id: 'django',
    name: 'Django',
    group: 'Web & data',
    monogram: 'Dj',
    accent: '#46e3c6',
    summary: 'Build a movie storefront with accounts, reviews, shopping carts, and order history.',
    focus: ['Web applications', 'Accounts', 'Persistence'],
    projectIds: projectsUsing('Django'),
  },
  {
    id: 'sql',
    name: 'SQL',
    group: 'Web & data',
    monogram: 'SQL',
    accent: '#f45674',
    summary: 'Work with relational data behind movie orders, pantry items, and grocery tools in SQLite-backed applications.',
    focus: ['Relational data', 'Queries', 'Persistence'],
    projectIds: projectsUsing('SQLite'),
  },
  {
    id: 'pandas',
    name: 'Pandas',
    group: 'Web & data',
    monogram: 'Pd',
    accent: '#fea948',
    summary: 'Prepare clinical, football, and market datasets for modeling, comparison, and historical analysis.',
    focus: ['Tabular data', 'Preprocessing', 'Time series'],
    projectIds: projectsUsing('pandas'),
  },
  {
    id: 'numpy',
    name: 'NumPy',
    group: 'Web & data',
    monogram: 'Np',
    accent: '#c6bbff',
    summary: 'Use numerical arrays and calculations in football prediction, option pricing, and trading research.',
    focus: ['Arrays', 'Numerical computing', 'Vector operations'],
    projectIds: projectsUsing('NumPy'),
  },
  {
    id: 'rest-apis',
    name: 'REST APIs',
    group: 'Web & data',
    monogram: 'API',
    accent: '#94f6ff',
    summary: 'Connect application backends and external services through FastAPI endpoints and Telegram alerts.',
    focus: ['HTTP', 'API backends', 'Service integrations'],
    projectIds: projectsUsing('FastAPI', 'Telegram Bot API'),
  },
  {
    id: 'esp32',
    name: 'ESP32',
    group: 'Hardware',
    monogram: 'ESP',
    accent: '#f7e56b',
    summary: 'Combine obstacle sensing, audio feedback, and Wi-Fi SOS messages in the Wayfinder smart cane.',
    focus: ['Wi-Fi', 'Sensor input', 'Embedded tasks'],
    projectIds: projectsUsing('ESP32'),
  },
  {
    id: 'arduino',
    name: 'Arduino',
    group: 'Hardware',
    monogram: 'Ar',
    accent: '#46e3c6',
    summary: 'Prototype Wayfinder’s ultrasonic sensing and distance-based audio alerts with the Arduino toolchain.',
    focus: ['Prototyping', 'Sensor input', 'Audio alerts'],
    projectIds: projectsUsing('Arduino'),
  },
  {
    id: 'vhdl',
    name: 'VHDL',
    group: 'Hardware',
    monogram: 'Vh',
    accent: '#f45674',
    summary: 'Describe digital circuits and their behavior for hardware design and simulation.',
    focus: ['Digital logic', 'Hardware description', 'Simulation'],
    projectIds: projectsUsing('VHDL'),
  },
  {
    id: 'quartus',
    name: 'Quartus',
    group: 'Hardware',
    monogram: 'Qt',
    accent: '#fea948',
    summary: 'Tools for designing, synthesizing, and compiling FPGA logic.',
    focus: ['FPGA tools', 'Synthesis', 'Logic design'],
    projectIds: projectsUsing('Quartus'),
  },
];
