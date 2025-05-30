"use client";

import React, { useState, useMemo } from "react";
import { useJobs } from "./useJobs";
import Filters from "./Filters";
import JobKanbanView, { type KanbanViewMode } from "./JobKanbanView";
import JobCard from "./JobCard";
import type { SortBy, FilterStage, FilterStatus } from "@/types/my-jobs";

export default function Page() {
  const {
    jobs,
    loading,
    error,
    newCount,
    updateStatus,
    updateStage,
    markNotInterested,
    markNotRelevant,
  } = useJobs();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [filterStage, setFilterStage] = useState<FilterStage>("__all__");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("__active__");
  const [kanbanView, setKanbanView] = useState<boolean>(false);
  const [kanbanMode, setKanbanMode] = useState<KanbanViewMode>("status");

  const filteredJobs = useMemo(() => {
    return jobs
      .filter((j) => {
        if (filterStatus === "__active__") {
          if (j.status === "not_interested" || j.status === "not_relevant") return false;
        } else if (j.status !== filterStatus) return false;
        const byStage = filterStage === "__all__" || j.stage === filterStage;
        const bySearch =
          j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          j.company_name.toLowerCase().includes(searchTerm.toLowerCase());
        return byStage && bySearch;
      })
      .sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "salary") return a.salary.localeCompare(b.salary);
        return 0;
      });
  }, [jobs, searchTerm, filterStage, filterStatus, sortBy]);

  if (loading && jobs.length === 0) return <div className="p-6 space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="animate-pulse bg-gray-200 h-24 rounded-lg" />)}</div>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      {!kanbanView && newCount > 0 && (
        <div className="mb-4 rounded border-l-4 border-yellow-500 bg-yellow-50 p-4">
          <p className="text-yellow-700">
            You have <strong>{newCount}</strong> new job{newCount !== 1 ? 's' : ''} —{' '}
            <button onClick={() => setKanbanView(true)} className="underline">
              switch to Kanban
            </button>{' '}
            to triage.
          </p>
        </div>
      )}

      <Filters
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        filterStage={filterStage}
        onFilterStageChange={setFilterStage}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        kanbanView={kanbanView}
        onToggleView={() => setKanbanView((v) => !v)}
      />

      {/* Kanban mode toggle */}
      {kanbanView && (
        <div className="mt-4 mb-2 flex items-center gap-2">
          <span className="font-medium text-sm">View by:</span>
          <button
            onClick={() => setKanbanMode("status")}
            className={`px-2 py-1 rounded ${kanbanMode === "status" ? "bg-gray-200" : "hover:bg-gray-100"}`}
          >
            Status
          </button>
          <button
            onClick={() => setKanbanMode("stage")}
            className={`px-2 py-1 rounded ${kanbanMode === "stage" ? "bg-gray-200" : "hover:bg-gray-100"}`}
          >
            Stage
          </button>
        </div>
      )}

      {filteredJobs.length === 0 ? (
        <p className="text-gray-500 mt-6">No jobs match your filters.</p>
      ) : kanbanView ? (
        <JobKanbanView
          mode={kanbanMode}
          jobs={filteredJobs}
          onStatusChange={updateStatus}
          onStageChange={updateStage}
          onArchive={markNotRelevant}
          onSave={(jobId) => updateStatus(jobId, 'saved')}

        />
      ) : (
        <ul className="mt-6 space-y-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.job_id}
              job={job}
              updateStatus={updateStatus}
              updateStage={updateStage}
              trashJob={markNotRelevant}
            />
          ))}
        </ul>
      )}
    </div>
  );
}