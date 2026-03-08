"use client";

import { useState, useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import MonthCard from "@/components/MonthCard";
import SkeletonCard from "@/components/SkeletonCard";
import MonthRangePicker from "@/components/MonthRangePicker";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";



const monthsData = [
  {
    month: "January",
    year: "2024",
    totalUsage: "450 kWh",
    monthlyCost: "$67.50",
    trendText: "12% lower than previous month",
    trendType: "positive" as const,
    isLatest: true,
  },
  {
    month: "December",
    year: "2023",
    totalUsage: "512 kWh",
    monthlyCost: "$76.80",
    trendText: "5% higher than previous month",
    trendType: "negative" as const,
  },
  {
    month: "November",
    year: "2023",
    totalUsage: "488 kWh",
    monthlyCost: "$73.20",
    trendText: "Consistent with avg. usage",
    trendType: "neutral" as const,
  },
  {
    month: "October",
    year: "2023",
    totalUsage: "465 kWh",
    monthlyCost: "$69.75",
    trendText: "2% lower than previous month",
    trendType: "positive" as const,
  },
  {
    month: "September",
    year: "2023",
    totalUsage: "542 kWh",
    monthlyCost: "$81.30",
    trendText: "15% spike due to heatwave",
    trendType: "negative" as const,
  },
];

export default function MonthlyRecordsPage() {
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");

  // Helper to convert month name to number string ("01" - "12")
  const getMonthNumber = (monthName: string) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const index = months.indexOf(monthName) + 1;
    return index < 10 ? `0${index}` : `${index}`;
  };

  // Filter and sort the data
  const processedData = useMemo(() => {
    let result = [...monthsData];

    // 1. Filter by date range (YYYY-MM)
    if (startMonth || endMonth) {
      result = result.filter((data) => {
        const dataMonthStr = `${data.year}-${getMonthNumber(data.month)}`;
        if (startMonth && dataMonthStr < startMonth) return false;
        if (endMonth && dataMonthStr > endMonth) return false;
        return true;
      });
    }

    // 2. Sort the data
    result.sort((a, b) => {
      // Helper function to extract numeric values
      const getNum = (str: string) => parseFloat(str.replace(/[^0-9.-]+/g, ""));

      switch (sortBy) {
        case "cost-asc":
          return getNum(a.monthlyCost) - getNum(b.monthlyCost);
        case "cost-desc":
          return getNum(b.monthlyCost) - getNum(a.monthlyCost);
        case "usage-asc":
          return getNum(a.totalUsage) - getNum(b.totalUsage);
        case "usage-desc":
          return getNum(b.totalUsage) - getNum(a.totalUsage);
        case "date-asc":
          // Simplified date sorting based on the mock data order (assuming mock data is already in descending order)
          return result.indexOf(b) - result.indexOf(a);
        case "date-desc":
        default:
          return 0; // Maintain default order
      }
    });

    return result;
  }, [startMonth, endMonth, sortBy]);

  return (
    <main className="p-8 w-full max-w-[1152px] mx-auto flex flex-col min-h-full pb-16">
      <div className="flex flex-col gap-6 w-full">
        <PageHeader
          title="Monthly Breakdown"
          subtitle="View and analyze your energy footprint over the past months."
        />

        {/* Sleek Filter and Sort Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200/60 p-2 sm:pl-5 rounded-[16px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] w-full mb-2">
          
          {/* Custom Interactive Month Range Picker Component */}
          <MonthRangePicker 
            startMonth={startMonth}
            endMonth={endMonth}
            onChange={(start, end) => {
              setStartMonth(start);
              setEndMonth(end);
            }}
          />
          
          {/* Modern Sort Segmented Control */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-[12px] w-full sm:w-auto overflow-x-auto">
            {(['date', 'usage', 'cost'] as const).map((type) => {
              const isActive = sortBy.startsWith(type);
              const isDesc = sortBy.endsWith('desc');
              const labels = { date: 'Latest', usage: 'Usage', cost: 'Cost' };
              
              return (
                <Button
                  key={type}
                  variant={isActive ? "outline" : "ghost"}
                  size="md"
                  onClick={() => {
                      if (isActive) {
                         setSortBy(`${type}-${isDesc ? 'asc' : 'desc'}`);
                      } else {
                         setSortBy(`${type}-desc`);
                      }
                  }}
                  className={cn(
                    "px-4 font-bold rounded-lg transition-all",
                    isActive 
                      ? "bg-white text-primary shadow-sm border-slate-200/50 hover:bg-white" 
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                  )}
                  rightIcon={isActive && (
                    <span className="text-primary flex items-center justify-center">
                      {isDesc ? <ChevronDown size={10} /> : <ChevronUp size={10} />}
                    </span>
                  )}
                >
                  {labels[type]}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {processedData.length > 0 ? (
          processedData.map((data) => (
            <MonthCard key={`${data.month}-${data.year}`} {...data} />
          ))
        ) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 bg-white border border-slate-200 border-dashed rounded-xl">
            <p className="text-base font-medium">No monthly records found</p>
            <p className="text-sm">Try adjusting your filter</p>
          </div>
        )}

        {/* Show skeleton cards only if we have data and are "loading" more */}
        {processedData.length > 0 && (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
      </div>

      {/* Loading indicator */}
      {processedData.length > 0 && (
        <div className="flex flex-col items-center gap-3 py-8 mt-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm font-medium">Loading more records...</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Scroll to view history
          </span>
        </div>
      )}
    </main>
  );
}
