import { MoreVertical } from "lucide-react";

type Appliance = {
  name: string;
  model: string;
  location: string;
  usageHrs: string;
  energyKwh: string;
  cost: string;
  image: string;
};

type ApplianceTableProps = {
  appliances: Appliance[];
  showing: number;
  total: number;
};

export default function ApplianceTable({
  appliances,
  showing,
  total,
}: ApplianceTableProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                Appliance Name
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                Usage<br />(hrs/day)
              </th>
              <th className="px-6 py-5 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                Energy<br />(kWh/unit)
              </th>
              <th className="px-6 py-5 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">
                Est.<br />Cost
              </th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {appliances.map((appliance, index) => (
              <tr key={index} className="border-t border-slate-100">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 rounded-lg size-12 flex items-center justify-center shrink-0 overflow-hidden">
                      <span className="text-2xl">{appliance.image}</span>
                    </div>
                    <div>
                      <div className="text-base font-bold text-slate-900">{appliance.name}</div>
                      <div className="text-xs text-slate-500">{appliance.model}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {appliance.location}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-700">
                  {appliance.usageHrs}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-primary-light text-primary text-xs font-bold px-2 py-1 rounded">
                    {appliance.energyKwh}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-base font-bold text-slate-900">
                  {appliance.cost}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-slate-600 p-1">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-slate-50 border-t border-slate-100 px-6 py-5 flex items-center justify-between">
        <span className="text-sm text-slate-500">
          Showing {showing} of {total} appliances
        </span>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 rounded-md px-3.5 py-1.5 text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors">
            Previous
          </button>
          <button className="bg-white border border-slate-200 rounded-md px-3.5 py-1.5 text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
