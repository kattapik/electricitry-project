import SidebarNav from "./SidebarNav";

export default function Sidebar() {
  return (
    <aside className="bg-white border-r border-slate-200 hidden md:flex flex-col w-[256px] h-[100dvh] shrink-0 sticky top-0 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="bg-primary rounded-2xl flex items-center justify-center size-10 shrink-0">
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
            <path d="M9 0L0 11.5H7L5 20L16 8.5H9L11 0H9Z" fill="white" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-900 text-lg font-bold leading-tight">EnergySync</span>
          <span className="text-slate-500 text-xs">Smart Home Monitor</span>
        </div>
      </div>

      {/* Navigation - Client Component */}
      <SidebarNav />
    </aside>
  );
}
