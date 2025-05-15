// components/job/AlternateTitleSelector.tsx
'use client';

import { FC, useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';

interface Props {
  jobTitle: string;
  value: string[];
  onChange: (next: string[]) => void;
}

export const AlternateTitleSelector: FC<Props> = ({
  jobTitle,
  value,
  onChange,
}) => {
  const [options, setOptions] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<string[]>([]);
  const [filterText, setFilterText] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch whenever jobTitle changes
  useEffect(() => {
    if (jobTitle.trim().length < 2) {
      setOptions([]);
      return;
    }
    setLoading(true);
    fetch(`/api/alternate-titles?title=${encodeURIComponent(jobTitle)}`)
      .then((res) => res.json())
      .then((body) => setOptions(body.titles || []))
      .catch(() => setOptions([]))
      .finally(() => setLoading(false));
  }, [jobTitle]);

  // Filter client-side on user’s text
  useEffect(() => {
    if (!filterText) {
      setFiltered(options);
    } else {
      const ft = filterText.toLowerCase();
      setFiltered(options.filter((o) => o.toLowerCase().includes(ft)));
    }
  }, [filterText, options]);

  const toggle = (opt: string) =>
    onChange(value.includes(opt)
      ? value.filter((v) => v !== opt)
      : [...value, opt]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Alternate Titles</label>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Filter…"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="flex-1 border rounded px-2 py-1 text-sm"
          disabled={loading}
        />
        {loading && <Loader2 className="animate-spin w-5 h-5 text-gray-500" />}
      </div>
      <ul className="grid grid-cols-2 gap-2 max-h-40 overflow-auto">
        {filtered.map((opt) => {
          const sel = value.includes(opt);
          return (
            <li key={opt}>
              <button
                type="button"
                onClick={() => toggle(opt)}
                className={`w-full flex items-center px-3 py-2 border rounded text-sm transition ${
                  sel
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <Check
                  className={`w-4 h-4 mr-2 transition-opacity ${
                    sel ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                {opt}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
