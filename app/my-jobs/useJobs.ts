"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseBrowser";
import { useSession } from "@/hooks/useSession";
import { toast } from "sonner";
import type { Job, JobStage, JobStatus } from "@/types/my-jobs";

/**
 * Hook that manages fetching, updating, and tracking new job count.
 */
export function useJobs() {
  const { session } = useSession();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newCount, setNewCount] = useState<number>(0);

  const fetchJobs = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);

    try {
      const { data: metaRows, error: metaError } = await supabase
        .from("user_jobs")
        .select("job_id, status, stage")
        .eq("user_id", session.user.id);
      if (metaError) throw metaError;

      const ids = metaRows.map((r) => r.job_id);
      if (ids.length === 0) {
        setJobs([]);
        setNewCount(0);
        return;
      }

      const { data: jobRows, error: jobError } = await supabase
        .from("jobs")
        .select(
          `job_id, title, company_name, location, salary, application_url, description`
        )
        .in("job_id", ids);
      if (jobError) throw jobError;

      const metaMap = Object.fromEntries(
        metaRows.map((r) => [r.job_id, r])
      );
      const merged: Job[] = (jobRows || []).map((job) => ({
        ...job,
        ...metaMap[job.job_id],
      }));

      setJobs(merged);
      setNewCount(merged.filter((j) => j.status === "new").length);
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
    async (jobId: string, status: JobStatus): Promise<boolean> => {
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
      await fetchJobs();
      toast.success("Status updated");
      return true;
    },
    [session, fetchJobs]
  );

  const updateStage = useCallback(
    async (jobId: string, stage: JobStage): Promise<boolean> => {
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
      await fetchJobs();
      toast.success("Stage updated");
      return true;
    },
    [session, fetchJobs]
  );

  // granular archive actions for analytics
  const markNotInterested = useCallback(
    async (jobId: string): Promise<boolean> =>
      updateStatus(jobId, "not_interested"),
    [updateStatus]
  );

  const markNotRelevant = useCallback(
    async (jobId: string): Promise<boolean> =>
      updateStatus(jobId, "not_relevant"),
    [updateStatus]
  );

  const trashJob = markNotRelevant;

  const markAllSeen = useCallback(
    async (): Promise<boolean> => {
      if (!session) return false;
      const { error } = await supabase
        .from("user_jobs")
        .update({ status: "saved" })
        .eq("user_id", session.user.id)
        .eq("status", "new");
      if (error) {
        toast.error("Error marking all seen");
        return false;
      }
      await fetchJobs();
      return true;
    },
    [session, fetchJobs]
  );

  return {
    jobs,
    loading,
    error,
    newCount,
    refresh: fetchJobs,
    updateStatus,
    updateStage,
    markNotInterested,
    markNotRelevant,
    trashJob,
    markAllSeen,
  };
}
