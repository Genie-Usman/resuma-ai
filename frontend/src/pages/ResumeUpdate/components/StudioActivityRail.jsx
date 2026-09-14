import {
  LuFileText,
  LuPalette,
  LuSlidersHorizontal,
  LuSparkles,
  LuArrowLeft,
  LuInfo,
} from "react-icons/lu";
import LOGO from "../../../assets/logo.svg";

/**
 * StudioActivityRail Component
 * Sleek, dark 68px vertical activity rail inspired by best-in-class editors (Zety, Figma).
 * Provides one-click access to Content, Templates, Formatting, and AI & Audit drawers.
 */
const StudioActivityRail = ({
  activeTab,
  onSelectTab,
  isDrawerOpen,
  onToggleDrawer,
  onBack,
  overallScore = 90,
  onOpenHelp,
}) => {
  const navItems = [
    {
      id: "content",
      label: "Content",
      icon: LuFileText,
      tooltip: "Edit resume content & sections",
    },
    {
      id: "templates",
      label: "Templates",
      icon: LuPalette,
      tooltip: "Choose templates & color palettes",
    },
    {
      id: "formatting",
      label: "Design",
      icon: LuSlidersHorizontal,
      tooltip: "Fonts, spacing, margins & paper size",
    },
    {
      id: "ai",
      label: "AI Review",
      icon: LuSparkles,
      tooltip: "Resume score & improvement tips",
      badge: overallScore,
    },
  ];

  return (
    <aside
      className="w-[68px] h-full bg-slate-950 text-slate-400 flex flex-col justify-between items-center py-3 select-none z-30 shrink-0 border-r border-slate-800/80 shadow-lg"
      aria-label="Studio Activity Rail"
    >
      {/* Top: Brand Logo */}
      <div className="flex flex-col items-center gap-2 pt-1">
        <img
          src={LOGO}
          alt="Resuma AI"
          className="w-7 h-7 opacity-80 hover:opacity-100 transition-opacity"
          title="Resuma AI Studio"
        />
        <div className="w-8 h-px bg-slate-800/80 my-1" />
      </div>

      {/* Middle: 4 Primary Activity Tabs */}
      <nav className="flex flex-col items-center gap-1.5 w-full px-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id && isDrawerOpen;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (activeTab === item.id && isDrawerOpen) {
                  // Toggle drawer closed if clicking active tab
                  onToggleDrawer();
                } else {
                  onSelectTab(item.id);
                }
              }}
              className={`relative w-full h-[58px] rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group ${
                isActive
                  ? "bg-purple-600/20 text-purple-300 font-semibold shadow-inner"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/80"
              }`}
              title={item.tooltip}
            >
              {/* Active Tab Left Border Pill */}
              {isActive && (
                <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-purple-500 rounded-r-full shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
              )}

              {/* Icon Container with Badge */}
              <div className="relative">
                <Icon className={`text-xl transition-transform group-hover:scale-110 ${isActive ? "text-purple-400" : ""}`} />
                {item.badge !== undefined && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 px-1 py-0.2 rounded-full text-[9px] font-black leading-tight border ${
                      item.badge >= 80
                        ? "bg-emerald-500 text-slate-950 border-emerald-400"
                        : item.badge >= 65
                        ? "bg-amber-500 text-slate-950 border-amber-400"
                        : "bg-rose-500 text-white border-rose-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={`text-[10px] tracking-tight leading-none ${isActive ? "text-purple-300 font-bold" : "text-slate-400"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom: Quick Help */}
      <div className="flex flex-col items-center gap-2 pb-1">
        {onOpenHelp && (
          <button
            type="button"
            onClick={onOpenHelp}
            className="w-9 h-9 rounded-xl hover:bg-slate-900 text-slate-500 hover:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            title="Keyboard Shortcuts & Tips"
          >
            <LuInfo className="text-base" />
          </button>
        )}
      </div>
    </aside>
  );
};

export default StudioActivityRail;
