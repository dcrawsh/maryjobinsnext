import type { JobStage, JobStatus } from "@/types/my-jobs";

/**
 * Each quiz step definition
 */
export type QuizValues = {
  job_title: string;
  alternate_titles: string[];
  tech_skills: string[];
  years_of_experience: string;
  location: string;
  skill_level: string;
  remote_preference: string;
  resume_data: string;
};

export type Step = {
  id: keyof QuizValues;
  title: string;
  type: 'text' | 'related' | 'multi-select' | 'select' | 'file';
  placeholder?: string;
  hint?: string;
  options?: { value: string; label: string }[];
  max?: number;
};

export const quizSteps: Step[] = [
  {
    id: 'job_title',
    title: 'Your Ideal Role',
    type: 'text',
    placeholder: 'Software Engineer',
    hint: 'Start typing; we’ll suggest related titles.',
  },
  {
    id: 'alternate_titles',
    title: 'Related Titles',
    type: 'related',
    hint: 'Select up to 3 related titles.',
    max: 3,
  },
  {
    id: 'tech_skills',
    title: 'Your Tech Skills',
    type: 'multi-select',
    hint: 'Pick up to 5 technical skills.',
    max: 5,
  },
  {
    id: 'years_of_experience',
    title: 'Experience Level',
    type: 'select',
    hint: 'Choose the range that matches you.',
    options: [
      { value: '0-1', label: '0 – 1' },
      { value: '1-3', label: '1 – 3' },
      { value: '3-5', label: '3 – 5' },
      { value: '5-10', label: '5 – 10' },
      { value: '10+', label: '10+' },
    ],
  },
  {
    id: 'location',
    title: 'Location',
    type: 'text',
    placeholder: 'e.g. Portland, OR',
  },
  {
    id: 'skill_level',
    title: 'Skill Level',
    type: 'select',
    hint: 'How senior are you?',
    options: [
      { value: 'entry', label: 'Entry' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'senior', label: 'Senior' },
      { value: 'lead', label: 'Lead' },
    ],
  },
  {
    id: 'remote_preference',
    title: 'Remote Preference',
    type: 'select',
    hint: 'Where would you like to work?',
    options: [
      { value: 'remote', label: 'Remote' },
      { value: 'hybrid', label: 'Hybrid' },
      { value: 'onsite', label: 'On-site' },
      { value: 'flexible', label: 'Flexible' },
    ],
  },
  {
    id: 'resume_data',
    title: 'Your Resume',
    type: 'file',
    hint: 'Drag & drop a PDF here, or paste text below.',
  },
];
