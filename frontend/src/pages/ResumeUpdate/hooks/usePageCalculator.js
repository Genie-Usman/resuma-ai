import { useState, useEffect, useCallback } from "react";

// Standard A4 dimensions at 96 DPI
export const A4_WIDTH_PX = 794; // 210mm
export const A4_HEIGHT_PX = 1123; // 297mm

/**
 * Hook to calculate resume content height and determine real-time A4 pagination.
 *
 * @param {React.RefObject} contentRef - Ref attached to the resume DOM container
 * @returns {object} Pagination metrics and guide positions
 */
export const usePageCalculator = (contentRef) => {
  const [metrics, setMetrics] = useState({
    totalHeight: A4_HEIGHT_PX,
    pageCount: 1,
    lastPageHeight: A4_HEIGHT_PX,
    lastPageUsagePercent: 100,
    isNearSinglePageLimit: false,
    overflowPercent: 0,
    breakPositions: [],
  });

  const calculatePages = useCallback(() => {
    if (!contentRef?.current) return;

    const element = contentRef.current;
    // Calculate full scrollable height of the content
    const totalHeight = Math.max(
      A4_HEIGHT_PX,
      element.scrollHeight || element.offsetHeight || A4_HEIGHT_PX
    );
    // 8px tolerance buffer prevents subpixel/line-height rounding from triggering an extra blank page
    const pageCount = Math.max(1, Math.ceil((totalHeight - 8) / A4_HEIGHT_PX));

    // Calculate usage on the final page
    const remainder = totalHeight % A4_HEIGHT_PX;
    const lastPageHeight = remainder === 0 ? A4_HEIGHT_PX : remainder;
    const lastPageUsagePercent = Math.min(
      100,
      Math.round((lastPageHeight / A4_HEIGHT_PX) * 100)
    );

    // Near single-page limit warning:
    // If it just barely spilled onto Page 2 by <= 15% (approx <= 168px)
    const isNearSinglePageLimit = pageCount === 2 && remainder <= A4_HEIGHT_PX * 0.15;
    const overflowPercent =
      pageCount > 1
        ? Math.round(((totalHeight - A4_HEIGHT_PX) / A4_HEIGHT_PX) * 100)
        : 0;

    // Generate cut positions for page breaks (e.g. [1123, 2246, ...])
    const breakPositions = [];
    for (let i = 1; i < pageCount; i++) {
      breakPositions.push(i * A4_HEIGHT_PX);
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
        prev.breakPositions.length === breakPositions.length
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
      };
    });
  }, [contentRef]);

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
