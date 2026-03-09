import { Button } from "@/components/ui/Button";

import { SharedAppliance } from "@/lib/data/appliances";

interface ApplianceListItemProps {
  appliance: SharedAppliance;
}

export default function ApplianceListItem({ appliance }: ApplianceListItemProps) {
  return (
    <tr className="group flex flex-col mx-auto max-w-md w-full bg-base-100 rounded-2xl shadow-sm border border-base-200 p-4 mb-4 md:mb-0 md:table-row md:max-w-none md:bg-transparent md:border-0 md:border-b md:border-base-200 md:shadow-none md:rounded-none md:p-0 hover:bg-base-200/40 transition-colors cursor-pointer last:border-0">
      {/* 1. Header Row (Mobile) / Name (Desktop) */}
      <td className="flex items-start justify-between p-0 border-0 md:px-4 md:py-3 md:table-cell w-full md:w-auto mb-4 md:mb-0 align-middle">
        <div className="flex items-center gap-3">
          <div className="avatar shrink-0">
            <div className="bg-base-200/80 text-base-content/60 rounded-full w-10 h-10 border border-base-200/50 flex items-center justify-center overflow-hidden">
              {appliance.image && appliance.image.startsWith('http') ? (
                <img src={appliance.image} alt={appliance.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-base" role="img" aria-label={appliance.name}>{appliance.image || "🔌"}</span>
              )}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-base-content text-[14px] leading-tight truncate">{appliance.name}</div>
            <div className="text-xs text-base-content/50 mt-0.5 truncate">{appliance.location || "-"}</div>
          </div>
        </div>
        
        {/* Mobile: Edit Button shown top right */}
        <div className="flex items-start md:hidden shrink-0 ml-2">
           <Button variant="ghost" size="sm" className="text-primary h-8 px-3 rounded-lg bg-primary/5 hover:bg-primary/10">
             Edit
           </Button>
        </div>
      </td>

      {/* 2. Usage */}
      <td className="flex justify-between items-center p-0 border-0 md:px-4 md:py-3 md:table-cell w-full md:w-auto pt-3 border-t border-base-200 md:border-0 md:pt-3 mt-2 md:mt-0 align-middle">
        <span className="text-xs font-semibold text-base-content/50 md:hidden">Usage</span>
        <div className="flex items-baseline gap-1 md:flex-col md:items-start md:gap-0">
          <span className="text-[13px] font-semibold md:font-normal text-base-content/90 md:text-base-content/70">{appliance.usageHrs || "0"}</span>
          <span className="text-xs text-base-content/50 md:hidden">hrs/mo</span>
          <span className="hidden md:inline text-xs text-base-content/50">hrs/mo</span>
        </div>
      </td>

      {/* 3. Energy */}
      <td className="flex justify-between items-center p-0 border-0 md:px-4 md:py-3 md:table-cell w-full md:w-auto pt-3 md:pt-3 align-middle">
        <span className="text-xs font-semibold text-base-content/50 md:hidden">Energy</span>
        <div className="flex items-baseline gap-1 md:flex-col md:items-start md:gap-0">
          <span className="text-[13px] font-semibold md:font-normal text-base-content/90 md:text-base-content/70">{appliance.energyKwh || "0.0"}</span>
          <span className="text-xs text-base-content/50 md:hidden">kWh/unit</span>
          <span className="hidden md:inline text-xs text-base-content/50">kWh/unit</span>
        </div>
      </td>

      {/* 4. Cost */}
      <td className="flex justify-between items-center p-0 border-0 md:px-4 md:py-3 md:table-cell w-full md:w-auto pt-3 md:pt-3 align-middle">
        <span className="text-xs font-semibold text-base-content/50 md:hidden">Est. Cost (฿)</span>
        <div className="flex flex-col items-end md:items-start">
          <span className="text-[15px] md:text-[13px] font-bold md:font-medium text-base-content">{appliance.cost ? appliance.cost : "0.00"}</span>
        </div>
      </td>

      {/* 5. Edit Button (Desktop only, mobile shows in header) */}
      <td className="hidden md:table-cell text-right px-4 py-3 align-middle">
        <Button variant="ghost" size="sm" className="text-base-content/50 h-8 px-4 font-bold hover:text-primary hover:bg-primary/5">
          Edit
        </Button>
      </td>
    </tr>
  );
}
