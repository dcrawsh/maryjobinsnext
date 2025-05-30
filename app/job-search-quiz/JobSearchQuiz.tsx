// components/JobSearchQuiz.tsx
"use client";

import React from "react";
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
import { Controller } from "react-hook-form";
import { useJobSearchQuiz } from "./useJobSearchQuiz";
import { STEP_ICONS } from "./icon-controller";

export default function JobSearchQuiz() {
  const {
    control,
    handleSubmit,
    onNext,
    current,
    step,
    setStep,
    options,
    loading,
    searchOpt,
    setSearchOpt,
    showCongrats,
    isValid,
    isSubmitting,
    getRootProps,
    getInputProps,
    isDragActive,
    quizSteps,
  } = useJobSearchQuiz();

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
                    placeholder="Search…"
                    className="mb-2"
                  />
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {filtered.map((opt) => {
                      const val = opt.name;
                      const selected = values.includes(val);
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() =>
                            field.onChange(
                              selected
                                ? values.filter((v) => v !== val)
                                : [...values, val].slice(0, current.max)
                            )
                          }
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
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Job Search Quiz
        </h1>
        <div className="flex justify-center items-center space-x-4 mb-4">
          {quizSteps.map((s, i) => {
            const Icon = STEP_ICONS[s.id];
            const active = i === step;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setStep(i)}
                className={`p-2 rounded-full border-2 transition ${
                  active
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 text-gray-500"
                }`}
              >
                {Icon}
              </button>
            );
          })}
        </div>

        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold text-center">
            {current.title}
          </h2>
          {current.hint && (
            <p className="text-center text-muted-foreground">{current.hint}</p>
          )}

          <form onSubmit={handleSubmit(onNext)} className="space-y-4">
            {renderField()}
            <Button
              type="submit"
              className="w-full"
              disabled={!isValid || isSubmitting}
            >
              {step < quizSteps.length - 1
                ? "Next"
                : isSubmitting
                ? "Submitting..."
                : "Finish"}
            </Button>
          </form>
        </motion.div>
      </div>

      {showCongrats && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full text-center space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">🎉 Congrats!</h2>
            <p className="text-gray-700">
              You've started a job search. We'll keep looking and update your
              notifications.
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
