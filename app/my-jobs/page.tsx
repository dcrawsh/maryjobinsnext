"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/lib/supabaseBrowser";
import { AnimatePresence, motion } from "framer-motion";
import DOMPurify from "dompurify";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  CheckCircle,
  FileText,
  UserCheck,
  Ban,
  Hourglass,
  ArrowDownAZ,
  ArrowUpDown,
  DollarSign,
  LayoutList,
  Columns3,
} from "lucide-react";
import JobKanbanView from "./JobKanbanView";


const isHtml = (str: string) => /<\/?[a-z][\s\S]*>/i.test(str);
interface Job {
  job_id: string;
  title: string;
  company_name: string;
  location: string;
  job_type: string;
  salary_currency: string;
  salary_min: number | null;
  salary_max: number | null;
  application_url: string;
  description: string;
  status: string | null;
  stage: string | null;
}

const STAGE_ICONS: Record<string, JSX.Element> = {
  none: <Hourglass className="h-4 w-4 mr-2" />,
  applied: <FileText className="h-4 w-4 mr-2" />,
  interviewing: <UserCheck className="h-4 w-4 mr-2" />,
  offer: <DollarSign className="h-4 w-4 mr-2" />,
  hired: <CheckCircle className="h-4 w-4 mr-2" />,
  rejected: <Ban className="h-4 w-4 mr-2" />,
};

const STAGE_COLORS: Record<string, string> = {
  none: "bg-gray-300",
  applied: "bg-blue-300",
  interviewing: "bg-yellow-300",
  offer: "bg-green-300",
  hired: "bg-purple-300",
  rejected: "bg-red-300",
};

export default function MyJobsPage() {
  const { session } = useSession();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<"newest" | "salary" | "title">("newest");
  const [filterStage, setFilterStage] = useState<string>("__all__");
  const [filterStatus, setFilterStatus] = useState<
    "__active__" | "not_interested" | "not_relevant"
  >("__active__");
  const [searchTerm, setSearchTerm] = useState("");
  const [kanbanView, setKanbanView] = useState(false);

  // Load jobs & user metadata
  useEffect(() => {
    if (!session) return;
    (async () => {
      try {
        setLoading(true);
        const { data: rows, error: err1 } = await supabase
          .from("user_jobs")
          .select("job_id, status, stage")
          .eq("user_id", session.user.id);
        if (err1) throw err1;

        const ids = rows.map((r) => r.job_id);
        if (ids.length === 0) {
          setJobs([]);
          return;
        }

        const { data: jd, error: err2 } = await supabase
          .from("jobs")
          .select(
            `
            job_id, title, company_name, location, job_type,
            salary_currency, salary_min, salary_max,
            application_url, description
          `
          )
          .in("job_id", ids);
        if (err2) throw err2;

        const meta = Object.fromEntries(rows.map((r) => [r.job_id, r]));
        setJobs((jd || []).map((j) => ({ ...j, ...meta[j.job_id] })));
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [session]);

  const toggleDescription = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleTrash = async (jobId: string) => {
    if (!window.confirm("Are you sure you want to trash this job?")) return;
    const { error } = await supabase
      .from("user_jobs")
      .update({ status: "trash" })
      .eq("user_id", session!.user.id)
      .eq("job_id", jobId);
    if (error) {
      toast.error("Failed to trash");
    } else {
      setJobs((prev) => prev.filter((j) => j.job_id !== jobId));
      toast.success("Moved to trash");
    }
  };

  const filtered = useMemo(() => {
    return jobs
      .filter((j) => {
        // never show true trash
        if (j.status === "trash") return false;

        // apply status filter
        if (filterStatus === "__active__") {
          if (j.status === "not_interested" || j.status === "not_relevant") {
            return false;
          }
        } else {
          if (j.status !== filterStatus) {
            return false;
          }
        }

        // stage & search logic
        const byStage = filterStage === "__all__" || j.stage === filterStage;
        const bySearch =
          j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          j.company_name.toLowerCase().includes(searchTerm.toLowerCase());
        return byStage && bySearch;
      })
      .sort((a, b) => {
        if (sortBy === "salary")
          return (b.salary_max || 0) - (a.salary_max || 0);
        if (sortBy === "title") return a.title.localeCompare(b.title);
        return 0;
      });
  }, [jobs, filterStage, filterStatus, sortBy, searchTerm]);

  if (!session) {
    return <p className="p-6">Please sign in to view your jobs.</p>;
  }
  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-24 rounded-lg" />
        ))}
      </div>
    );
  }
  if (error) {
    return <p className="p-6 text-red-500">Error: {error}</p>;
  }

  return (
    <div className="p-6">
      {/* Sticky Controls */}
      <div className="sticky top-0 bg-white z-10 p-4 flex flex-wrap items-center gap-3 border-b">
        <h1 className="text-2xl font-bold flex-none">My Jobs</h1>

        <input
          type="text"
          placeholder="Search…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[150px] px-3 py-1 border rounded focus:ring"
        />

        <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">
              <ArrowUpDown className="mr-2 inline" /> Newest
            </SelectItem>
            <SelectItem value="salary">
              <DollarSign className="mr-2 inline" /> Salary
            </SelectItem>
            <SelectItem value="title">
              <ArrowDownAZ className="mr-2 inline" /> Title
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStage} onValueChange={setFilterStage}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All</SelectItem>
            {Object.keys(STAGE_ICONS).map((s) => (
              <SelectItem key={s} value={s}>
                {STAGE_ICONS[s]} {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filterStatus}
          onValueChange={(val: string) =>
            setFilterStatus(
              val as "__active__" | "not_interested" | "not_relevant"
            )
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Show…" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__active__">Active</SelectItem>
            <SelectItem value="not_interested">Not Interested</SelectItem>
            <SelectItem value="not_relevant">Not Relevant</SelectItem>
          </SelectContent>
        </Select>

        <button
          onClick={() => setKanbanView((v) => !v)}
          className="flex-none flex items-center px-3 py-1 border rounded hover:bg-gray-50"
        >
          {kanbanView ? (
            <LayoutList className="mr-2" />
          ) : (
            <Columns3 className="mr-2" />
          )}
          {kanbanView ? "List View" : "Kanban View"}
        </button>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <p className="text-gray-500 mt-6">No jobs match your filters.</p>
      ) : kanbanView ? (
        <JobKanbanView
          jobs={filtered}
          onStageChange={async (jobId, newStage) => {
            const { error } = await supabase
              .from("user_jobs")
              .update({ stage: newStage })
              .eq("user_id", session.user.id)
              .eq("job_id", jobId);
            if (!error) {
              setJobs((prev) =>
                prev.map((j) =>
                  j.job_id === jobId ? { ...j, stage: newStage } : j
                )
              );
              toast.success("Stage updated");
            } else {
              toast.error("Error updating stage");
            }
          }}
        />
      ) : (
        <ul className="mt-6 space-y-6">
          <AnimatePresence initial={false}>
            {filtered.map((job) => (
              <motion.li
                key={job.job_id}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="
                  bg-white border rounded-lg shadow-sm flex overflow-hidden
                  transform transition-all duration-200
                  hover:-translate-y-0.5 hover:shadow-lg
                "
              >
                {/* Accent bar */}
                <div
                  className={`w-1 rounded-l-lg ${STAGE_COLORS[job.stage || "none"]
                    }`}
                />

                {/* Card body */}
                <div className="flex-1 p-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold">{job.title}</h2>
                      <p className="text-gray-600">{job.company_name}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="px-2 py-0.5 bg-gray-100 rounded-full text-sm">
                          {job.location}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded-full text-sm">
                          {job.job_type}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded-full text-sm">
                          {job.salary_currency}
                          {job.salary_min ?? "N/A"}
                          {job.salary_max != null
                            ? ` - ${job.salary_currency}${job.salary_max}`
                            : ""}
                        </span>
                      </div>
                    </div>
                    {job.stage && STAGE_ICONS[job.stage]}
                  </div>

                  {/* See more toggle */}
                  <button
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() => toggleDescription(job.job_id)}
                  >
                    {expanded[job.job_id] ? "Hide details" : "See more"}
                  </button>

                  {/* Animated Description */}
                  <AnimatePresence initial={false}>
                    {expanded[job.job_id] && (
                      <motion.div
                        key="desc"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-gray-700 overflow-hidden"
                      >
                        {isHtml(job.description) ? (
                          /* Render raw HTML safely */
                          <div
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(job.description),
                            }}
                          />
                        ) : (
                          /* Plain‑text fallback */
                          <p className="whitespace-pre-wrap">{job.description}</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <Select
                        value={job.status || ""}
                        onValueChange={async (newStatus) => {
                          const { error } = await supabase
                            .from("user_jobs")
                            .update({ status: newStatus })
                            .eq("user_id", session.user.id)
                            .eq("job_id", job.job_id);
                          if (!error) {
                            setJobs((prev) =>
                              prev.map((j) =>
                                j.job_id === job.job_id
                                  ? { ...j, status: newStatus }
                                  : j
                              )
                            );
                            toast.success("Status updated");
                          } else {
                            toast.error("Error updating status");
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status…" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="saved">Saved</SelectItem>
                          <SelectItem value="not_interested">
                            Not Interested
                          </SelectItem>
                          <SelectItem value="not_relevant">
                            Not Relevant
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stage
                      </label>
                      <Select
                        value={job.stage || ""}
                        onValueChange={async (newStage) => {
                          const { error } = await supabase
                            .from("user_jobs")
                            .update({ stage: newStage })
                            .eq("user_id", session.user.id)
                            .eq("job_id", job.job_id);
                          if (!error) {
                            setJobs((prev) =>
                              prev.map((j) =>
                                j.job_id === job.job_id
                                  ? { ...j, stage: newStage }
                                  : j
                              )
                            );
                            toast.success("Stage updated");
                          } else {
                            toast.error("Error updating stage");
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage…" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(STAGE_ICONS).map((s) => (
                            <SelectItem key={s} value={s}>
                              {STAGE_ICONS[s]}{" "}
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <a
                      href={job.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Apply Now
                    </a>
                    <button
                      className="text-red-600 hover:underline text-sm self-center"
                      onClick={() => handleTrash(job.job_id)}
                    >
                      🗑️ Trash
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
