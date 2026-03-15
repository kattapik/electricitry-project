"use client";

import { useState, useRef, useEffect, useCallback, ReactNode } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { useTranslations } from 'next-intl';

// Generic option type — any object with at least value + label
export interface SelectOption {
  value: string;
  label: string;
  image?: string;        // URL or data: URI
  icon?: ReactNode;      // fallback icon when no image
}

interface SearchableSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (option: SelectOption | null) => void;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  showImages?: boolean;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  label,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  showImages = false,
}: SearchableSelectProps) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selected = options.find(opt => opt.value === value);
  const effectivePlaceholder = placeholder ?? t('common.selectOption');
  const effectiveSearchPlaceholder = searchPlaceholder ?? t('common.search');
  const effectiveEmptyMessage = emptyMessage ?? t('common.noResultsFound');

  // Close on click outside
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setIsOpen(false);
      setSearch("");
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, handleClickOutside]);

  const handleSelect = (opt: SelectOption) => {
    onChange(opt);
    setSearch("");
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen(prev => !prev);
    if (isOpen) setSearch("");
  };

  // Render image/icon thumbnail
  const renderThumb = (opt: SelectOption, isActive: boolean) => {
    if (!showImages) return null;
    return (
      <div className={`
        size-8 flex items-center justify-center rounded-lg overflow-hidden shrink-0
        ${isActive ? "bg-primary/15" : "bg-base-200/60"}
      `}>
        {opt.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={opt.image} alt="" className="w-full h-full object-cover" />
        ) : opt.icon ? (
          opt.icon
        ) : null}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-1.5 w-full" ref={containerRef}>
      {label && <label className="text-sm font-semibold text-base-content/70">{label}</label>}

      <div className="relative w-full">
        {/* Trigger */}
        <button
          type="button"
          onClick={handleToggle}
          className={`
            w-full flex items-center justify-between gap-2 px-3 h-12
            bg-base-200/50 border rounded-xl cursor-pointer
            transition-all duration-150
            ${isOpen
              ? "border-primary/50 ring-2 ring-primary/20 bg-base-100"
              : "border-base-300 hover:border-base-content/30"
            }
          `}
        >
          {selected ? (
            <div className="flex items-center gap-3 flex-1 overflow-hidden">
              {renderThumb(selected, true)}
              <span className="text-base-content font-medium text-sm truncate">{selected.label}</span>
            </div>
          ) : (
            <span className="text-base-content/40 text-sm flex-1 text-left">{effectivePlaceholder}</span>
          )}
          <ChevronDown
            size={16}
            className={`text-base-content/40 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown Panel */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-1.5 z-[100] bg-base-100 rounded-xl shadow-xl border border-base-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
            {/* Search */}
            <div className="p-2.5 border-b border-base-200">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={effectiveSearchPlaceholder}
                  className="input input-sm w-full bg-base-200/50 pl-9 focus:outline-none focus:bg-base-200/80 rounded-lg"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Options */}
            <ul className="py-1.5 px-1.5 max-h-56 overflow-y-auto">
              {filtered.length === 0 ? (
                <li className="text-base-content/50 text-sm text-center py-4">
                  {effectiveEmptyMessage}
                </li>
              ) : (
                filtered.map(opt => {
                  const isSelected = value === opt.value;
                  return (
                    <li key={opt.value}>
                      <button
                        type="button"
                        onClick={() => handleSelect(opt)}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
                          transition-colors duration-100
                          ${isSelected
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-base-200/60 text-base-content"
                          }
                        `}
                      >
                        {renderThumb(opt, isSelected)}
                        <span className="flex-1 text-sm font-medium">{opt.label}</span>
                        {isSelected && <Check size={14} className="shrink-0 text-primary" />}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
