export interface ResumeFile {
  id: string;
  name: string;
  role: string;
  monogram: string;
  accent: string;
  summary: string;
  focus: string;
  highlights: { label: string; value: string }[];
  src: string;
  preview?: string;
  filename: string;
}

// These PDFs are byte-for-byte copies of Gabriel's existing one-page resumes.
// General: the user-provided Downloads/resume (2).pdf.
// Firmware: Gabriel_Cruz_v2.pdf, created October 1, 2026 (local time).
// The newer firmware version includes MATLAB/Simulink and the FPGA logic project.
export const resumes: ResumeFile[] = [
  {
    id: 'general',
    name: 'General Resume',
    role: 'Software, data & systems',
    monogram: 'GE',
    accent: '#35d5f1',
    summary: 'A full-stack interview app, survival prediction research, and C++ performance optimization.',
    focus: 'Software, data & performance',
    highlights: [
      { label: 'Focus', value: 'Software, data & performance' },
      { label: 'Education', value: 'Georgia Tech · CS + Mathematics' },
      { label: 'Experience', value: 'Johns Hopkins APL · Engineering intern' },
      { label: 'Tools', value: 'React · FastAPI · Python · C++' },
      { label: 'Projects', value: 'Roadrunner · Survival prediction · Matrices' }
    ],
    src: '/resumes/general-resume.pdf',
    preview: '/resumes/general-resume-preview.jpg',
    filename: 'Gabriel_Cruz_General_Resume.pdf'
  },
  {
    id: 'firmware',
    name: 'Firmware Resume',
    role: 'Embedded & hardware',
    monogram: 'FW',
    accent: '#f261b3',
    summary: 'Embedded firmware, real-time sensing, FPGA design, and RF prototyping across hardware and software.',
    focus: 'Embedded firmware & hardware integration',
    highlights: [
      { label: 'Focus', value: 'Real-time sensing & hardware integration' },
      { label: 'Education', value: 'Georgia Tech · CS + Mathematics' },
      { label: 'Experience', value: 'Johns Hopkins APL · Engineering intern' },
      { label: 'Tools', value: 'ESP32 · FreeRTOS · VHDL · MATLAB' },
      { label: 'Projects', value: 'Wayfinder · LC-5200 · FPGA logic' }
    ],
    src: '/resumes/firmware-resume.pdf',
    preview: '/resumes/firmware-resume-preview.jpg',
    filename: 'Gabriel_Cruz_Firmware_Resume.pdf'
  }
];
