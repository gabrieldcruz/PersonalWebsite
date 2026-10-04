import { projectDetails } from './projectDetails';

export type SkillGroup = 'Software' | 'Systems' | 'Hardware';

export interface Skill {
  id: string;
  name: string;
  group: SkillGroup;
  monogram: string;
  accent: string;
  summary: string;
  focus: string[];
  projectIds: string[];
  evidence?: string;
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
    id: 'cpp',
    name: 'C / C++',
    group: 'Software',
    monogram: 'C++',
    accent: '#ef4bd1',
    summary: 'Build systems and embedded software, numerical algorithms, and cache-aware performance benchmarks.',
    focus: ['Systems programming', 'Algorithms', 'Benchmarking'],
    projectIds: projectsUsing('C', 'C++'),
  },
  {
    id: 'python',
    name: 'Python',
    group: 'Software',
    monogram: 'Py',
    accent: '#f7e56b',
    summary: 'Build data pipelines and predictive models in Python, with FastAPI backends and automation across research projects.',
    focus: ['FastAPI', 'Modeling', 'Automation'],
    projectIds: projectsUsing('Python'),
  },
  {
    id: 'java',
    name: 'Java',
    group: 'Software',
    monogram: 'Jv',
    accent: '#4f85ff',
    summary: 'Object-oriented programming with typed classes, collections, and reusable components.',
    focus: ['Object-oriented design', 'Collections', 'Typed programs'],
    projectIds: projectsUsing('Java'),
  },
  {
    id: 'matlab',
    name: 'MATLAB / Simulink',
    group: 'Software',
    monogram: 'M',
    accent: '#fea948',
    summary: 'Simulate 2.45 GHz and 5.8 GHz microwave signals in MATLAB/Simulink for research at Johns Hopkins APL.',
    focus: ['Signal simulation', 'MATLAB', 'Simulink'],
    projectIds: projectsUsing('MATLAB', 'Simulink'),
    evidence: 'APL internship',
  },
  {
    id: 'web-apis',
    name: 'Web & APIs',
    group: 'Software',
    monogram: 'API',
    accent: '#46e3c6',
    summary: 'Django, SQL, and REST APIs alongside React, Next.js, SvelteKit, and TypeScript for web applications.',
    focus: ['Django', 'SQL', 'REST APIs'],
    projectIds: projectsUsing('Django', 'SQLite', 'React', 'Next.js', 'SvelteKit', 'FastAPI', 'Telegram Bot API'),
  },
  {
    id: 'data-ml',
    name: 'Data & ML',
    group: 'Software',
    monogram: 'ML',
    accent: '#c6bbff',
    summary: 'NumPy, SciPy, Pandas, scikit-learn, and Plotly for data pipelines, statistical analysis, and predictive models.',
    focus: ['NumPy / SciPy', 'Pandas', 'scikit-learn / Plotly'],
    projectIds: projectsUsing('NumPy', 'SciPy', 'pandas', 'scikit-learn', 'Plotly', 'scikit-survival', 'XGBoost', 'TensorFlow.js', 'statsmodels'),
  },
  {
    id: 'freertos',
    name: 'FreeRTOS',
    group: 'Systems',
    monogram: 'RT',
    accent: '#f45674',
    summary: 'Run concurrent sensing and network tasks in Wayfinder, with responsive firmware and reliable shared state.',
    focus: ['Real-time tasks', 'Task synchronization', 'Responsive firmware'],
    projectIds: projectsUsing('FreeRTOS'),
  },
  {
    id: 'os-concurrency',
    name: 'OS & Concurrency',
    group: 'Systems',
    monogram: 'OS',
    accent: '#94f6ff',
    summary: 'Use pthreads, mutexes, and condition variables; explore scheduling, virtual memory, and cache optimization.',
    focus: ['Multithreading', 'Scheduling / memory', 'Cache performance'],
    projectIds: projectsUsing('pthreads', 'OpenMP'),
    evidence: 'OS scheduling & virtual memory simulators',
  },
  {
    id: 'linux-tools',
    name: 'Linux & Tools',
    group: 'Systems',
    monogram: '$_',
    accent: '#fea948',
    summary: 'Use Linux, Git, Make, and GDB to build software, manage source changes, and debug program behavior.',
    focus: ['Linux / Git', 'Make / GDB', 'Debugging'],
    projectIds: projectsUsing('Linux', 'Git', 'Make', 'GDB'),
  },
  {
    id: 'embedded',
    name: 'ESP32 / Arduino',
    group: 'Hardware',
    monogram: 'ESP',
    accent: '#f7e56b',
    summary: 'Integrate sensors, GPIO, interrupts, and state machines with ESP32/Arduino, Wi-Fi, and Telegram alerts.',
    focus: ['Sensor integration', 'Interrupts / GPIO', 'Wi-Fi / TLS'],
    projectIds: projectsUsing('ESP32', 'Arduino'),
  },
  {
    id: 'fpga-vhdl',
    name: 'FPGA / VHDL',
    group: 'Hardware',
    monogram: 'FPGA',
    accent: '#46e3c6',
    summary: 'Design VHDL FPGA logic with Quartus and trace Assembly-level microcoded processors in CircuitSim.',
    focus: ['VHDL / Quartus', 'CircuitSim / Assembly', 'Computer architecture'],
    projectIds: projectsUsing('FPGA', 'VHDL', 'Quartus', 'CircuitSim', 'Assembly'),
    evidence: 'Microcoded processor design',
  },
  {
    id: 'rf-microwave',
    name: 'RF & Microwave',
    group: 'Hardware',
    monogram: 'RF',
    accent: '#f45674',
    summary: 'Build WPT and EIS prototypes, tune impedance, simulate microwave signals in GNU Radio, and model Free Space Path Loss.',
    focus: ['WPT / EIS', 'Impedance tuning', 'Oscilloscope'],
    projectIds: projectsUsing('GNU Radio', 'RF', 'Wireless power transfer', 'EIS'),
    evidence: 'APL internship',
  },
];
