import {
  Hourglass,
  FileText,
  UserCheck,
  Ban,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import type { JobStage, JobStatus } from "@/types/my-jobs";

/**
 * Icons for each application stage.
 */
export const STAGE_ICONS: Record<JobStage, JSX.Element> = {
  none: <Hourglass className="h-4 w-4 mr-2" />,
  applied: <FileText className="h-4 w-4 mr-2" />,
  interviewing: <UserCheck className="h-4 w-4 mr-2" />,
  offer: <DollarSign className="h-4 w-4 mr-2" />,
  hired: <CheckCircle className="h-4 w-4 mr-2" />,
  rejected: <Ban className="h-4 w-4 mr-2" />,
};

/**
 * Background colors for each application stage accent bar.
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
 * Stage selector options, including "All".
 */
export const STAGE_OPTIONS: Array<{
  value: JobStage | "__all__";
  label: string;
}> = [
  { value: "__all__", label: "All" },
  { value: "none", label: "None" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
];

/**
 * Status selector options, omitting "trash" (never shown).
 */
export const STATUS_OPTIONS: Array<{
  value: JobStatus | "__active__";
  label: string;
}> = [
  { value: "__active__", label: "Active" },
  { value: "new", label: "New" },
  { value: "saved", label: "Saved" },
  { value: "not_interested", label: "Not Interested" },
  { value: "not_relevant", label: "Not Relevant" },
];
