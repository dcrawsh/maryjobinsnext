import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseBrowser";
import { useSession } from "@/hooks/useSession";
import { toast } from "sonner";
import type { Job, JobStage, JobStatus } from "@/types/my-jobs";

/**
 * Hook that manages fetching and updating user jobs.
 */
export function useJobs() {
  const { session } = useSession();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);

    try {
      // Fetch user_job metadata
      const { data: metaRows, error: metaError } = await supabase
        .from("user_jobs")
        .select("job_id, status, stage")
        .eq("user_id", session.user.id);
      if (metaError) throw metaError;

      const ids = metaRows.map((r) => r.job_id);
      if (ids.length === 0) {
        setJobs([]);
        return;
      }

      // Fetch full job details
      const { data: jobRows, error: jobError } = await supabase
        .from("jobs")
        .select(
          `job_id, title, company_name, location, salary, application_url, description`
        )
        .in("job_id", ids);
      if (jobError) throw jobError;

      // Merge metadata into job objects
      const metaMap = Object.fromEntries(
        metaRows.map((r) => [r.job_id, r])
      );

      setJobs(
        (jobRows || []).map((job) => ({ ...job, ...metaMap[job.job_id] }))
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const updateStatus = useCallback(
    async (jobId: string, status: JobStatus) => {
      if (!session) return false;
      const { error } = await supabase
        .from("user_jobs")
        .update({ status })
        .eq("user_id", session.user.id)
        .eq("job_id", jobId);
      if (error) {
        toast.error("Error updating status");
        return false;
      }
      setJobs((prev) =>
        prev.map((j) => (j.job_id === jobId ? { ...j, status } : j))
      );
      toast.success("Status updated");
      return true;
    },
    [session]
  );

  const updateStage = useCallback(
    async (jobId: string, stage: JobStage) => {
      if (!session) return false;
      const { error } = await supabase
        .from("user_jobs")
        .update({ stage })
        .eq("user_id", session.user.id)
        .eq("job_id", jobId);
      if (error) {
        toast.error("Error updating stage");
        return false;
      }
      setJobs((prev) =>
        prev.map((j) => (j.job_id === jobId ? { ...j, stage } : j))
      );
      toast.success("Stage updated");
      return true;
    },
    [session]
  );

  const trashJob = useCallback(
    async (jobId: string) => {
      const success = await updateStatus(jobId, "trash");
      if (success) {
        setJobs((prev) => prev.filter((j) => j.job_id !== jobId));
        toast.success("Moved to trash");
      }
      return success;
    },
    [updateStatus]
  );

  return {
    jobs,
    loading,
    error,
    refresh: fetchJobs,
    updateStatus,
    updateStage,
    trashJob,
  };
}
