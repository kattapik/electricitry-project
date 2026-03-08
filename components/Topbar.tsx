import { Bell, Settings, User } from "lucide-react";
import { Button } from "./ui/Button";

export default function Topbar() {
  return (
    <header className="bg-white border-b border-slate-200 flex items-center justify-end px-8 h-16 shrink-0 sticky top-0 z-10 w-full">
      <div className="flex items-center gap-4">
        <Button variant="secondary" size="icon" aria-label="Notifications">
          <Bell size={18} />
        </Button>
        <Button variant="secondary" size="icon" aria-label="Settings">
          <Settings size={18} />
        </Button>
        <div className="w-px h-6 bg-slate-200 mx-2" />
        <Button variant="secondary" size="icon" className="bg-slate-200 hover:bg-slate-300" aria-label="User profile">
          <User size={20} />
        </Button>
      </div>
    </header>
  );
}
