"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface MonthRangePickerProps {
  startMonth: string; // Format: YYYY-MM
  endMonth: string;   // Format: YYYY-MM
  onChange: (start: string, end: string) => void;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const FULL_MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

function formatDisplayDate(dateStr: string) {
  if (!dateStr || !dateStr.includes("-")) return "";
  const [year, monthStr] = dateStr.split("-");
  const monthIdx = parseInt(monthStr, 10) - 1;
  if (isNaN(monthIdx) || monthIdx < 0 || monthIdx > 11) return "";
  return `${FULL_MONTH_NAMES[monthIdx]} ${year}`;
}

export default function MonthRangePicker({ startMonth, endMonth, onChange }: MonthRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // Local state while the popover is open
  const [tempStart, setTempStart] = useState<string | null>(startMonth || null);
  const [tempEnd, setTempEnd] = useState<string | null>(endMonth || null);
  const [selectionStep, setSelectionStep] = useState<"start" | "end">("start");
  
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleOpen = () => {
    setTempStart(startMonth || null);
    setTempEnd(endMonth || null);
    setSelectionStep("start");
    
    if (startMonth) {
      setCurrentYear(parseInt(startMonth.split("-")[0], 10));
    } else {
      setCurrentYear(new Date().getFullYear());
    }
    setIsOpen(true);
  };

  const handleMonthClick = (monthIndex: number) => {
    const monthStr = (monthIndex + 1).toString().padStart(2, "0");
    const selectedDate = `${currentYear}-${monthStr}`;

    if (selectionStep === "start") {
      setTempStart(selectedDate);
      setTempEnd(selectedDate); // Reset end to same as start initially
      setSelectionStep("end");
    } else {
      // If selected date is before start date, swap them
      if (tempStart && selectedDate < tempStart) {
        setTempEnd(tempStart);
        setTempStart(selectedDate);
      } else {
        setTempEnd(selectedDate);
      }
      setSelectionStep("start"); // Ready for a new selection sequence
    }
  };

  const handleApply = () => {
    onChange(tempStart || "", tempEnd || "");
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("", "");
  };

  // Helper to check if a month is within the selected range
  const isMonthInRange = (monthIndex: number) => {
    if (!tempStart || !tempEnd) return false;
    const monthStr = (monthIndex + 1).toString().padStart(2, "0");
    const cellDate = `${currentYear}-${monthStr}`;
    return cellDate >= tempStart && cellDate <= tempEnd;
  };

  const isMonthSelected = (monthIndex: number) => {
    const monthStr = (monthIndex + 1).toString().padStart(2, "0");
    const cellDate = `${currentYear}-${monthStr}`;
    return cellDate === tempStart || cellDate === tempEnd;
  };

  // Determine button text
  let buttonText = "Filter by date range";
  if (startMonth && endMonth) {
    if (startMonth === endMonth) {
      buttonText = formatDisplayDate(startMonth);
    } else {
      buttonText = `${formatDisplayDate(startMonth)} - ${formatDisplayDate(endMonth)}`;
    }
  }

  return (
    <div className="relative inline-block w-full sm:w-auto" ref={popoverRef}>
      <Button
        type="button"
        variant="outline"
        onClick={handleOpen}
        className={cn(
          "justify-between gap-2.5 w-full sm:w-[320px] bg-base-200/50 border-base-200 rounded-[10px] font-medium transition-all group",
          (isOpen || startMonth) && "ring-1 ring-primary/20 border-primary/30"
        )}
        leftIcon={
          <span className={cn("transition-colors", startMonth ? "text-primary" : "text-base-content/40 group-hover:text-primary/70")}>
            <Calendar size={16} />
          </span>
        }
        rightIcon={
          startMonth && (
            <div 
              onClick={handleClear}
              className="p-1 hover:bg-base-200 rounded-full text-base-content/40 hover:text-base-content/60 transition-colors z-10"
            >
              <X size={12} />
            </div>
          )
        }
      >
        <span className={cn("truncate", startMonth ? "text-base-content" : "text-base-content/50 font-normal")}>
          {buttonText}
        </span>
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full sm:w-[320px] bg-base-100 border border-base-200 rounded-[14px] shadow-lg z-50 overflow-hidden transform origin-top animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-base-200 bg-base-200/30">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setCurrentYear(y => y - 1)}
              className="size-8 rounded-lg text-base-content/50"
            >
              <ChevronLeft size={14} />
            </Button>
            <span className="text-sm font-bold text-base-content">{currentYear}</span>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setCurrentYear(y => y + 1)}
              className="size-8 rounded-lg text-base-content/50"
            >
              <ChevronRight size={14} />
            </Button>
          </div>

          {/* Month Grid */}
          <div className="p-4">
            <div className="grid grid-cols-3 gap-2">
              {MONTH_NAMES.map((month, idx) => {
                const isSelected = isMonthSelected(idx);
                const inRange = isMonthInRange(idx);
                
                return (
                  <button
                    key={month}
                    onClick={() => handleMonthClick(idx)}
                    className={`
                      py-2 px-1 text-sm font-medium rounded-lg transition-all relative
                      ${isSelected ? 'bg-primary text-white shadow-sm' : 
                        inRange ? 'bg-primary/10 text-primary' : 'bg-transparent text-base-content hover:bg-base-200'}
                    `}
                  >
                    {month}
                    {/* Visual connection for range */}
                    {inRange && !isSelected && (
                       <div className="absolute inset-y-0 -left-1 -right-1 bg-primary/10 -z-10" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-base-200 bg-base-100">
            <p className="text-xs text-base-content/50 font-medium">
              {selectionStep === "start" ? "Select Start Month" : "Select End Month"}
            </p>
            <div className="flex items-center justify-end gap-2">
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="font-bold text-base-content/60 h-8"
              >
                Cancel
              </Button>
              <Button 
                variant="primary"
                size="sm"
                onClick={handleApply}
                className="font-bold h-8 px-4"
              >
                Apply
              </Button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
