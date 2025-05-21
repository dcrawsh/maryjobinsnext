"use client";

import React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { STAGE_OPTIONS, STATUS_OPTIONS } from "./constants";
import type { SortBy, FilterStage, FilterStatus } from "@/types/my-jobs";
import { ArrowUpDown, ArrowDownAZ, LayoutList, Columns3, XCircle } from "lucide-react";

interface FiltersProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  sortBy: SortBy;
  onSortByChange: (value: SortBy) => void;
  filterStage: FilterStage;
  onFilterStageChange: (value: FilterStage) => void;
  filterStatus: FilterStatus;
  onFilterStatusChange: (value: FilterStatus) => void;
  kanbanView: boolean;
  onToggleView: () => void;
}

export default function Filters({
  searchTerm,
  onSearchTermChange,
  sortBy,
  onSortByChange,
  filterStage,
  onFilterStageChange,
  filterStatus,
  onFilterStatusChange,
  kanbanView,
  onToggleView,
}: FiltersProps) {
  // Clear all filters handler
  const handleClearAll = () => {
    onSearchTermChange("");
    onSortByChange("newest");
    onFilterStageChange("__all__");
    onFilterStatusChange("__active__");
  };

  // Build active filter pills
  const activePills: { key: string; label: string; onRemove: () => void }[] = [];
  if (searchTerm) {
    activePills.push({
      key: "search",
      label: `Search: ${searchTerm}`,
      onRemove: () => onSearchTermChange(""),
    });
  }
  if (filterStage !== "__all__") {
    const stageLabel = STAGE_OPTIONS.find((o) => o.value === filterStage)?.label;
    activePills.push({
      key: "stage",
      label: `Stage: ${stageLabel}`,
      onRemove: () => onFilterStageChange("__all__"),
    });
  }
  if (filterStatus !== "__active__") {
    const statusLabel = STATUS_OPTIONS.find((o) => o.value === filterStatus)?.label;
    activePills.push({
      key: "status",
      label: `Status: ${statusLabel}`,
      onRemove: () => onFilterStatusChange("__active__"),
    });
  }
  if (sortBy !== "newest") {
    const sortLabel = sortBy.charAt(0).toUpperCase() + sortBy.slice(1);
    activePills.push({
      key: "sort",
      label: `Sort: ${sortLabel}`,
      onRemove: () => onSortByChange("newest"),
    });
  }

  return (
    <div className="sticky top-0 bg-white z-10 p-4 flex flex-wrap items-center gap-3 border-b">
      <h1 className="text-2xl font-bold flex-none">My Jobs</h1>

      <input
        type="text"
        placeholder="Search…"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        className="flex-1 min-w-[150px] px-3 py-1 border rounded focus:ring"
      />

      <Select value={sortBy} onValueChange={(v) => onSortByChange(v as SortBy)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">
            <ArrowUpDown className="mr-2 inline" /> Newest
          </SelectItem>
          <SelectItem value="title">
            <ArrowDownAZ className="mr-2 inline" /> Title
          </SelectItem>
        </SelectContent>
      </Select>

      <Select value={filterStage} onValueChange={(v) => onFilterStageChange(v as FilterStage)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Stage" />
        </SelectTrigger>
        <SelectContent>
          {STAGE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filterStatus} onValueChange={(v) => onFilterStatusChange(v as FilterStatus)}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Show…" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {activePills.length > 0 && (
        <button
          onClick={handleClearAll}
          className="flex-none flex items-center px-3 py-1 border rounded hover:bg-gray-50"
        >
          <XCircle className="mr-2" />
          Clear All
        </button>
      )}

      <button
        onClick={onToggleView}
        className="flex-none flex items-center px-3 py-1 border rounded hover:bg-gray-50"
      >
        {kanbanView ? (
          <LayoutList className="mr-2" />
        ) : (
          <Columns3 className="mr-2" />
        )}
        {kanbanView ? "List View" : "Kanban View"}
      </button>

      {activePills.length > 0 && (
        <div className="w-full mt-2 flex flex-wrap gap-2">
          {activePills.map((pill) => (
            <span
              key={pill.key}
              className="inline-flex items-center bg-gray-100 text-sm rounded-full px-2 py-1"
            >
              {pill.label}
              <button onClick={pill.onRemove} className="ml-1">
                <XCircle className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}