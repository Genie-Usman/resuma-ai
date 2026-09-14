import { useState, useMemo } from "react";
import {
  LuSlidersHorizontal,
  LuX,
  LuSparkles,
  LuType,
  LuSearch,
  LuCheck,
  LuFileText,
  LuMinimize2,
} from "react-icons/lu";
import {
  CURATED_FONTS,
  DEFAULT_FONT,
  fetchGoogleFontsList,
} from "../../../../utils/googleFonts";

/**
 * DesignDrawer Component
 * Organizes Typography (Google Fonts), Density, Margins, Paper Size (A4 vs Letter),
 * Header Decorator styles, and Single-Click Auto-Fit into an elegant, non-intrusive drawer.
 */
const DesignDrawer = ({
  activeFont = DEFAULT_FONT,
  onUpdateFont,
  activeDensity = "normal",
  onUpdateDensity,
  activeMargin = "standard",
  onUpdateMargin,
  activePaperFormat = "a4",
  onUpdatePaperFormat,
  activeHeaderStyle = "default",
  onUpdateHeaderStyle,
  pageCount = 1,
  isNearSinglePageLimit = false,
  onShrinkToSinglePage,
  onClose,
}) => {
  // Google Fonts Search & Filtering State
  const [fontSearch, setFontSearch] = useState("");
  const [fontCategory, setFontCategory] = useState("all");
  const [availableFonts, setAvailableFonts] = useState(CURATED_FONTS);
  const [isSearchingFonts, setIsSearchingFonts] = useState(false);

  // Lazy-load full Google Fonts catalog when user types in search
  const handleSearchFocus = async () => {
    if (!isSearchingFonts && availableFonts.length <= CURATED_FONTS.length) {
      setIsSearchingFonts(true);
      const fonts = await fetchGoogleFontsList();
      if (Array.isArray(fonts) && fonts.length > 0) {
        setAvailableFonts(fonts);
      }
    }
  };

  const filteredFonts = useMemo(() => {
    const query = fontSearch.toLowerCase().trim();
    return availableFonts.filter((f) => {
      const matchesCat = fontCategory === "all" || f.category === fontCategory;
      const matchesSearch = !query || f.family.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });
  }, [availableFonts, fontCategory, fontSearch]);

  return (
    <div className="w-full h-full flex flex-col bg-white select-none overflow-hidden">
      {/* Drawer Top Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200/80 bg-slate-50/50 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
            <LuSlidersHorizontal className="text-base" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 leading-tight">Design & Formatting</h2>
            <p className="text-[11px] text-slate-500 leading-tight">Typography, spacing, paper & margins</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          title="Close Design drawer"
        >
          <LuX className="text-base" />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-5">
        {/* 1. Smart Auto-Fit Card ("Shrink to 1 Page") */}
        <div>
          {pageCount > 1 ? (
            <div className={`p-3.5 rounded-2xl border transition-all ${
              isNearSinglePageLimit
                ? "bg-amber-50/90 border-amber-300 shadow-xs"
                : "bg-purple-50/80 border-purple-200"
            }`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span className="text-xs font-bold text-amber-950">
                    {pageCount} Pages Detected
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">
                  Multi-Page Overflow
                </span>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                Your content is slightly over 1 page. Click below to automatically adjust spacing so everything fits cleanly on 1 page.
              </p>

              <button
                type="button"
                onClick={onShrinkToSinglePage}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <LuSparkles className="text-xs" />
                <span>Fit onto 1 Page</span>
              </button>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <LuCheck className="text-xs stroke-[3]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-950">Fits on 1 Page</span>
                  <p className="text-[10px] text-emerald-700">All content fits on a single sheet</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onShrinkToSinglePage}
                className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                title="Re-run 1-page optimizer"
              >
                Re-fit
              </button>
            </div>
          )}
        </div>

        {/* 2. Paper Size Switcher (A4 vs US Letter) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <LuFileText className="text-xs text-purple-600" />
              <span>Paper Size</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              {
                id: "a4",
                name: "A4 Paper",
                dim: "210 x 297 mm",
                sub: "International Standard",
                desc: "Europe, UK, Asia, Global",
              },
              {
                id: "letter",
                name: "US Letter",
                dim: "8.5 x 11 in",
                sub: "North America",
                desc: "USA, Canada, Mexico",
              },
            ].map((p) => {
              const isSelected = activePaperFormat === p.id;

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    if (onUpdatePaperFormat) onUpdatePaperFormat(p.id);
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-purple-50/90 border-purple-600 ring-2 ring-purple-600/30 shadow-xs text-purple-950 font-semibold"
                      : "bg-slate-50/60 hover:bg-slate-100 text-slate-700 border-slate-200/80"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold">{p.name}</span>
                      {isSelected && <LuCheck className="text-xs text-purple-600 stroke-[3]" />}
                    </div>
                    <span className="text-[11px] font-mono text-purple-700 font-semibold block">
                      {p.dim}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 mt-2 block leading-tight">
                    {p.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-slate-200/80" />

        {/* 3. Font Family Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <LuType className="text-xs text-purple-600" />
              <span>Font</span>
            </label>
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
              {activeFont}
            </span>
          </div>

          {/* Search Box */}
          <div className="relative mb-2.5">
            <LuSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              value={fontSearch}
              onFocus={handleSearchFocus}
              onChange={(e) => setFontSearch(e.target.value)}
              placeholder="Search 1,900+ Google Fonts..."
              className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 mb-2.5 overflow-x-auto pb-1 custom-scrollbar">
            {[
              { id: "all", label: "All" },
              { id: "sans-serif", label: "Sans" },
              { id: "serif", label: "Serif" },
              { id: "monospace", label: "Mono" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFontCategory(cat.id)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer shrink-0 ${
                  fontCategory === cat.id
                    ? "bg-purple-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Curated Fast-Pick Font Pills */}
          <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
            {filteredFonts.slice(0, 18).map((font) => {
              const isSelected = activeFont.toLowerCase() === font.family.toLowerCase();

              return (
                <button
                  key={font.family}
                  type="button"
                  onClick={() => {
                    if (onUpdateFont) onUpdateFont(font.family);
                  }}
                  className={`px-2.5 py-2 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-purple-100/90 text-purple-900 font-bold border-purple-400 shadow-2xs"
                      : "bg-slate-50/70 hover:bg-slate-100 text-slate-700 border-slate-200/60"
                  }`}
                >
                  <span
                    className="text-xs truncate"
                    style={{ fontFamily: `"${font.family}", sans-serif` }}
                  >
                    {font.family}
                  </span>
                  {isSelected && <LuCheck className="text-xs text-purple-700 stroke-[3] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-slate-200/80" />

        {/* 4. Density & Line Spacing */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Line Spacing
            </label>
            <span className="text-[10px] text-slate-400">Content Fit</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: "compact", label: "Compact", scale: "Tighter", sub: "More content" },
              { id: "normal", label: "Standard", scale: "Normal", sub: "Balanced" },
              { id: "spacious", label: "Spacious", scale: "Roomy", sub: "Relaxed" },
            ].map((d) => {
              const isSelected = activeDensity === d.id;

              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    if (onUpdateDensity) onUpdateDensity(d.id);
                  }}
                  className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-purple-100 text-purple-900 font-bold border-purple-400 shadow-2xs"
                      : "bg-slate-50/70 hover:bg-slate-100 text-slate-700 border-slate-200/60"
                  }`}
                  title={`${d.label} spacing`}
                >
                  <div className="text-xs font-bold">{d.label}</div>
                  <div className="text-[10px] text-purple-700 font-semibold">{d.scale}</div>
                  <div className="text-[9px] text-slate-400">{d.sub}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-slate-200/80" />

        {/* 5. Page Margins */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Page Margins
            </label>
            <span className="text-[10px] text-slate-400">Border Padding</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: "narrow", label: "Narrow", size: "Compact", desc: "Max area" },
              { id: "standard", label: "Standard", size: "Normal", desc: "Balanced" },
              { id: "wide", label: "Wide", size: "Spacious", desc: "Extra room" },
            ].map((m) => {
              const isSelected = activeMargin === m.id;

              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    if (onUpdateMargin) onUpdateMargin(m.id);
                  }}
                  className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-purple-100 text-purple-900 font-bold border-purple-400 shadow-2xs"
                      : "bg-slate-50/70 hover:bg-slate-100 text-slate-700 border-slate-200/60"
                  }`}
                  title={`${m.label} margins`}
                >
                  <div className="text-xs font-bold">{m.label}</div>
                  <div className="text-[10px] text-purple-700 font-semibold">{m.size}</div>
                  <div className="text-[9px] text-slate-400">{m.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-slate-200/80" />

        {/* 6. Section Heading Style */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Section Title Style
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "default", label: "Default", preview: "Normal" },
              { id: "underline", label: "Underline", preview: "Line" },
              { id: "left-bar", label: "Left Accent Bar", preview: "| Bar" },
              { id: "pill", label: "Pill Badge", preview: "Badge" },
              { id: "minimal", label: "Minimal Uppercase", preview: "ABC" },
            ].map((style) => {
              const isSelected = activeHeaderStyle === style.id;

              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => {
                    if (onUpdateHeaderStyle) onUpdateHeaderStyle(style.id);
                  }}
                  className={`px-3 py-2 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-purple-100 text-purple-900 font-bold border-purple-400 shadow-2xs"
                      : "bg-slate-50/70 hover:bg-slate-100 text-slate-700 border-slate-200/60"
                  } ${style.id === "minimal" ? "col-span-2" : ""}`}
                >
                  <span className="text-xs truncate">{style.label}</span>
                  <span className="text-[11px] text-purple-700 font-mono font-semibold shrink-0">
                    {style.preview}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignDrawer;
