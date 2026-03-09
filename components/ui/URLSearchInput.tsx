"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";

export default function URLSearchInput({
  placeholder = "Search...",
  defaultValue = "",
}: {
  placeholder?: string;
  defaultValue?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [term, setTerm] = useState(defaultValue);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const currentQuery = searchParams.get("q") || "";
      
      // Prevent infinite loop: only update URL if the term actually changed
      if (term !== currentQuery) {
        const params = new URLSearchParams(searchParams.toString());
        if (term) {
          params.set("q", term);
        } else {
          params.delete("q");
        }
        
        startTransition(() => {
          router.push(`${pathname}?${params.toString()}`);
        });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [term, pathname, router, searchParams]);

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 flex items-center gap-2">
        <Search size={14} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="input input-bordered bg-base-200/50 pl-10 pr-10 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-base-content/30"
      />
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
           <span className="loading loading-spinner loading-xs text-base-content/30 mix-blend-multiply"></span>
        </div>
      )}
    </div>
  );
}
