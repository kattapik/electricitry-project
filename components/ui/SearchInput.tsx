"use client";

import { Search } from "lucide-react";

type SearchInputProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export default function SearchInput({
  placeholder = "Search...",
  value,
  onChange,
}: SearchInputProps) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <Search size={14} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="bg-slate-50 rounded-lg pl-10 pr-4 py-2 text-sm w-64 outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400"
      />
    </div>
  );
}
