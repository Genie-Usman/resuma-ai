import { useState, useEffect, useRef } from "react";
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
} from "react-icons/lu";
import { usePageCalculator, A4_WIDTH_PX, A4_HEIGHT_PX } from "../hooks/usePageCalculator";
import RenderResume from "../../../components/ResumeTemplates/RenderResume";

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

  // Close display dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (displayMenuRef.current && !displayMenuRef.current.contains(event.target)) {
        setDisplayMenuOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setDisplayMenuOpen(false);
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

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full bg-slate-100/90 rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden"
    >
      {/* Canvas Top Control Bar */}
      <div className="flex items-center justify-end gap-2 px-3.5 py-2 bg-white/95 backdrop-blur-md border-b border-slate-200/80 text-xs text-slate-700 select-none z-10 shrink-0">
        {/* Right: View & Zoom Controls */}
        <div className="flex items-center gap-1.5">
          {/* Display & Layout Settings Dropdown */}
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
