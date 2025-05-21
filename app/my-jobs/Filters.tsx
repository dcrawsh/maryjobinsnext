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
import type {
  SortBy,
  FilterStage,
  FilterStatus,
} from "@/types/my-jobs";
import {
  ArrowUpDown,
  DollarSign,
  ArrowDownAZ,
  LayoutList,
  Columns3,
} from "lucide-react";

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
          <SelectItem value="salary">
            <DollarSign className="mr-2 inline" /> Salary
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
    </div>
  );
}
