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
      .page-break-guide-pill,
      header,
      nav,
      aside,
      button {
        display: none !important;
      }
      .a4-paper-sheet,
      .a4-print-sheet {
        width: 210mm !important;
        min-height: 297mm !important;
        margin: 0 auto !important;
        padding: 0 !important;
        box-shadow: none !important;
        border: none !important;
        transform: none !important;
      }
      .page-break-avoid,
      .resume-section,
      .resume-item,
      section,
      article,
      header,
      h1, h2, h3, h4, h5, h6,
      .wysiwyg > p,
      .wysiwyg > ul {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
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

