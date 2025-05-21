// Types for MyJobsPage

/**
 * Represents a single job listing combined with user metadata.
 */
export interface Job {
  job_id: string;
  title: string;
  company_name: string;
  location: string;
  salary: string;
  application_url: string;
  description: string;
  status: JobStatus | null;
  stage: JobStage | null;
}

/**
 * All possible user-facing statuses for a job.
 */
export type JobStatus =
  | "new"
  | "saved"
  | "not_interested"
  | "not_relevant"
  | "trash";

/**
 * All possible application stages for a job.
 */
export type JobStage =
  | "none"
  | "applied"
  | "interviewing"
  | "offer"
  | "hired"
  | "rejected";

/**
 * Sorting options for the jobs list.
 */
export type SortBy = "newest" | "salary" | "title";

/**
 * Filter for stages; "__all__" means no stage filter.
 */
export type FilterStage = "__all__" | JobStage;

/**
 * Filter for statuses; "__active__" hides uninterested/relevant statuses.
 */
export type FilterStatus = "__active__" | "not_interested" | "not_relevant";
