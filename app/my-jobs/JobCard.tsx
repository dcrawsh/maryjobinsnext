"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DOMPurify from "dompurify";
import type {
  Job,
  JobStage,
  JobStatus,
} from "@/types/my-jobs";
import { STAGE_ICONS, STAGE_COLORS } from "./constants";

interface JobCardProps {
  job: Job;
  updateStatus: (jobId: string, status: JobStatus) => Promise<boolean>;
  updateStage: (jobId: string, stage: JobStage) => Promise<boolean>;
  trashJob: (jobId: string) => Promise<boolean>;
}

export default function JobCard({
  job,
  updateStatus,
  updateStage,
  trashJob,
}: JobCardProps) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const toggleDescription = () => setExpanded((prev) => !prev);

  return (
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
        className={`w-1 rounded-l-lg ${STAGE_COLORS[job.stage || "none"]}`}
      />

      {/* Card body */}
      <div className="flex-1 p-6 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-gray-600">{job.company_name}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {job.location && (
                <span className="px-2 py-0.5 bg-gray-100 rounded-full text-sm">
                  {job.location}
                </span>
              )}
              {job.salary && (
                <span className="px-2 py-0.5 bg-gray-100 rounded-full text-sm">
                  {job.salary}
                </span>
              )}
            </div>
          </div>
          {job.stage && STAGE_ICONS[job.stage]}
        </div>

        {/* See more toggle */}
        <button
          className="text-blue-600 hover:underline text-sm"
          onClick={toggleDescription}
        >
          {expanded ? "Hide details" : "See more"}
        </button>

        {/* Animated Description */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="desc"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-gray-700 overflow-hidden"
            >
              {/<\/?[a-z][\s\S]*>/i.test(job.description) ? (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(job.description),
                  }}
                />
              ) : (
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
            <select
              value={job.status || ""}
              onChange={(e) => updateStatus(job.job_id, e.target.value as JobStatus)}
              className="block w-full border rounded px-2 py-1"
            >
              <option value="new">New</option>
              <option value="saved">Saved</option>
              <option value="not_interested">Not Interested</option>
              <option value="not_relevant">Not Relevant</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stage
            </label>
            <select
              value={job.stage || ""}
              onChange={(e) => updateStage(job.job_id, e.target.value as JobStage)}
              className="block w-full border rounded px-2 py-1"
            >
              {Object.entries(STAGE_ICONS).map(([stage]) => (
                <option key={stage} value={stage}>
                  {stage.charAt(0).toUpperCase() + stage.slice(1)}
                </option>
              ))}
            </select>
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
            onClick={() => trashJob(job.job_id)}
          >
            🗑️ Trash
          </button>
        </div>
      </div>
    </motion.li>
  );
}
