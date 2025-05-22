import { Hourglass, FileText, UserCheck, DollarSign, CheckCircle, Ban } from "lucide-react";
import type { JobStage, JobStatus } from "@/types/my-jobs";

/**
 * Icons for filter dropdowns and accent bars (by stage)
 */
export const STAGE_ICONS: Record<JobStage, JSX.Element> = {
  none: <Hourglass className="h-4 w-4 mr-2 text-gray-500" />,
  applied: <FileText className="h-4 w-4 mr-2 text-blue-500" />,
  interviewing: <UserCheck className="h-4 w-4 mr-2 text-yellow-500" />,
  offer: <DollarSign className="h-4 w-4 mr-2 text-green-500" />,
  hired: <CheckCircle className="h-4 w-4 mr-2 text-purple-500" />,
  rejected: <Ban className="h-4 w-4 mr-2 text-red-500" />,
};

/**
 * Background colors for filter accent bars (by stage)
 */
export const STAGE_COLORS: Record<JobStage, string> = {
  none: "bg-gray-300",
  applied: "bg-blue-300",
  interviewing: "bg-yellow-300",
  offer: "bg-green-300",
  hired: "bg-purple-300",
  rejected: "bg-red-300",
};

/**
 * Dropdown options for stage filters
 */
export const STAGE_OPTIONS: Array<{ value: JobStage | "__all__"; label: string }> = [
  { value: "__all__", label: "All" },
  { value: "none", label: "None" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
];

/**
 * Kanban lane definitions by stage
 */
export const KANBAN_STAGES: string[] = [
  "none",
  "applied",
  "interviewing",
  "offer",
  "hired",
  "rejected",
];
export const KANBAN_STAGE_LABELS: Record<string, string> = {
  none: "None",
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  hired: "Hired",
  rejected: "Rejected",
};
export const KANBAN_STAGE_ICONS: Record<string, JSX.Element> = STAGE_ICONS;

/**
 * Dropdown options for status filters
 */
export const STATUS_OPTIONS: Array<{ value: JobStatus | "__active__"; label: string }> = [
  { value: "__active__", label: "Active" },
  { value: "new", label: "New" },
  { value: "saved", label: "Saved" },
  { value: "not_interested", label: "Not Interested" },
  { value: "not_relevant", label: "Not Relevant" },
];

/**
 * Kanban lane definitions by status
 */
export const KANBAN_STATUSES: string[] = [
  "new",
  "saved",
  "not_interested",
  "not_relevant",
];
export const KANBAN_LABELS: Record<string, string> = {
  new: "New",
  saved: "Saved",
  not_interested: "Not Interested",
  not_relevant: "Not Relevant",
};
export const KANBAN_ICONS: Record<string, JSX.Element> = {
  new: <Hourglass className="h-4 w-4 text-gray-500" />,
  saved: <CheckCircle className="h-4 w-4 text-green-500" />,
  not_interested: <Ban className="h-4 w-4 text-red-500" />,
  not_relevant: <Ban className="h-4 w-4 text-red-500" />,
};
