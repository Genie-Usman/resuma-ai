import { useState } from "react";
import { useReactToPrint } from "react-to-print";

export const useResumeExport = (resumeDownloadRef) => {
  const [openThemeSelector, setOpenThemeSelector] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const reactToPrintFn = useReactToPrint({
    contentRef: resumeDownloadRef,
  });

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      reactToPrintFn();
      setIsPrinting(false);
    }, 500);
  };

  return {
    openThemeSelector,
    setOpenThemeSelector,
    openPreviewModal,
    setOpenPreviewModal,
    isPrinting,
    handlePrint,
  };
};
