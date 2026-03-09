"use client";

import { Search } from "lucide-react";

export default function SearchInput({
  placeholder = "Search...",
  value,
  onChange,
}: {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 flex items-center">
        <Search size={14} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input input-bordered bg-base-200/50 pl-10 pr-4 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-base-content/30"
      />
    </div>
  );
}
