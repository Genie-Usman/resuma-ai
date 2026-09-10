import { useState } from "react";
import { useReactToPrint } from "react-to-print";

export const useResumeExport = (resumeDownloadRef, documentTitle = "Resume") => {
  const [openThemeSelector, setOpenThemeSelector] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showAtsGuidance, setShowAtsGuidance] = useState(false);

  // Exact A4 portrait styles injected directly into print iframe
  const printPageStyle = `
    @page {
      size: A4 portrait;
      margin: 0mm;
    }
    @media print {
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .no-print,
      .page-break-guide-line,
      .page-break-guide-pill {
        display: none !important;
      }
      .a4-paper-sheet,
      .a4-paper-sheet *,
      .a4-print-sheet,
      .a4-print-sheet * {
        min-height: 0 !important;
      }
      .a4-paper-sheet,
      .a4-print-sheet {
        width: 210mm !important;
        height: auto !important;
        margin: 0 auto !important;
        padding: 0 !important;
        box-shadow: none !important;
        border: none !important;
        transform: none !important;
      }
      /* Allow sections, grids, and columns to break naturally across pages */
      section,
      article,
      .resume-section,
      .wysiwyg,
      .main,
      .sidebar,
      .space-y-4,
      .space-y-3,
      .space-y-6,
      .grid {
        break-inside: auto !important;
        page-break-inside: auto !important;
        height: auto !important;
      }
      /* Prevent individual resume item entries from being sliced awkwardly across pages */
      section > div > div,
      section > div > div > div,
      .resume-item,
      .page-break-avoid,
      .bronzor-section-content > div,
      .nosepass-item,
      li {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
      /* Keep section headings attached to their following content (no orphan headings) */
      h1, h2, h3, h4, h5, h6,
      .bronzor-section-title,
      .nosepass-title-row,
      .nosepass-summary-title {
        break-after: avoid !important;
        page-break-after: avoid !important;
      }
      /* Bronzor Print Pagination Overrides: convert monolithic grid row into block + float layout */
      .bronzor-section {
        display: block !important;
        clear: both !important;
        break-inside: auto !important;
        page-break-inside: auto !important;
        margin-bottom: 0.75rem !important;
      }
      .bronzor-section-title {
        float: left !important;
        width: 20% !important;
        break-after: avoid !important;
        page-break-after: avoid !important;
      }
      .bronzor-section-content {
        margin-left: 20% !important;
        width: 80% !important;
        display: block !important;
        break-inside: auto !important;
        page-break-inside: auto !important;
      }
      .bronzor-section-content > div {
        display: block !important;
        break-inside: avoid !important;
        page-break-inside: avoid !important;
        margin-bottom: 0.75rem !important;
      }
      /* Nosepass Print Pagination Overrides */
      .nosepass-section,
      .nosepass-summary-section {
        display: block !important;
        clear: both !important;
        break-inside: auto !important;
        page-break-inside: auto !important;
        margin-bottom: 0.75rem !important;
      }
      .nosepass-summary-title {
        float: left !important;
        width: 25% !important;
        break-after: avoid !important;
        page-break-after: avoid !important;
      }
      .nosepass-summary-content {
        margin-left: 25% !important;
        width: 75% !important;
        display: block !important;
        break-inside: auto !important;
        page-break-inside: auto !important;
      }
      .nosepass-item {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
        margin-bottom: 0.75rem !important;
      }
      /* Prevent trailing margins from spawning phantom blank pages */
      .a4-paper-sheet > *:last-child,
      .a4-paper-sheet *:last-child {
        margin-bottom: 0 !important;
      }
      a {
        color: inherit !important;
        text-decoration: none !important;
      }
    }
  `;

  const reactToPrintFn = useReactToPrint({
    contentRef: resumeDownloadRef,
    documentTitle: documentTitle || "Resume",
    pageStyle: printPageStyle,
    onBeforePrint: async () => {
      setIsPrinting(true);
    },
    onAfterPrint: () => {
      setIsPrinting(false);
    },
  });

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      reactToPrintFn();
      setIsPrinting(false);
    }, 300);
  };

  return {
    openThemeSelector,
    setOpenThemeSelector,
    openPreviewModal,
    setOpenPreviewModal,
    isPrinting,
    handlePrint,
    showAtsGuidance,
    setShowAtsGuidance,
  };
};

