import { useState, useEffect, useCallback } from "react";

// Standard Paper Dimensions at 96 DPI
export const PAPER_FORMATS = {
  a4: {
    id: "a4",
    name: "A4",
    label: "A4 Paper (210 × 297 mm)",
    shortLabel: "A4",
    dimensionsLabel: "210 × 297 mm",
    widthMm: 210,
    heightMm: 297,
    widthPx: 794,
    heightPx: 1123,
    puppeteerFormat: "A4",
    cssSize: "A4 portrait",
    sheetWidthCss: "210mm",
    region: "International Standard",
  },
  letter: {
    id: "letter",
    name: "US Letter",
    label: "US Letter (8.5 × 11 in)",
    shortLabel: "US Letter",
    dimensionsLabel: "8.5 × 11 in",
    widthMm: 215.9,
    heightMm: 279.4,
    widthPx: 816,
    heightPx: 1056,
    puppeteerFormat: "Letter",
    cssSize: "letter portrait",
    sheetWidthCss: "215.9mm",
    region: "North America Standard",
  },
};

export const getPaperDimensions = (format = "a4") => {
  const key = (format || "a4").toLowerCase();
  return PAPER_FORMATS[key] || PAPER_FORMATS.a4;
};

// Backward-compatible individual constants
export const A4_WIDTH_PX = 794; // 210mm
export const A4_HEIGHT_PX = 1123; // 297mm
export const LETTER_WIDTH_PX = 816; // 8.5in
export const LETTER_HEIGHT_PX = 1056; // 11in

/**
 * Hook to calculate resume content height and determine real-time pagination
 * dynamically supporting both A4 and US Letter standards.
 *
 * @param {React.RefObject} contentRef - Ref attached to the resume DOM container
 * @param {string} paperFormat - "a4" | "letter" (defaults to "a4")
 * @returns {object} Pagination metrics and guide positions
 */
export const usePageCalculator = (contentRef, paperFormat = "a4") => {
  const activePaper = getPaperDimensions(paperFormat);
  const targetHeight = activePaper.heightPx;

  const [metrics, setMetrics] = useState({
    totalHeight: targetHeight,
    pageCount: 1,
    lastPageHeight: targetHeight,
    lastPageUsagePercent: 100,
    isNearSinglePageLimit: false,
    overflowPercent: 0,
    breakPositions: [],
    paperFormat: activePaper.id,
    activePaper,
  });

  const calculatePages = useCallback(() => {
    if (!contentRef?.current) return;

    const element = contentRef.current;
    // Calculate full scrollable height of the content
    const totalHeight = Math.max(
      targetHeight,
      element.scrollHeight || element.offsetHeight || targetHeight
    );
    // 8px tolerance buffer prevents subpixel/line-height rounding from triggering an extra blank page
    const pageCount = Math.max(1, Math.ceil((totalHeight - 8) / targetHeight));

    // Calculate usage on the final page
    const remainder = totalHeight % targetHeight;
    const lastPageHeight = remainder === 0 ? targetHeight : remainder;
    const lastPageUsagePercent = Math.min(
      100,
      Math.round((lastPageHeight / targetHeight) * 100)
    );

    // Near single-page limit warning:
    // If it just barely spilled onto Page 2 by <= 15% (approx <= 168px)
    const isNearSinglePageLimit = pageCount === 2 && remainder <= targetHeight * 0.15;
    const overflowPercent =
      pageCount > 1
        ? Math.round(((totalHeight - targetHeight) / targetHeight) * 100)
        : 0;

    // Generate cut positions for page breaks (e.g. [1123, 2246, ...] for A4, [1056, 2112, ...] for Letter)
    const breakPositions = [];
    for (let i = 1; i < pageCount; i++) {
      breakPositions.push(i * targetHeight);
    }

    setMetrics((prev) => {
      // Bailout if measurements have not changed to prevent re-render loops
      if (
        prev.totalHeight === totalHeight &&
        prev.pageCount === pageCount &&
        prev.lastPageHeight === lastPageHeight &&
        prev.lastPageUsagePercent === lastPageUsagePercent &&
        prev.isNearSinglePageLimit === isNearSinglePageLimit &&
        prev.overflowPercent === overflowPercent &&
        prev.breakPositions.length === breakPositions.length &&
        prev.paperFormat === activePaper.id
      ) {
        return prev;
      }

      return {
        totalHeight,
        pageCount,
        lastPageHeight,
        lastPageUsagePercent,
        isNearSinglePageLimit,
        overflowPercent,
        breakPositions,
        paperFormat: activePaper.id,
        activePaper,
      };
    });
  }, [contentRef, targetHeight, activePaper.id, activePaper]);

  useEffect(() => {
    let rafId = null;

    const scheduleCalculation = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        calculatePages();
      });
    };

    // Initial calculation
    scheduleCalculation();

    if (!contentRef?.current) {
      return () => {
        if (rafId) cancelAnimationFrame(rafId);
      };
    }

    const targetElement = contentRef.current;

    // Observe size changes via standard ResizeObserver with RAF debouncing
    let resizeObserver = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        scheduleCalculation();
      });
      resizeObserver.observe(targetElement);
    }

    const handleWindowResize = () => scheduleCalculation();
    window.addEventListener("resize", handleWindowResize);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [calculatePages, contentRef]);

  return {
    ...metrics,
    a4Height: A4_HEIGHT_PX,
    a4Width: A4_WIDTH_PX,
    recalculate: calculatePages,
  };
};
