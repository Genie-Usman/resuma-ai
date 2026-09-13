import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";

export const useResumeExport = (resumeId, documentTitle = "Resume") => {
  const [openThemeSelector, setOpenThemeSelector] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showAtsGuidance, setShowAtsGuidance] = useState(false);

  /**
   * Direct 1-click Headless Vector PDF export.
   * Downloads high-fidelity A4 vector PDF directly from the backend Chromium microservice.
   */
  const handleDownloadVectorPdf = async () => {
    if (!resumeId) {
      toast.error("Resume ID is missing");
      return;
    }

    if (isExporting) return;
    setIsExporting(true);
    const toastId = toast.loading("Generating vector PDF with Headless Chromium...", {
      id: "pdf-export-toast",
    });

    try {
      const response = await axiosInstance.get(
        API_PATHS.RESUME.EXPORT_PDF(resumeId),
        { responseType: "blob" }
      );
      let blobData = response.data;

      // Defensive recovery: detect if backend or serverless gateway serialized binary buffer to JSON byte map
      if (blobData instanceof Blob) {
        const previewText = await blobData.slice(0, 10).text();
        if (previewText.startsWith('{"0":') || previewText.startsWith('{"typ')) {
          const fullText = await blobData.text();
          const parsed = JSON.parse(fullText);
          const bytes = parsed.data ? parsed.data : Object.values(parsed);
          blobData = new Uint8Array(bytes);
        }
      }

      // Create blob download trigger
      const blob = new Blob([blobData], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;

      const safeTitle = (documentTitle || "Resume")
        .replace(/[^a-zA-Z0-9-_ ]/g, "")
        .trim() || "Resume";
      link.download = `${safeTitle}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success("Vector PDF downloaded successfully!", { id: toastId });
    } catch (err) {
      console.error("Vector PDF export failed:", err);
      toast.error(
        err.response?.data?.message || "Failed to generate vector PDF",
        { id: toastId }
      );
    } finally {
      setIsExporting(false);
    }
  };

  return {
    openThemeSelector,
    setOpenThemeSelector,
    openPreviewModal,
    setOpenPreviewModal,
    isExporting,
    handleDownloadVectorPdf,
    showAtsGuidance,
    setShowAtsGuidance,
  };
};
