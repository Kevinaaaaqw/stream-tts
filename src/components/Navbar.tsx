import { Mic, BookOpen } from "lucide-react";
import { NavLink } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 h-14 border-b border-primary/10 bg-base/95 backdrop-blur-sm shrink-0">
      <div className="flex items-center gap-2">
        <Mic size={20} className="text-primary" />
        <span className="text-base font-bold text-primary tracking-wide">Stream TTS</span>
      </div>

      <div className="flex items-center gap-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm transition-colors duration-150 ${
              isActive ? "text-primary bg-primary/8" : "text-muted/60"
            }`
          }
        >
          主控台
        </NavLink>
        <NavLink
          to="/guide"
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm transition-colors duration-150 ${
              isActive ? "text-primary bg-primary/8" : "text-muted/60"
            }`
          }
        >
          <BookOpen size={14} />
          使用說明
        </NavLink>
      </div>
    </nav>
  );
}
