"use client";

import { useMemo, useState } from 'react';
import MonthCard from '@/components/features/monthly/MonthCard';
import MonthlyAddRecordDialog from '@/components/features/monthly/MonthlyAddRecordDialog';
import MonthlyCreateMonthDialog from '@/components/features/monthly/MonthlyCreateMonthDialog';
import SkeletonCard from '@/components/ui/SkeletonCard';
import MonthRangePicker from '@/components/features/monthly/MonthRangePicker';
import { Button } from '@/components/ui/Button';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MonthlySummary, sharedAppliances } from '@/lib/data/mockApp';

type MonthlyFiltersProps = {
  monthsData: MonthlySummary[];
};

const MONTHS_LIST = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function MonthlyFilters({ monthsData }: MonthlyFiltersProps) {
  const [startMonth, setStartMonth] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedMonth, setSelectedMonth] = useState<{ slug: string; label: string } | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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
      <div className="card bg-base-100 shadow-sm border border-base-200 flex-row flex-wrap items-center justify-between gap-4 p-2 sm:pl-5 w-full mb-2">
        <MonthRangePicker
          startMonth={startMonth}
          endMonth={endMonth}
          onChange={(start, end) => {
            setStartMonth(start);
            setEndMonth(end);
          }}
        />

        <div className="flex items-center gap-3 ml-auto">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => setIsCreateOpen(true)}
          >
            New Month
          </Button>

          <div className="join bg-base-200 rounded-xl p-1 overflow-x-auto">
            {(["date", "usage", "cost"] as const).map((type) => {
              const isActive = sortBy.startsWith(type);
              const isDesc = sortBy.endsWith("desc");
              const labels = { date: "Latest", usage: "Usage", cost: "Cost" };

              return (
                <button
                  key={type}
                  onClick={() => {
                    if (isActive) {
                      setSortBy(`${type}-${isDesc ? "asc" : "desc"}`);
                    } else {
                      setSortBy(`${type}-desc`);
                    }
                  }}
                  className={cn(
                    "join-item btn btn-sm border-none font-bold px-5",
                    isActive
                      ? "bg-base-100 text-primary shadow-sm hover:bg-base-100"
                      : "bg-transparent text-base-content/50 hover:text-base-content hover:bg-base-300/50"
                  )}
                >
                  {labels[type]}
                  {isActive && (
                    <span className="text-primary ml-0.5">
                      {isDesc ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {processedData.length > 0 ? (
          processedData.map((data) => (
            <MonthCard
              key={`${data.month}-${data.year}`}
              {...data}
              onAdd={(slug, label) => setSelectedMonth({ slug, label })}
            />
          ))
        ) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-base-content/40 card bg-base-100 border border-base-200 border-dashed">
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

      <MonthlyAddRecordDialog
        isOpen={selectedMonth !== null}
        onClose={() => setSelectedMonth(null)}
        monthSlug={selectedMonth?.slug ?? ''}
        monthLabel={selectedMonth?.label ?? ''}
        appliances={sharedAppliances}
      />

      <MonthlyCreateMonthDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </>
  );
}
