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
      .a4-print-sheet {
        width: 210mm !important;
        min-height: 0 !important;
        height: auto !important;
        margin: 0 auto !important;
        padding: 0 !important;
        box-shadow: none !important;
        border: none !important;
        transform: none !important;
      }
      /* Allow sections, grids, and WYSIWYG containers to break across pages */
      section,
      article,
      .resume-section,
      .wysiwyg {
        break-inside: auto !important;
        page-break-inside: auto !important;
      }
      /* Prevent individual resume entries and list items from being sliced awkwardly */
      section > div > div,
      .resume-item,
      .page-break-avoid,
      li {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
      /* Keep section headings attached to their following content (no orphan headings) */
      h1, h2, h3, h4, h5, h6 {
        break-after: avoid !important;
        page-break-after: avoid !important;
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

