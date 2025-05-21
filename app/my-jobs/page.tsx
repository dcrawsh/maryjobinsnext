"use client";

import React, { useState, useMemo } from "react";
import { useJobs } from "./useJobs";
import Filters from "./Filters";
import JobKanbanView from "./JobKanbanView";
import JobCard from "./JobCard";
import type { SortBy, FilterStage, FilterStatus } from "@/types/my-jobs";

export default function Page() {
  const { jobs, loading, error, updateStatus, updateStage, trashJob } = useJobs();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [filterStage, setFilterStage] = useState<FilterStage>("__all__");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("__active__");
  const [kanbanView, setKanbanView] = useState<boolean>(false);

  const filteredJobs = useMemo(() => {
    return jobs
      .filter((j) => {
        if (j.status === "trash") return false;

        // status filter
        if (filterStatus === "__active__") {
          if (j.status === "not_interested" || j.status === "not_relevant") {
            return false;
          }
        } else {
          if (j.status !== filterStatus) {
            return false;
          }
        }

        // stage & search
        const byStage = filterStage === "__all__" || j.stage === filterStage;
        const bySearch =
          j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          j.company_name.toLowerCase().includes(searchTerm.toLowerCase());
        return byStage && bySearch;
      })
      .sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "salary") return a.salary.localeCompare(b.salary);
        // newest: maintain original order
        return 0;
      });
  }, [jobs, searchTerm, filterStage, filterStatus, sortBy]);

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

      {filteredJobs.length === 0 ? (
        <p className="text-gray-500 mt-6">No jobs match your filters.</p>
      ) : kanbanView ? (
        <JobKanbanView jobs={filteredJobs} onStageChange={updateStage} />
      ) : (
        <ul className="mt-6 space-y-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.job_id}
              job={job}
              updateStatus={updateStatus}
              updateStage={updateStage}
              trashJob={trashJob}
            />
          ))}
        </ul>
      )}
    </div>
  );
}