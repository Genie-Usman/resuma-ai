import { useState, useEffect, useRef, useMemo } from "react";
import {
  LuZoomIn,
  LuZoomOut,
  LuMaximize2,
  LuFileText,
  LuScissors,
  LuLayers,
  LuTriangleAlert,
  LuCircleCheckBig,
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

  // Real-time pagination calculation
  const {
    totalHeight,
    pageCount,
    lastPageUsagePercent,
    isNearSinglePageLimit,
    overflowPercent,
    breakPositions,
  } = usePageCalculator(sheetContentRef);

  // Auto-fit scale to available column width
  const calculateAutoFit = () => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth - 32; // 32px padding
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

  // Status Badge Colors based on pagination metrics
  const statusBadge = useMemo(() => {
    if (pageCount === 1) {
      return {
        label: `1 Page (${lastPageUsagePercent}% filled)`,
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: <LuCircleCheckBig className="text-sm text-emerald-600" />,
      };
    }
    if (isNearSinglePageLimit) {
      return {
        label: `2 Pages (Spilling over by ~${overflowPercent}%)`,
        color: "bg-amber-50 text-amber-700 border-amber-200",
        icon: <LuTriangleAlert className="text-sm text-amber-600" />,
      };
    }
    return {
      label: `${pageCount} Pages (A4 Standard)`,
      color: "bg-purple-50 text-purple-700 border-purple-200",
      icon: <LuFileText className="text-sm text-purple-600" />,
    };
  }, [pageCount, lastPageUsagePercent, isNearSinglePageLimit, overflowPercent]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full bg-slate-100/90 rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden"
    >
      {/* Canvas Top Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 bg-white/95 backdrop-blur-md border-b border-slate-200/80 text-xs text-slate-700 select-none z-10 shrink-0">
        {/* Left: Page Count Badge & Overflow Warning */}
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-medium ${statusBadge.color}`}
            title={`Total height: ${totalHeight}px (Standard A4: ${A4_HEIGHT_PX}px)`}
          >
            {statusBadge.icon}
            <span>{statusBadge.label}</span>
          </div>

          {isNearSinglePageLimit && (
            <div
              className="hidden xl:flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50/90 px-2 py-0.5 rounded-lg border border-amber-200"
              title="Only a tiny section spilled to page 2. Trim 1-2 bullets to fit cleanly on 1 page!"
            >
              <span>💡 Tip: Trim 1–2 lines to fit 1 page</span>
            </div>
          )}
        </div>

        {/* Right: View & Zoom Controls */}
        <div className="flex items-center gap-1.5">
          {/* Guide Cutoff Lines Toggle */}
          <button
            type="button"
            onClick={() => setShowGuides((prev) => !prev)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
              showGuides
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
            }`}
            title="Toggle visual A4 page break lines"
          >
            <LuScissors className="text-xs" />
            <span className="hidden sm:inline">Guides</span>
          </button>

          {/* View Mode: Continuous vs Multi-card */}
          <button
            type="button"
            onClick={() => setViewMode((prev) => (prev === "continuous" ? "cards" : "continuous"))}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-medium transition-colors cursor-pointer ${
              viewMode === "cards"
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
            }`}
            title="Toggle between Continuous view and Visual Page Cards"
          >
            <LuLayers className="text-xs" />
            <span className="hidden sm:inline">
              {viewMode === "cards" ? "Cards" : "Scroll"}
            </span>
          </button>

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
      <div className="flex-1 overflow-auto p-4 sm:p-6 flex justify-center items-start custom-scrollbar studio-canvas-pattern">
        {/* Scaled Layout Wrapper (ensures correct scrollable dimensions) */}
        <div
          style={{
            width: `${A4_WIDTH_PX * zoom}px`,
            minHeight: `${Math.max(A4_HEIGHT_PX, totalHeight) * zoom}px`,
            transition: "width 0.15s ease-out, min-height 0.15s ease-out",
          }}
          className="relative flex justify-center"
        >
          {/* Continuous View: Single A4 Sheet with Overlaid Page Break Guides */}
          {viewMode === "continuous" && (
            <div
              ref={canvasRef}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
                width: `${A4_WIDTH_PX}px`,
              }}
              className="a4-paper-sheet relative shadow-2xl ring-1 ring-black/5 rounded-xs transition-transform duration-150 origin-top bg-white"
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
          )}

          {/* Paginated Cards View: Visually Demarcated Page Sheets */}
          {viewMode === "cards" && (
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
                width: `${A4_WIDTH_PX}px`,
              }}
              className="flex flex-col gap-6 origin-top"
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeCanvas;
