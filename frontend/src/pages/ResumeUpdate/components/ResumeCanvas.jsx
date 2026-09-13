import { useState, useEffect, useRef, useMemo } from "react";
import {
  LuZoomIn,
  LuZoomOut,
  LuMaximize2,
  LuScissors,
  LuLayers,
  LuScrollText,
  LuSlidersHorizontal,
  LuChevronDown,
  LuCheck,
  LuType,
  LuSearch,
  LuMoveVertical,
  LuFoldVertical,
  LuUnfoldVertical,
} from "react-icons/lu";
import { usePageCalculator, A4_WIDTH_PX, A4_HEIGHT_PX } from "../hooks/usePageCalculator";
import RenderResume from "../../../components/ResumeTemplates/RenderResume";
import {
  DEFAULT_FONT,
  CURATED_FONTS,
  loadGoogleFont,
  fetchGoogleFontsList,
} from "../../../utils/googleFonts";

/**
 * ResumeCanvas Component
 * Renders the resume within a realistic A4 document sheet with real-time height tracking,
 * visual page break guides, zoom controls, and multi-page status indicators.
 */
const ResumeCanvas = ({
  resumeData,
  templateId,
  colorPalette,
  canvasRef, // Forwarded ref for thumbnail capture or export
  onUpdateFont,
  activeFont,
  onUpdateDensity,
  activeDensity,
}) => {
  const containerRef = useRef(null);
  const sheetContentRef = useRef(null);

  // View & Zoom State
  const [zoom, setZoom] = useState(0.65);
  const [isAutoFit, setIsAutoFit] = useState(true);
  const [showGuides, setShowGuides] = useState(true);
  const [viewMode, setViewMode] = useState("continuous"); // "continuous" | "cards"
  const [displayMenuOpen, setDisplayMenuOpen] = useState(false);
  const displayMenuRef = useRef(null);

  // Density State
  const currentDensity =
    activeDensity ||
    resumeData?.metadata?.typography?.density ||
    resumeData?.metadata?.density ||
    "normal";
  const [densityMenuOpen, setDensityMenuOpen] = useState(false);
  const densityMenuRef = useRef(null);

  // Google Fonts State
  const currentFont =
    activeFont ||
    resumeData?.metadata?.typography?.font?.family ||
    resumeData?.metadata?.fontFamily ||
    DEFAULT_FONT;
  const [fontMenuOpen, setFontMenuOpen] = useState(false);
  const [fontSearch, setFontSearch] = useState("");
  const [fontCategory, setFontCategory] = useState("all");
  const [availableFonts, setAvailableFonts] = useState(CURATED_FONTS);
  const fontMenuRef = useRef(null);

  // Preload active font
  useEffect(() => {
    if (currentFont) {
      loadGoogleFont(currentFont);
    }
  }, [currentFont]);

  // Fetch full Google Fonts catalog when menu opens
  useEffect(() => {
    if (fontMenuOpen) {
      fetchGoogleFontsList().then((fonts) => {
        if (Array.isArray(fonts) && fonts.length > 0) {
          setAvailableFonts(fonts);
        }
      });
    }
  }, [fontMenuOpen]);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (displayMenuRef.current && !displayMenuRef.current.contains(event.target)) {
        setDisplayMenuOpen(false);
      }
      if (fontMenuRef.current && !fontMenuRef.current.contains(event.target)) {
        setFontMenuOpen(false);
      }
      if (densityMenuRef.current && !densityMenuRef.current.contains(event.target)) {
        setDensityMenuOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setDisplayMenuOpen(false);
        setFontMenuOpen(false);
        setDensityMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Real-time pagination calculation
  const {
    pageCount,
    breakPositions,
  } = usePageCalculator(sheetContentRef);

  // Auto-fit scale to available column width (accounting for 48px padding + 16px vertical scrollbar + margin)
  const calculateAutoFit = () => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth - 80;
    if (containerWidth > 0) {
      const calculatedScale = Math.min(1.05, Math.max(0.35, containerWidth / A4_WIDTH_PX));
      setZoom(Number(calculatedScale.toFixed(2)));
    }
  };

  useEffect(() => {
    if (!isAutoFit) return;
    calculateAutoFit();

    const handleResize = () => {
      if (isAutoFit) calculateAutoFit();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isAutoFit]);

  const handleZoomIn = () => {
    setIsAutoFit(false);
    setZoom((prev) => Math.min(1.4, Number((prev + 0.05).toFixed(2))));
  };

  const handleZoomOut = () => {
    setIsAutoFit(false);
    setZoom((prev) => Math.max(0.35, Number((prev - 0.05).toFixed(2))));
  };

  const handleToggleAutoFit = () => {
    setIsAutoFit(true);
    calculateAutoFit();
  };

  // Filter fonts by search query and category tab
  const filteredFonts = useMemo(() => {
    const query = fontSearch.toLowerCase().trim();
    return availableFonts.filter((f) => {
      const matchesCategory = fontCategory === "all" || f.category === fontCategory;
      const matchesSearch = !query || f.family.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [availableFonts, fontCategory, fontSearch]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full bg-slate-100/90 rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden"
    >
      {/* Canvas Top Control Bar */}
      <div className="flex items-center justify-end gap-2 px-3.5 py-2 bg-white/95 backdrop-blur-md border-b border-slate-200/80 text-xs text-slate-700 select-none z-10 shrink-0">
        {/* Right: View & Zoom Controls */}
        <div className="flex items-center gap-1.5">
          {/* 1. Google Font Selector Dropdown */}
          <div className="relative" ref={fontMenuRef}>
            <button
              type="button"
              onClick={() => {
                setFontMenuOpen((prev) => !prev);
                setDisplayMenuOpen(false);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                fontMenuOpen
                  ? "bg-purple-50 text-purple-700 border-purple-300 shadow-xs"
                  : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90 shadow-2xs"
              }`}
              title="Change resume Google Font"
            >
              <LuType className="text-xs text-purple-600 shrink-0" />
              <span className="max-w-[85px] sm:max-w-[105px] truncate font-medium">{currentFont}</span>
              <LuChevronDown className={`text-[10px] text-slate-400 transition-transform duration-150 ${fontMenuOpen ? "rotate-180 text-purple-600" : ""}`} />
            </button>

            {/* Floating Font Menu Popover */}
            {fontMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-40 text-slate-700 animate-in fade-in-0 zoom-in-95 duration-100">
                {/* Search Bar */}
                <div className="relative mb-2">
                  <LuSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="text"
                    value={fontSearch}
                    onChange={(e) => setFontSearch(e.target.value)}
                    placeholder="Search 1,900+ Google Fonts..."
                    className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white transition-colors"
                    autoFocus
                  />
                  {fontSearch && (
                    <button
                      type="button"
                      onClick={() => setFontSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1 mb-2 pb-1 border-b border-slate-100 text-[10px]">
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
                      className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                        fontCategory === cat.id
                          ? "bg-purple-100 text-purple-700"
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                  <span className="ml-auto text-[9px] text-slate-400">
                    {filteredFonts.length} fonts
                  </span>
                </div>

                {/* Font List with Live Previews */}
                <div className="max-h-60 overflow-y-auto space-y-0.5 custom-scrollbar pr-0.5">
                  {filteredFonts.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No fonts matching "{fontSearch}"
                    </div>
                  ) : (
                    filteredFonts.slice(0, 60).map((font) => (
                      <button
                        key={font.family}
                        type="button"
                        onMouseEnter={() => loadGoogleFont(font.family)}
                        onClick={() => {
                          loadGoogleFont(font.family);
                          if (onUpdateFont) {
                            onUpdateFont(font.family, font.category);
                          }
                          setFontMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center justify-between rounded-xl transition-colors cursor-pointer ${
                          currentFont === font.family
                            ? "bg-purple-50 text-purple-900 font-semibold"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex flex-col min-w-0 pr-2">
                          <span
                            className="text-[13px] truncate"
                            style={{ fontFamily: font.family }}
                          >
                            {font.family}
                          </span>
                          <span className="text-[9px] text-slate-400 capitalize">
                            {font.category}
                          </span>
                        </div>
                        {currentFont === font.family && (
                          <LuCheck className="text-xs text-purple-600 stroke-[2.5] shrink-0" />
                        )}
                      </button>
                    ))
                  )}
                </div>

                {filteredFonts.length > 60 && (
                  <div className="pt-1.5 border-t border-slate-100 text-[10px] text-center text-slate-400">
                    Type to search through all 1,900+ Google Fonts
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. Density & Spacing Scale Selector */}
          <div className="relative" ref={densityMenuRef}>
            <button
              type="button"
              onClick={() => {
                setDensityMenuOpen((prev) => !prev);
                setFontMenuOpen(false);
                setDisplayMenuOpen(false);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                densityMenuOpen
                  ? "bg-purple-50 text-purple-700 border-purple-300 shadow-xs"
                  : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90 shadow-2xs"
              }`}
              title="Adjust resume spacing density (Compact, Standard, Spacious)"
            >
              <LuMoveVertical className="text-xs text-purple-600 shrink-0" />
              <span className="capitalize font-medium">{currentDensity}</span>
              <LuChevronDown className={`text-[10px] text-slate-400 transition-transform duration-150 ${densityMenuOpen ? "rotate-180 text-purple-600" : ""}`} />
            </button>

            {/* Density Popover Menu */}
            {densityMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-1.5 z-40 text-slate-700 animate-in fade-in-0 zoom-in-95 duration-100">
                <div className="px-2.5 pt-1 pb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Spacing Density
                </div>

                {/* Option 1: Compact */}
                <button
                  type="button"
                  onClick={() => {
                    if (onUpdateDensity) onUpdateDensity("compact");
                    setDensityMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 text-xs flex items-center justify-between rounded-xl transition-colors cursor-pointer ${
                    currentDensity === "compact"
                      ? "bg-purple-50 text-purple-900 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <LuFoldVertical className="text-xs text-purple-600 shrink-0" />
                      <span className="font-semibold text-slate-800">Compact</span>
                      <span className="text-[9px] bg-purple-100 text-purple-700 px-1 py-0.2 rounded font-bold">0.92x</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      Tight margins & line height (fits 1 page)
                    </span>
                  </div>
                  {currentDensity === "compact" && (
                    <LuCheck className="text-xs text-purple-600 stroke-[2.5] shrink-0" />
                  )}
                </button>

                {/* Option 2: Standard */}
                <button
                  type="button"
                  onClick={() => {
                    if (onUpdateDensity) onUpdateDensity("normal");
                    setDensityMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 text-xs flex items-center justify-between rounded-xl transition-colors cursor-pointer ${
                    currentDensity === "normal"
                      ? "bg-purple-50 text-purple-900 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <LuMoveVertical className="text-xs text-purple-600 shrink-0" />
                      <span className="font-semibold text-slate-800">Standard</span>
                      <span className="text-[9px] bg-slate-100 text-slate-600 px-1 py-0.2 rounded font-bold">1.0x</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      Balanced, clean professional spacing
                    </span>
                  </div>
                  {currentDensity === "normal" && (
                    <LuCheck className="text-xs text-purple-600 stroke-[2.5] shrink-0" />
                  )}
                </button>

                {/* Option 3: Spacious */}
                <button
                  type="button"
                  onClick={() => {
                    if (onUpdateDensity) onUpdateDensity("spacious");
                    setDensityMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 text-xs flex items-center justify-between rounded-xl transition-colors cursor-pointer ${
                    currentDensity === "spacious"
                      ? "bg-purple-50 text-purple-900 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <LuUnfoldVertical className="text-xs text-purple-600 shrink-0" />
                      <span className="font-semibold text-slate-800">Spacious</span>
                      <span className="text-[9px] bg-purple-100 text-purple-700 px-1 py-0.2 rounded font-bold">1.05x</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      Airy lines & larger gaps (fills page)
                    </span>
                  </div>
                  {currentDensity === "spacious" && (
                    <LuCheck className="text-xs text-purple-600 stroke-[2.5] shrink-0" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* 3. Display & Layout Settings Dropdown */}
          <div className="relative" ref={displayMenuRef}>
            <button
              type="button"
              onClick={() => setDisplayMenuOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                displayMenuOpen
                  ? "bg-purple-50 text-purple-700 border-purple-300 shadow-xs"
                  : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90 shadow-2xs"
              }`}
              title="Canvas display settings (layout mode, page guides)"
            >
              <LuSlidersHorizontal className="text-xs text-purple-600" />
              <span>Display</span>
              <LuChevronDown className={`text-[10px] text-slate-400 transition-transform duration-150 ${displayMenuOpen ? "rotate-180 text-purple-600" : ""}`} />
            </button>

            {/* Display Dropdown Menu */}
            {displayMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-1.5 z-30 text-slate-700 animate-in fade-in-0 zoom-in-95 duration-100">
                {/* Section 1: Layout Mode (Radio selection) */}
                <div className="px-2.5 pt-1 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Document Layout
                </div>

                {/* Option 1: Continuous Scroll */}
                <button
                  type="button"
                  onClick={() => setViewMode("continuous")}
                  className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center justify-between rounded-xl transition-colors cursor-pointer ${
                    viewMode === "continuous"
                      ? "bg-purple-50/80 text-purple-900 font-medium"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <LuScrollText className={`text-sm ${viewMode === "continuous" ? "text-purple-600" : "text-slate-500"}`} />
                    <span>Continuous Scroll</span>
                  </span>
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      viewMode === "continuous"
                        ? "border-purple-600 bg-purple-600 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {viewMode === "continuous" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                </button>

                {/* Option 2: Page Cards */}
                <button
                  type="button"
                  onClick={() => setViewMode("cards")}
                  className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center justify-between rounded-xl transition-colors cursor-pointer ${
                    viewMode === "cards"
                      ? "bg-purple-50/80 text-purple-900 font-medium"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <LuLayers className={`text-sm ${viewMode === "cards" ? "text-purple-600" : "text-slate-500"}`} />
                    <span>Page Cards</span>
                  </span>
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      viewMode === "cards"
                        ? "border-purple-600 bg-purple-600 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {viewMode === "cards" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                </button>

                <div className="h-px bg-slate-100 my-1.5" />

                {/* Section 2: Page Guides (Checkbox toggle) */}
                <div className="px-2.5 pt-1 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center justify-between">
                  <span>Page Guides</span>
                  {viewMode === "cards" && (
                    <span className="text-[9px] font-normal lowercase tracking-normal text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      continuous only
                    </span>
                  )}
                </div>

                {/* Toggle Cutoff Guides */}
                <button
                  type="button"
                  onClick={() => {
                    if (viewMode === "continuous") {
                      setShowGuides((prev) => !prev);
                    }
                  }}
                  disabled={viewMode === "cards"}
                  className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center justify-between rounded-xl transition-colors ${
                    viewMode === "cards"
                      ? "opacity-45 cursor-not-allowed text-slate-400"
                      : "text-slate-700 hover:bg-purple-50/60 hover:text-purple-900 cursor-pointer"
                  }`}
                  title={
                    viewMode === "cards"
                      ? "Cutoff guides only apply to continuous scroll mode"
                      : "Toggle A4 page break cutoff lines"
                  }
                >
                  <span className="flex items-center gap-2">
                    <LuScissors className={`text-sm ${showGuides && viewMode === "continuous" ? "text-purple-600" : "text-slate-400"}`} />
                    <span>Cutoff Guides</span>
                  </span>
                  <span
                    className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                      showGuides && viewMode === "continuous"
                        ? "bg-purple-600 border-purple-600 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {showGuides && viewMode === "continuous" && <LuCheck className="text-[10px] stroke-[3]" />}
                  </span>
                </button>
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* Zoom Out */}
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="Zoom out"
          >
            <LuZoomOut className="text-sm" />
          </button>

          {/* Zoom Percentage */}
          <span className="min-w-[40px] text-center font-mono text-slate-600 font-semibold text-xs">
            {Math.round(zoom * 100)}%
          </span>

          {/* Zoom In */}
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="Zoom in"
          >
            <LuZoomIn className="text-sm" />
          </button>

          {/* Fit Width */}
          <button
            type="button"
            onClick={handleToggleAutoFit}
            className={`p-1 rounded-lg border transition-colors cursor-pointer ${
              isAutoFit
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : "hover:bg-slate-100 text-slate-600 border-transparent"
            }`}
            title="Auto fit to column width"
          >
            <LuMaximize2 className="text-sm" />
          </button>
        </div>
      </div>

      {/* Main Canvas Scroll Area with Studio Pattern Backdrop */}
      <div className={`flex-1 overflow-y-auto ${zoom > 1.05 ? "overflow-x-auto" : "overflow-x-hidden"} p-4 sm:p-6 flex justify-center items-start custom-scrollbar studio-canvas-pattern`}>
        {/* Continuous View: Single Scaled Document Sheet */}
        {viewMode === "continuous" && (
          <div
            style={{
              width: `${Math.round(A4_WIDTH_PX * zoom)}px`,
              height: `${Math.round(pageCount * A4_HEIGHT_PX * zoom)}px`,
              position: "relative",
              transition: "width 0.15s ease-out, height 0.15s ease-out",
            }}
            className="shrink-0 mb-12 shadow-2xl ring-1 ring-black/10 rounded-xs bg-white overflow-hidden"
          >
            <div
              ref={canvasRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: `${A4_WIDTH_PX}px`,
                minHeight: `${pageCount * A4_HEIGHT_PX}px`,
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
              }}
              className="a4-paper-sheet bg-white"
            >
              {/* Overlaid Visual Page Break Lines */}
              {showGuides &&
                breakPositions.map((pos, idx) => (
                  <div
                    key={`page-break-${idx}`}
                    className="page-break-guide-line"
                    style={{ top: `${pos}px` }}
                  >
                    <div className="page-break-guide-pill flex items-center gap-1">
                      <LuScissors className="text-[10px]" />
                      <span>
                        End of Page {idx + 1} ({Math.round(pos * 0.264583)}mm)
                      </span>
                    </div>
                  </div>
                ))}

              {/* Resume Content */}
              <div ref={sheetContentRef} className="w-full">
                {resumeData?.basics && (
                  <RenderResume
                    templateId={templateId}
                    resumeData={resumeData}
                    colorPalette={colorPalette}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Paginated Cards View: Visually Demarcated Page Sheets */}
        {viewMode === "cards" && (
          <div
            style={{
              width: `${Math.round(A4_WIDTH_PX * zoom)}px`,
              height: `${Math.round((pageCount * A4_HEIGHT_PX + (pageCount - 1) * 24) * zoom)}px`,
              position: "relative",
              transition: "width 0.15s ease-out, height 0.15s ease-out",
            }}
            className="shrink-0 mb-12"
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: `${A4_WIDTH_PX}px`,
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
              }}
              className="flex flex-col gap-6"
            >
              {Array.from({ length: pageCount }).map((_, pageIdx) => (
                <div
                  key={`a4-page-card-${pageIdx}`}
                  className="relative a4-paper-sheet shadow-xl rounded-xs bg-white border border-gray-200 overflow-hidden"
                  style={{
                    height: `${A4_HEIGHT_PX}px`,
                  }}
                >
                  {/* Page Card Header Badge */}
                  <div className="absolute top-2 right-3 z-20 px-2 py-0.5 rounded bg-gray-100/90 border border-gray-200 text-[11px] font-semibold text-gray-500 select-none shadow-xs">
                    Page {pageIdx + 1} of {pageCount}
                  </div>

                  {/* Window into the continuous content clipped per page */}
                  <div
                    style={{
                      position: "absolute",
                      top: `-${pageIdx * A4_HEIGHT_PX}px`,
                      left: 0,
                      width: `${A4_WIDTH_PX}px`,
                    }}
                  >
                    {resumeData?.basics && (
                      <RenderResume
                        templateId={templateId}
                        resumeData={resumeData}
                        colorPalette={colorPalette}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeCanvas;
