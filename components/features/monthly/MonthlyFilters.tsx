"use client";

import { useState, useMemo } from "react";
import MonthCard from "@/components/features/monthly/MonthCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import MonthRangePicker from "@/components/features/monthly/MonthRangePicker";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type MonthData = {
  month: string;
  year: string;
  totalUsage: string;
  monthlyCost: string;
  trendText: string;
  trendType: "positive" | "negative" | "neutral";
  isLatest?: boolean;
};

type MonthlyFiltersProps = {
  monthsData: MonthData[];
};

const MONTHS_LIST = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function MonthlyFilters({ monthsData }: MonthlyFiltersProps) {
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");

  const getMonthNumber = (monthName: string) => {
    const index = MONTHS_LIST.indexOf(monthName) + 1;
    return index < 10 ? `0${index}` : `${index}`;
  };

  const processedData = useMemo(() => {
    let result = [...monthsData];

    if (startMonth || endMonth) {
      result = result.filter((data) => {
        const dataMonthStr = `${data.year}-${getMonthNumber(data.month)}`;
        if (startMonth && dataMonthStr < startMonth) return false;
        if (endMonth && dataMonthStr > endMonth) return false;
        return true;
      });
    }

    result.sort((a, b) => {
      const getNum = (str: string) => parseFloat(str.replace(/[^0-9.-]+/g, ""));
      switch (sortBy) {
        case "cost-asc": return getNum(a.monthlyCost) - getNum(b.monthlyCost);
        case "cost-desc": return getNum(b.monthlyCost) - getNum(a.monthlyCost);
        case "usage-asc": return getNum(a.totalUsage) - getNum(b.totalUsage);
        case "usage-desc": return getNum(b.totalUsage) - getNum(a.totalUsage);
        case "date-asc": 
        case "date-desc": 
        default: {
          const dateA = `${a.year}-${getMonthNumber(a.month)}`;
          const dateB = `${b.year}-${getMonthNumber(b.month)}`;
          if (sortBy === "date-asc") {
            return dateA.localeCompare(dateB);
          }
          return dateB.localeCompare(dateA); // Default to desc
        }
      }
    });

    return result;
  }, [startMonth, endMonth, sortBy, monthsData]);

  return (
    <>
      {/* Filter & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200/60 p-2 sm:pl-5 rounded-[16px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] w-full mb-2">
        <MonthRangePicker
          startMonth={startMonth}
          endMonth={endMonth}
          onChange={(start, end) => {
            setStartMonth(start);
            setEndMonth(end);
          }}
        />

        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-[12px] w-full sm:w-auto overflow-x-auto">
          {(["date", "usage", "cost"] as const).map((type) => {
            const isActive = sortBy.startsWith(type);
            const isDesc = sortBy.endsWith("desc");
            const labels = { date: "Latest", usage: "Usage", cost: "Cost" };

            return (
              <Button
                key={type}
                variant={isActive ? "outline" : "ghost"}
                size="md"
                onClick={() => {
                  if (isActive) {
                    setSortBy(`${type}-${isDesc ? "asc" : "desc"}`);
                  } else {
                    setSortBy(`${type}-desc`);
                  }
                }}
                className={cn(
                  "px-4 font-bold rounded-lg transition-colors",
                  isActive
                    ? "bg-white text-primary shadow-sm border-slate-200/50 hover:bg-white"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                )}
                rightIcon={
                  isActive && (
                    <span className="text-primary flex items-center justify-center">
                      {isDesc ? <ChevronDown size={10} /> : <ChevronUp size={10} />}
                    </span>
                  )
                }
              >
                {labels[type]}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
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

        {processedData.length > 0 && (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
      </div>
    </>
  );
}
