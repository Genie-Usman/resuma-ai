import { useState, useEffect, useRef } from "react";
import {
  LuZoomIn,
  LuZoomOut,
  LuMaximize2,
  LuScissors,
  LuLayers,
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
