'use client';

import React, { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';

interface Props {
  id: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

export default function DroppableColumn({ id, title, icon, children }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`w-1/6 min-w-[180px] rounded-lg p-2 border transition-colors ${
        isOver ? 'bg-blue-50' : 'bg-gray-50'
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
