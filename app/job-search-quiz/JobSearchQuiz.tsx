"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Briefcase,
  List,
  Code,
  Calendar,
  MapPin,
  Star,
  Globe,
  FileText,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useSession } from "@/hooks/useSession";
import { toast } from "sonner";

import type { QuizValues, Step } from "./constants";
import { quizSteps } from "./constants";

// Map each step to an icon for a more visual progress indicator
const STEP_ICONS: Record<string, JSX.Element> = {
  job_title: <Briefcase className="w-5 h-5" />,
  alternate_titles: <List className="w-5 h-5" />,
  tech_skills: <Code className="w-5 h-5" />,
  years_of_experience: <Calendar className="w-5 h-5" />,
  location: <MapPin className="w-5 h-5" />,
  skill_level: <Star className="w-5 h-5" />,
  remote_preference: <Globe className="w-5 h-5" />,
  resume_data: <FileText className="w-5 h-5" />,
};

export default function JobSearchQuiz() {
  const { session } = useSession({ isProtectedRoute: true });
  const [step, setStep] = useState<number>(0);
  const [options, setOptions] = useState<{ code: string; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchOpt, setSearchOpt] = useState<string>("");
  const [showCongrats, setShowCongrats] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, watch, setValue, getValues } = useForm<QuizValues>({
    defaultValues: {
      job_title: "",
      alternate_titles: [],
      tech_skills: [],
      years_of_experience: "",
      location: "",
      skill_level: "",
      remote_preference: "",
      resume_data: "",
    },
  });

  const current: Step = quizSteps[step];
  const jobTitle = watch("job_title");
  const altCodes = watch("alternate_titles");

  useEffect(() => {
    const isAlternateTitlesStep = current.id === "alternate_titles";
    const isTechSkillsStep = current.id === "tech_skills";
  
    if (!isAlternateTitlesStep && !isTechSkillsStep) {
      setOptions([]);
      return;
    }
  
    if (isAlternateTitlesStep && jobTitle.trim().length < 2) {
      setOptions([]);
      return;
    }
  
    // Only fetch when step changes (on landing), not while toggling
    let ignore = false;
    setLoading(true);
  
    const fetchOptions = async () => {
      try {
        let url = "";
        if (isAlternateTitlesStep) {
          url = `/api/alternate-titles?query=${encodeURIComponent(jobTitle.trim())}`;
        } else {
          const params = new URLSearchParams({ title: jobTitle.trim() });
          if (altCodes.length) params.set("codes", altCodes.join(","));
          url = `/api/tech-skills?${params.toString()}`;
        }
  
        const res = await fetch(url);
        const body = await res.json();
  
        if (ignore) return;
  
        if (body.titles) {
          setOptions(body.titles.map((t: string) => ({ code: t, name: t })));
        } else if (body.tools) {
          setOptions(body.tools);
        } else {
          setOptions([]);
        }
      } catch {
        if (!ignore) setOptions([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
  
    fetchOptions();
  
    return () => {
      ignore = true;
    };
  }, [step]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (files) => {
      const file = files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/parse-resume", {
          method: "POST",
          body: formData,
        });
        const body = await res.json();
        setValue("resume_data", body.text);
      } catch {}
    },
    multiple: false,
    accept: { "application/pdf": [], "text/plain": [] },
  });

  const onNext = async (data: QuizValues) => {
    if (
      (current.id === "alternate_titles" && data.alternate_titles.length === 0) ||
      (current.id === "tech_skills" && data.tech_skills.length === 0)
    ) {
      return;
    }

    setValue(current.id, data[current.id]);

    if (step === quizSteps.length - 1) {
      if (!session?.access_token) {
        toast.error("Please sign in to continue");
        return;
      }

      setIsSubmitting(true);
      setShowCongrats(true); // Always show modal

      const payload = { searches: [getValues()] };
      fetch("/api/process-searches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      }).catch((err) => {
        console.error("Job fetch failed", err);
        toast.error("Background job sync failed");
      });

      return;
    }
    setSearchOpt("")
    setStep((prev) => prev + 1);
  };

  const renderField = () => {
    switch (current.type) {
      case "text":
        return (
          <Controller
            name={current.id}
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input {...field} placeholder={current.placeholder} />
            )}
          />
        );

      case "related":
      case "multi-select":
        if (loading) return <p>Loading…</p>;
        return (
          <Controller
            name={current.id}
            control={control}
            render={({ field }) => {
              const values = Array.isArray(field.value) ? field.value : [];
              const filtered = options.filter((opt) =>
                opt.name.toLowerCase().includes(searchOpt.toLowerCase())
              );
              return (
                <>
                  <Input
                    value={searchOpt}
                    onChange={(e) => setSearchOpt(e.target.value)}
                    placeholder="Search..."
                    className="mb-2"
                  />
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {filtered.map((opt) => {
                      const val = opt.name;
                      const selected = values.includes(val);
                      const toggle = () => {
                        const next = selected
                          ? values.filter((v: string) => v !== val)
                          : [...values, val].slice(0, current.max);
                        field.onChange(next);
                      };
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={toggle}
                          className={`w-full text-left px-3 py-2 border rounded ${
                            selected
                              ? "bg-primary text-primary-foreground"
                              : "bg-white hover:bg-gray-50"
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </>
              );
            }}
          />
        );

      case "select":
        return (
          <Controller
            name={current.id}
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value as string}>
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

      case "file":
        return (
          <>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed p-6 text-center rounded-lg space-y-2 ${
                isDragActive ? "border-blue-500" : "border-gray-300"
              }`}
            >
              <input {...getInputProps()} />
              <p className="text-lg">
                {isDragActive
                  ? "Drop your resume…"
                  : "Drag & drop a PDF here, or click to upload"}
              </p>
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

  const renderSteps = () => (
    <div className="flex justify-center items-center space-x-4 mb-4">
      {quizSteps.map((stepDef, idx) => {
        const Icon = STEP_ICONS[stepDef.id];
        const isActive = idx === step;
        return (
          <button
            key={idx}
            type="button"
            onClick={() => setStep(idx)}
            className={`p-2 rounded-full border-2 transition ${
              isActive
                ? "border-primary bg-primary text-white"
                : "border-gray-300 text-gray-500"
            }`}
          >
            {Icon}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Job Search Quiz</h1>
        {renderSteps()}
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold text-center">{current.title}</h2>
          {current.hint && (
            <p className="text-center text-muted-foreground">{current.hint}</p>
          )}

          <form onSubmit={handleSubmit(onNext)} className="space-y-4">
            {renderField()}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {step < quizSteps.length - 1 ? "Next" : isSubmitting ? "Submitting..." : "Finish"}
            </Button>
          </form>
        </motion.div>
      </div>

      {showCongrats && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full text-center space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">🎉 Congrats!</h2>
            <p className="text-gray-700">
              You've started a job search. We'll keep looking and update your notifications.
            </p>
            <a href="/my-jobs">
              <Button className="w-full">Go to My Jobs</Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
