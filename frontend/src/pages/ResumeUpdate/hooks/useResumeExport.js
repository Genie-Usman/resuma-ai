import { useState } from "react";
import toast from "react-hot-toast";
import JSZip from "jszip";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";

export const useResumeExport = (resumeId, documentTitle = "Resume") => {
  const [openThemeSelector, setOpenThemeSelector] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showAtsGuidance, setShowAtsGuidance] = useState(false);

  /**
   * Direct 1-click Headless Vector PDF export.
   * Downloads high-fidelity A4/Letter vector PDF directly from the backend Chromium microservice.
   * Supports: "resume" (1-page), "cover-letter" (1-page), or "package" (2-page application package).
   */
  const handleDownloadVectorPdf = async (mode = "resume") => {
    if (!resumeId) {
      toast.error("Resume ID is missing");
      return;
    }

    if (isExporting) return;
    setIsExporting(true);

    const loadingText =
      mode === "cover-letter"
        ? "Generating matched Cover Letter PDF..."
        : mode === "package"
        ? "Generating 2-Page Application Package (Resume + Cover Letter)..."
        : "Generating vector PDF with Headless Chromium...";

    const toastId = toast.loading(loadingText, {
      id: "pdf-export-toast",
    });

    try {
      const response = await axiosInstance.get(
        API_PATHS.RESUME.EXPORT_PDF(resumeId, mode),
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

      const baseTitle = (documentTitle || "Resume")
        .replace(/[^a-zA-Z0-9-_ ]/g, "")
        .trim() || "Resume";

      let downloadName = `${baseTitle}.pdf`;
      if (mode === "cover-letter") {
        downloadName = `${baseTitle} - Cover Letter.pdf`;
      } else if (mode === "package") {
        downloadName = `${baseTitle} - Application Package.pdf`;
      }

      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      const successText =
        mode === "cover-letter"
          ? "Cover Letter PDF downloaded successfully!"
          : mode === "package"
          ? "2-Page Application Package downloaded successfully!"
          : "Vector PDF downloaded successfully!";

      toast.success(successText, { id: toastId });
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

  const handleDownloadCoverLetterPdf = () => handleDownloadVectorPdf("cover-letter");
  const handleDownloadApplicationPackage = () => handleDownloadVectorPdf("package");

  /**
   * Zipped Application Package export.
   * Downloads a .zip archive containing both Resume (PDF) and Cover Letter (PDF) as separate files.
   */
  const handleDownloadZipPackage = async () => {
    if (!resumeId) {
      toast.error("Resume ID is missing");
      return;
    }

    if (isExporting) return;
    setIsExporting(true);

    const toastId = toast.loading("Creating application package (.zip)...", {
      id: "zip-export-toast",
    });

    try {
      const [resumeRes, coverLetterRes] = await Promise.all([
        axiosInstance.get(API_PATHS.RESUME.EXPORT_PDF(resumeId, "resume"), {
          responseType: "blob",
        }),
        axiosInstance.get(API_PATHS.RESUME.EXPORT_PDF(resumeId, "cover-letter"), {
          responseType: "blob",
        }),
      ]);

      const processBlob = async (blobData) => {
        if (blobData instanceof Blob) {
          const previewText = await blobData.slice(0, 10).text();
          if (previewText.startsWith('{"0":') || previewText.startsWith('{"typ')) {
            const fullText = await blobData.text();
            const parsed = JSON.parse(fullText);
            const bytes = parsed.data ? parsed.data : Object.values(parsed);
            return new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
          }
          return blobData;
        }
        return new Blob([blobData], { type: "application/pdf" });
      };

      const [resumeBlob, coverLetterBlob] = await Promise.all([
        processBlob(resumeRes.data),
        processBlob(coverLetterRes.data),
      ]);

      const baseTitle = (documentTitle || "Resume")
        .replace(/[^a-zA-Z0-9-_ ]/g, "")
        .trim() || "Resume";

      const zip = new JSZip();
      zip.file(`${baseTitle} - Resume.pdf`, resumeBlob);
      zip.file(`${baseTitle} - Cover Letter.pdf`, coverLetterBlob);

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const downloadUrl = window.URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${baseTitle} - Application Package.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success("Application package (.zip) downloaded successfully!", {
        id: toastId,
      });
    } catch (err) {
      console.error("ZIP package export failed:", err);
      toast.error(
        err.response?.data?.message || "Failed to generate application package",
        { id: toastId }
      );
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Direct 1-click Editable Word (.docx) export.
   * Downloads an ATS-compliant, native Microsoft Word resume generated on the backend.
   */
  const handleDownloadDocx = async () => {
    if (!resumeId) {
      toast.error("Resume ID is missing");
      return;
    }

    if (isExporting) return;
    setIsExporting(true);

    const toastId = toast.loading("Generating editable Word document (.docx)...", {
      id: "docx-export-toast",
    });

    try {
      const response = await axiosInstance.get(
        API_PATHS.RESUME.EXPORT_DOCX(resumeId),
        { responseType: "blob" }
      );
      let blobData = response.data;

      // Defensive recovery for serialized JSON bytes
      if (blobData instanceof Blob) {
        const previewText = await blobData.slice(0, 10).text();
        if (previewText.startsWith('{"0":') || previewText.startsWith('{"typ')) {
          const fullText = await blobData.text();
          const parsed = JSON.parse(fullText);
          const bytes = parsed.data ? parsed.data : Object.values(parsed);
          blobData = new Uint8Array(bytes);
        }
      }

      const blob = new Blob([blobData], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;

      const baseTitle = (documentTitle || "Resume")
        .replace(/[^a-zA-Z0-9-_ ]/g, "")
        .trim() || "Resume";

      link.download = `${baseTitle}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success("Word document (.docx) downloaded successfully!", {
        id: toastId,
      });
    } catch (err) {
      console.error("DOCX export failed:", err);
      toast.error(
        err.response?.data?.message || "Failed to generate Word document",
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
    handleDownloadCoverLetterPdf,
    handleDownloadApplicationPackage,
    handleDownloadZipPackage,
    handleDownloadDocx,
    showAtsGuidance,
    setShowAtsGuidance,
  };
};
