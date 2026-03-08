import SidebarNav from "./SidebarNav";

export default function Sidebar() {
  return (
    <aside className="bg-base-100 border-r border-base-200 hidden md:flex flex-col w-[256px] h-[100dvh] shrink-0 sticky top-0 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="bg-primary rounded-2xl flex items-center justify-center size-10 shrink-0">
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
            <path d="M9 0L0 11.5H7L5 20L16 8.5H9L11 0H9Z" fill="white" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-base-content text-lg font-bold leading-tight">EnergySync</span>
          <span className="text-base-content/50 text-xs">Smart Home Monitor</span>
        </div>
      </div>

      {/* Navigation */}
      <SidebarNav />

      {/* Bottom section - subtle branding */}
      <div className="px-6 py-4 border-t border-base-200 mt-auto">
        <div className="flex items-center gap-3">
          <div className="avatar placeholder">
            <div className="bg-primary/10 text-primary rounded-full w-8 h-8">
              <span className="text-xs font-bold">K</span>
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-base-content truncate">Kitta</span>
            <span className="text-xs text-base-content/40 truncate">Free Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
