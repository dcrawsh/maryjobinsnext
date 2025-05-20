'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Briefcase } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useSession } from '@/hooks/useSession';
import { toast } from 'sonner';

// ────────── Types ──────────
type QuizValues = {
  job_title: string;
  alternate_titles: string[];
  tech_skills: string[];
  years_of_experience: string;
  location: string;
  skill_level: string;
  remote_preference: string;
  resume_data: string;
};

type Step = {
  id: keyof QuizValues;
  title: string;
  type: 'text' | 'related' | 'multi-select' | 'select' | 'file';
  placeholder?: string;
  hint?: string;
  options?: { value: string; label: string }[];
  max?: number;
};

// ────────── Steps ──────────
const quizSteps: Step[] = [
  { id: 'job_title', title: 'Your Ideal Role', type: 'text', placeholder: 'Software Engineer', hint: 'Start typing; we’ll suggest related titles.' },
  { id: 'alternate_titles', title: 'Related Titles', type: 'related', hint: 'Select up to 3 related titles.', max: 3 },
  { id: 'tech_skills', title: 'Your Tech Skills', type: 'multi-select', hint: 'Pick up to 5 technical skills.', max: 5 },
  { id: 'years_of_experience', title: 'Experience Level', type: 'select', hint: 'Choose the range that matches you.', options: [
      { value: '0-1', label: '0 – 1' },
      { value: '1-3', label: '1 – 3' },
      { value: '3-5', label: '3 – 5' },
      { value: '5-10', label: '5 – 10' },
      { value: '10+', label: '10+' },
    ]
  },
  { id: 'location', title: 'Location', type: 'text', placeholder: 'e.g. Portland, OR', hint: '' },
  { id: 'skill_level', title: 'Skill Level', type: 'select', hint: 'How senior are you?', options: [
      { value: 'entry', label: 'Entry' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'senior', label: 'Senior' },
      { value: 'lead', label: 'Lead' },
    ]
  },
  { id: 'remote_preference', title: 'Remote Preference', type: 'select', hint: 'Where would you like to work?', options: [
      { value: 'remote', label: 'Remote' },
      { value: 'hybrid', label: 'Hybrid' },
      { value: 'onsite', label: 'On-site' },
      { value: 'flexible', label: 'Flexible' },
    ]
  },
  { id: 'resume_data', title: 'Your Resume', type: 'file', hint: 'Drag & drop a PDF here, or paste text below.' },
];

export default function JobSearchQuiz() {
  const { session } = useSession({ isProtectedRoute: false });
  const [step, setStep] = useState(0);
  const [options, setOptions] = useState<{ code: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, watch, setValue, getValues } = useForm<QuizValues>({
    defaultValues: {
      job_title: '',
      alternate_titles: [],
      tech_skills: [],
      years_of_experience: '',
      location: '',
      skill_level: '',
      remote_preference: '',
      resume_data: '',
    },
  });

  const current = quizSteps[step];
  const jobTitle = watch('job_title');
  const altCodes = watch('alternate_titles');

  // ──────── Fetch suggestions ────────
  useEffect(() => {
    let url: string | null = null;
    if (current.id === 'alternate_titles') {
      if (jobTitle.trim().length < 2) return setOptions([]);
      url = `/api/alternate-titles?query=${encodeURIComponent(jobTitle.trim())}`;
    } else if (current.id === 'tech_skills') {
      if (!jobTitle.trim()) return setOptions([]);
      const params = new URLSearchParams({ title: jobTitle.trim() });
      if (altCodes.length) params.set('codes', altCodes.join(','));
      url = `/api/tech-skills?${params.toString()}`;
    } else {
      return setOptions([]);
    }

    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((body) => {
        if (body.titles) {
          setOptions(body.titles.map((t: string) => ({ code: t, name: t })));
        } else if (body.tools) {
          setOptions(body.tools);
        } else {
          setOptions([]);
        }
      })
      .catch(() => setOptions([]))
      .finally(() => setLoading(false));
  }, [current.id, jobTitle, altCodes]);

  // ──────── Resume dropzone ────────
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (files) => {
      const file = files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/parse-resume', { method: 'POST', body: formData });
        const body = await res.json();
        setValue('resume_data', body.text);
      } catch {}
    },
    multiple: false,
    accept: { 'application/pdf': [], 'text/plain': [] },
  });

  // ──────── Handle next & submit ────────
  const onNext = async (data: QuizValues) => {
    if (
      (current.id === 'alternate_titles' && data.alternate_titles.length === 0) ||
      (current.id === 'tech_skills' && data.tech_skills.length === 0)
    ) {
      return;
    }

    setValue(current.id, data[current.id]);

    if (step === quizSteps.length - 1) {
      if (!session?.access_token) {
        toast.error('Please sign in to continue');
        return;
      }
      try {
        const payload = { searches: [getValues()] };
        const res = await fetch('/api/process-searches', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await res.text());
        const jobs = await res.json();
        toast.success(`Found ${jobs.length} jobs!`);
        console.log('Jobs:', jobs);
      } catch (err: any) {
        console.error(err);
        toast.error('Failed to fetch jobs');
      }
      return;
    }

    setStep((prev) => prev + 1);
  };

  // ──────── Render field ────────
  const renderField = () => {
    switch (current.type) {
      case 'text':
        return (
          <Controller
            name={current.id}
            control={control}
            rules={{ required: true }}
            render={({ field }) => <Input {...field} placeholder={current.placeholder} />}
          />
        );
      case 'related':
        if (loading) return <p>Loading…</p>;
        return (
          <Controller
            name="alternate_titles"
            control={control}
            render={({ field }) => (
              <div className="max-h-60 overflow-y-auto space-y-2">
                {options.map((opt) => {
                  const val = opt.name;
                  const selected = field.value.includes(val);
                  const toggle = () => {
                    const next = selected
                      ? field.value.filter((v) => v !== val)
                      : [...field.value, val].slice(0, current.max);
                    field.onChange(next);
                  };
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={toggle}
                      className={`w-full text-left px-3 py-2 border rounded ${
                        selected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      {opt.name}
                    </button>
                  );
                })}
              </div>
            )}
          />
        );
      case 'multi-select':
        if (loading) return <p>Loading…</p>;
        return (
          <Controller
            name="tech_skills"
            control={control}
            render={({ field }) => (
              <div className="max-h-60 overflow-y-auto space-y-2">
                {options.map((opt) => {
                  const val = opt.name;
                  const selected = field.value.includes(val);
                  const toggle = () => {
                    const next = selected
                      ? field.value.filter((v) => v !== val)
                      : [...field.value, val].slice(0, current.max);
                    field.onChange(next);
                  };
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={toggle}
                      className={`w-full text-left px-3 py-2 border rounded ${
                        selected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      {opt.name}
                    </button>
                  );
                })}
              </div>
            )}
          />
        );
      case 'select':
        return (
          <Controller
            name={current.id}
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {current.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        );
      case 'file':
        return (
          <>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed p-6 text-center ${
                isDragActive ? 'border-blue-500' : 'border-gray-300'
              } rounded`}
            >
              <input {...getInputProps()} />
              {isDragActive
                ? 'Drop your resume…'
                : 'Drag & drop a PDF here, or click to upload'}
            </div>
            <Controller
              name="resume_data"
              control={control}
              rules={{ minLength: 10 }}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="Or paste your resume text here"
                  className="w-full border p-2 rounded mt-2"
                />
              )}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow space-y-6">
      {/* Step dots */}
      <div className="flex justify-center space-x-2">
        {quizSteps.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setStep(idx)}
            className={`w-3 h-3 rounded-full transition ${
              idx === step ? 'bg-primary' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex justify-center">
          <Briefcase className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-center">{current.title}</h2>
        {current.hint && <p className="text-sm text-muted-foreground">{current.hint}</p>}

        <form onSubmit={handleSubmit(onNext)} className="space-y-4">
          {renderField()}
          <Button type="submit" className="w-full">
            {step < quizSteps.length - 1 ? 'Next' : 'Finish'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
