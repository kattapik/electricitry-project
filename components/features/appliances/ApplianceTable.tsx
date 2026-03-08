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
    <div className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="bg-base-200/30">
              <th className="text-xs font-bold text-base-content/40 uppercase tracking-wider">
                Appliance Name
              </th>
              <th className="text-xs font-bold text-base-content/40 uppercase tracking-wider">
                Location
              </th>
              <th className="text-xs font-bold text-base-content/40 uppercase tracking-wider">
                Usage<br />(hrs/day)
              </th>
              <th className="text-xs font-bold text-base-content/40 uppercase tracking-wider text-center">
                Energy<br />(kWh/unit)
              </th>
              <th className="text-xs font-bold text-base-content/40 uppercase tracking-wider text-right">
                Est.<br />Cost
              </th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {appliances.map((appliance, index) => (
              <tr key={index} className="hover">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="bg-base-200 rounded-lg size-12 flex items-center justify-center shrink-0 overflow-hidden">
                      <span className="text-2xl">{appliance.image}</span>
                    </div>
                    <div>
                      <div className="font-bold text-base-content">{appliance.name}</div>
                      <div className="text-xs text-base-content/50">{appliance.model}</div>
                    </div>
                  </div>
                </td>
                <td className="text-sm text-base-content/50">
                  {appliance.location}
                </td>
                <td className="text-sm font-medium text-base-content/70">
                  {appliance.usageHrs}
                </td>
                <td className="text-center">
                  <span className="badge badge-primary badge-soft badge-sm font-bold">
                    {appliance.energyKwh}
                  </span>
                </td>
                <td className="text-right text-base font-bold text-base-content">
                  {appliance.cost}
                </td>
                <td className="text-right">
                  <button className="btn btn-ghost btn-xs btn-square">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-base-200/30 border-t border-base-200 px-6 py-4 flex items-center justify-between">
        <span className="text-sm text-base-content/50">
          Showing {showing} of {total} appliances
        </span>
        <div className="join">
          <button className="join-item btn btn-sm btn-outline">
            Previous
          </button>
          <button className="join-item btn btn-sm btn-outline">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
