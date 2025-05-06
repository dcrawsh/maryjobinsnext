'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useState } from 'react';
import { useSession } from '@/hooks/useSession';

/* ────────── schema ────────── */
const schema = z.object({
  job_title: z.string().min(2),
  years_of_experience: z.string(),
  location: z.string().min(2),
  skill_level: z.string(),
  remote_preference: z.string(),
  resume_data: z
    .string()
    .min(10, 'Please paste at least 10 characters of your resume'),
});
type FormValues = z.infer<typeof schema>;

export default function JobSearchForm() {
  const { session } = useSession({ isProtectedRoute: false });
  const [saving, setSaving] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      job_title: '',
      years_of_experience: '',
      location: '',
      skill_level: '',
      remote_preference: '',
      resume_data: '',
    },
  });

  // Dropzone config
  const onDrop = async (files: File[]) => {
    const file = files[0];
    setFileError(null);
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setParsing(true);
    try {
      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Parsing failed');
      form.setValue('resume_data', data.text);
      toast.success('✅ Resume parsed! You can edit it below.');
    } catch (err: any) {
      console.error(err);
      setFileError(err.message);
      toast.error('Resume parsing failed. Please paste manually.');
    } finally {
      setParsing(false);
    }
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
      'text/plain': [],
    },
    maxSize: 5 * 1024 * 1024, // 5 MB
    multiple: false,
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0].errors[0];
      let message = 'Unsupported file type. Only PDF, DOCX, and TXT files are allowed.';
    
      if (error.code === 'file-too-large') {
        message = 'File too large. Please upload a file smaller than 5MB.';
      }
    
      setFileError(message);
      toast.error(message);
    },
  });

  async function onSubmit(values: FormValues) {
    if (!session?.user) {
      toast.error('Please sign in');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        user_id: session.user.id,
        searches: [
          {
            job_title: values.job_title,
            years_of_experience: values.years_of_experience,
            location: values.location,
            skill_level: values.skill_level,
            remote_preference: values.remote_preference,
            resume_data: values.resume_data,
          },
        ],
      };

      const res = await fetch('/api/process-searches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error('API error:', await res.text());
        throw new Error('Job search failed');
      }

      const jobs = await res.json();
      console.log('Fetched jobs:', jobs);
      toast.success('Jobs fetched!');
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error('Could not fetch jobs');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Job Title */}
        <FormField
          control={form.control}
          name="job_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Software Engineer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Years of Experience */}
        <FormField
          control={form.control}
          name="years_of_experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0-1">0 – 1</SelectItem>
                  <SelectItem value="1-3">1 – 3</SelectItem>
                  <SelectItem value="3-5">3 – 5</SelectItem>
                  <SelectItem value="5-10">5 – 10</SelectItem>
                  <SelectItem value="10+">10+</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Portland, OR" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Skill Level */}
        <FormField
          control={form.control}
          name="skill_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skill Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="entry">Entry</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Remote Preference */}
        <FormField
          control={form.control}
          name="remote_preference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remote Preference</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="onsite">On-site</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Resume Drag & Drop */}
        <FormField
          control={form.control}
          name="resume_data"
          render={() => (
            <FormItem>
              <FormLabel>Resume</FormLabel>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed p-6 text-center ${
                  isDragActive ? 'border-blue-500' : 'border-gray-300'
                } rounded`}
              >
                <input {...getInputProps()} />
                {parsing
                  ? 'Parsing your resume…'
                  : isDragActive
                  ? 'Drop it here!'
                  : 'Drag & drop a PDF, DOCX, or TXT resume here, or click to select'}
              </div>
              {fileError && (
                <p className="text-red-600 text-sm mt-1">{fileError}</p>
              )}
              <FormControl>
                <Textarea
                  placeholder="Or paste your resume text here"
                  {...form.register('resume_data')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={saving} className="w-full">
          {saving ? 'Sending…' : 'Find Jobs'}
        </Button>
      </form>
    </Form>
  );
}
