// src/components/MyJobsPage/kanban/DroppableColumn.tsx
"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";

interface Props {
  /** Unique identifier for this column (status or stage) */
  id: string;
  /** Human-friendly title for the column */
  title: string;
  /** Icon to display next to the title */
  icon: JSX.Element;
  children: React.ReactNode;
}

export default function DroppableColumn({ id, title, icon, children }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`w-full rounded-lg p-2 border transition-colors ${
        isOver ? "bg-blue-50" : "bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-2 font-semibold mb-2">
        {icon}
        <span className="capitalize text-sm">{title}</span>
      </div>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}
