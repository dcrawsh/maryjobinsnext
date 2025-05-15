'use client';

import { useState, useEffect } from 'react';
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

type Step = {
  id: keyof QuizValues;
  title: string;
  type: 'text' | 'related' | 'multi-select' | 'select';
  label: string;
  placeholder?: string;
  hint: string;
  max?: number;
};

const quizSteps: Step[] = [
  {
    id: 'job_title',
    title: 'Your Ideal Role',
    type: 'text',
    label: 'What job title are you aiming for?',
    placeholder: 'Software Engineer',
    hint: 'Start typing; we’ll suggest related titles.',
  },
  {
    id: 'related_titles',
    title: 'Related Titles',
    type: 'related',
    label: 'Select up to 3 related titles',
    hint: 'Pick titles you might also consider.',
    max: 3,
  },
  {
    id: 'tech_skills',
    title: 'Your Tech Skills',
    type: 'multi-select',
    label: 'Pick up to 5 technical skills',
    hint: 'Select skills you have experience with.',
    max: 5,
  },
  {
    id: 'experience',
    title: 'Experience Level',
    type: 'select',
    label: 'Years of Experience',
    hint: 'Choose the range that matches you.',
  },
  // remote, hybrid, on-site
  // location
];

type QuizValues = {
  job_title: string;
  related_titles: string[];
  tech_skills: string[];
  experience: string;
};

export default function JobSearchQuiz() {
  const [step, setStep] = useState(0);
  const [options, setOptions] = useState<{ code: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
  } = useForm<QuizValues>({
    defaultValues: {
      job_title: '',
      related_titles: [],
      tech_skills: [],
      experience: '',
    },
  });

  const jobTitle = watch('job_title');
  const relatedCodes = watch('related_titles');
  const current = quizSteps[step];

  useEffect(() => {
    let url: string | null = null;

    if (current.id === 'related_titles') {
      if (jobTitle.trim().length < 2) {
        setOptions([]);
        return;
      }
      url = `/api/alternate-titles?query=${encodeURIComponent(jobTitle.trim())}`;
    } else if (current.id === 'tech_skills') {
      if (!jobTitle.trim()) {
        setOptions([]);
        return;
      }
      const params = new URLSearchParams();
      params.set('title', jobTitle.trim());
      if (relatedCodes.length) {
        params.set('codes', relatedCodes.join(','));
      }
      url = `/api/tech-skills?${params.toString()}`;
    } else {
      setOptions([]);
      return;
    }

    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((body) => {
        if ('titles' in body) {
          setOptions(
            body.titles.map((t: string) => ({ code: t, name: t }))
          );
        } else if ('tools' in body) {
            setOptions(body.tools);
          } else {
            setOptions([]);
          }
      })
      .catch(() => setOptions([]))
      .finally(() => setLoading(false));
  }, [current.id, jobTitle, relatedCodes]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => console.log('AI takeover with', files[0]),
    multiple: false,
    accept: { 'application/pdf': [], 'text/plain': [] },
  });

  const onNext = (data: QuizValues) => {
    if (
      (current.id === 'related_titles' && data.related_titles.length === 0) ||
      (current.id === 'tech_skills' && data.tech_skills.length === 0)
    ) {
      return;
    }
    setValue(current.id, data[current.id]);
    if (step < quizSteps.length - 1) {
      setStep(step + 1);
    } else {
      console.log('Final quiz values:', getValues());
    }
  };

  const renderField = () => {
    switch (current.type) {
      case 'text':
        return (
          <Controller
            name="job_title"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input {...field} placeholder={current.placeholder} />
            )}
          />
        );

      case 'related':
      case 'multi-select':
        return loading ? (
          <p>Loading…</p>
        ) : (
          <Controller
            name={current.id}
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-1 gap-2">
                {options.map((opt) => {
                  const selected = field.value.includes(opt.code);
                  const toggle = () => {
                    const next = selected
                      ? Array.isArray(field.value) ? field.value.filter((c: string) => c !== opt.code) : []
                      : [...(Array.isArray(field.value) ? field.value : []), opt.code].slice(0, current.max);
                    field.onChange(next);
                  };
                  return (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={toggle}
                      className={`px-3 py-2 border rounded w-full text-left ${
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
            name="experience"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {['0-1', '1-3', '3-5', '5-10', '10+'].map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
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
        <p className="text-sm text-muted-foreground">{current.hint}</p>

        <form onSubmit={handleSubmit(onNext)} className="space-y-4">
          {renderField()}
          <Button type="submit" className="w-full">
            {step < quizSteps.length - 1 ? 'Next' : 'Finish'}
          </Button>
        </form>

        <div
          {...getRootProps()}
          className="mt-4 text-center border-2 border-dashed p-4 rounded"
        >
          <input {...getInputProps()} />
          {isDragActive
            ? 'Drop resume for AI magic…'
            : 'Drag & drop resume here for AI magic'}
        </div>
      </motion.div>
    </div>
  );
}