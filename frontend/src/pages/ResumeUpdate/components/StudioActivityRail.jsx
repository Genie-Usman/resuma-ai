import {
  LuFileText,
  LuPalette,
  LuSlidersHorizontal,
  LuMail,
  LuSparkles,
  LuInfo,
  LuCheck,
  LuRefreshCw,
} from "react-icons/lu";

/**
 * StudioActivityRail Component
 * Refined, high-end vertical activity rail.
 * Primary studio activity options are placed cleanly at the top with enlarged touch targets.
 */
const StudioActivityRail = ({
  activeTab,
  onSelectTab,
  isDrawerOpen,
  onToggleDrawer,
  onBack,
  overallScore = 90,
  onOpenHelp,
  isSaving = false,
  hasUnsavedChanges = false,
  isNavigatingBack = false,
  onManualSave,
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
      id: "cover-letter",
      label: "Letter",
      icon: LuMail,
      tooltip: "Matched cover letter generator & editor",
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
      className="w-[76px] h-full bg-slate-950 text-slate-400 flex flex-col items-center pt-3.5 pb-3 px-2 select-none z-30 shrink-0 border-r border-slate-800/80 shadow-lg"
      aria-label="Studio Activity Rail"
    >
      {/* Primary Activity Tabs (Pushed to the top) */}
      <nav className="flex flex-col items-center gap-2.5 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id && isDrawerOpen;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (activeTab === item.id && isDrawerOpen) {
                  onToggleDrawer();
                } else {
                  onSelectTab(item.id);
                }
              }}
              className={`relative w-full h-[66px] rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group ${
                isActive
                  ? "bg-linear-to-b from-purple-500/20 to-indigo-500/15 border border-purple-500/30 text-white shadow-xs"
                  : "border border-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-900/90 hover:border-slate-800/60"
              }`}
              title={item.tooltip}
            >
              {/* Active Tab Left Border Flush Pill */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-linear-to-b from-purple-500 to-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
              )}

              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`text-[22px] transition-transform duration-150 group-hover:scale-110 ${
                    isActive
                      ? "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                      : "text-slate-400 group-hover:text-slate-200"
                  }`}
                />
                {item.badge !== undefined && (
                  <span
                    className={`absolute -top-1.5 -right-3.5 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold leading-none tracking-tight border shadow-xs ${
                      item.badge >= 80
                        ? "bg-emerald-500 text-slate-950 border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                        : item.badge >= 65
                        ? "bg-amber-500 text-slate-950 border-amber-300"
                        : "bg-rose-500 text-white border-rose-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] tracking-tight leading-none transition-colors ${
                  isActive
                    ? "text-white font-bold"
                    : "text-slate-400 group-hover:text-slate-200 font-medium"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Area: Save Status Pill & Quick Help (Anchored at the bottom) */}
      <div className="mt-auto flex flex-col items-center gap-2.5 w-full pt-3 border-t border-slate-800/70">
        {/* Real-time Save Status Pill */}
        <div className="w-full flex flex-col items-center">
          {isSaving || isNavigatingBack ? (
            <div
              className="w-full py-1.5 px-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex flex-col items-center justify-center gap-1 text-center shadow-xs select-none transition-all"
              title="Saving resume data & thumbnail..."
            >
              <LuRefreshCw className="text-xs animate-spin text-amber-400 shrink-0" />
              <span className="text-[10px] font-semibold tracking-tight leading-none">Saving</span>
            </div>
          ) : hasUnsavedChanges ? (
            <button
              type="button"
              onClick={onManualSave}
              className="w-full py-1.5 px-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition-all shadow-xs group select-none"
              title="Unsaved changes (Click to save now)"
            >
              <div className="flex items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              </div>
              <span className="text-[10px] font-semibold tracking-tight leading-none group-hover:underline">Unsaved</span>
            </button>
          ) : (
            <div
              className="w-full py-1.5 px-1 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex flex-col items-center justify-center gap-1 text-center shadow-xs select-none transition-all"
              title="All changes saved to cloud"
            >
              <LuCheck className="text-xs text-emerald-400 shrink-0" />
              <span className="text-[10px] font-semibold tracking-tight leading-none">Saved</span>
            </div>
          )}
        </div>

        {/* Quick Help (Keyboard Shortcuts & Tips) */}
        {onOpenHelp && (
          <button
            type="button"
            onClick={onOpenHelp}
            className="w-9 h-9 rounded-xl hover:bg-slate-900 text-slate-500 hover:text-slate-300 flex items-center justify-center transition-colors cursor-pointer border border-transparent hover:border-slate-800/60"
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
