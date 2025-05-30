import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useSession } from "@/hooks/useSession";
import type { QuizValues, Step } from "./constants";
import { quizSteps } from "./constants";

export function useJobSearchQuiz() {
  const { session } = useSession({ isProtectedRoute: true });
  const [step, setStep] = useState<number>(0);
  const [options, setOptions] = useState<{ code: string; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchOpt, setSearchOpt] = useState<string>("");
  const [showCongrats, setShowCongrats] = useState(false);

  const { control, handleSubmit, watch, setValue, getValues, formState } = useForm<QuizValues>({
    mode: "onChange",
    reValidateMode: "onChange",
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

  const { isValid, isSubmitting } = formState;
  const current: Step = quizSteps[step];
  const jobTitle = watch("job_title");
  const altCodes = watch("alternate_titles");

  // fetch suggestions on step change
  useEffect(() => {
    const isAlt = current.id === "alternate_titles";
    const isTech = current.id === "tech_skills";
    if (!isAlt && !isTech) return setOptions([]);
    if (isAlt && jobTitle.trim().length < 2) return setOptions([]);
    let ignore = false;
    setLoading(true);
    (async () => {
      try {
        let url = isAlt
          ? `/api/alternate-titles?query=${encodeURIComponent(jobTitle.trim())}`
          : `/api/tech-skills?${new URLSearchParams({ title: jobTitle.trim(), codes: altCodes.join(",") }).toString()}`;
        const res = await fetch(url);
        const body = await res.json();
        if (ignore) return;
        setOptions(body.titles ? body.titles.map((t: string) => ({ code: t, name: t })) : body.tools || []);
      } catch {
        if (!ignore) setOptions([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [step]);

  // dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: { "application/pdf": [], "text/plain": [] },
    onDrop: async files => {
      const file = files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/parse-resume", { method: "POST", body: formData });
        const body = await res.json();
        setValue("resume_data", body.text);
      } catch {}
    }
  });

  const onNext = (data: QuizValues) => {
    if ((current.id === "alternate_titles" && data.alternate_titles.length === 0) ||
        (current.id === "tech_skills" && data.tech_skills.length === 0)) {
      return;
    }
    setValue(current.id, data[current.id]);
    if (step === quizSteps.length - 1) {
      if (!session?.access_token) {
        toast.error("Please sign in to continue");
        return;
      }
      setShowCongrats(true);
      fetch("/api/process-searches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ searches: [getValues()] }),
      }).catch(err => {
        console.error("Job fetch failed", err);
        toast.error("Background job sync failed");
      });
      return;
    }
    setSearchOpt("");
    setStep(prev => prev + 1);
  };

  return {
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
  };
}