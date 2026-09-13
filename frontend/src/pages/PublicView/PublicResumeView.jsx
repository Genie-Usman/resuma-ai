import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  LuEye,
  LuDownload,
  LuCopy,
  LuCheck,
  LuSparkles,
  LuZoomIn,
  LuZoomOut,
  LuMaximize2,
  LuCircleAlert,
} from "react-icons/lu";
import toast from "react-hot-toast";
import RenderResume from "../../components/ResumeTemplates/RenderResume";
import { A4_WIDTH_PX, A4_HEIGHT_PX } from "../ResumeUpdate/hooks/usePageCalculator";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import LOGO from "../../assets/logo.svg";

const PublicResumeView = () => {
  const { slug } = useParams();
  const resumePrintRef = useRef(null);
  const containerRef = useRef(null);

  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(0.8);
  const [isAutoFit, setIsAutoFit] = useState(true);

  // Fetch Public Resume and trigger recruiter view counter
  useEffect(() => {
    const fetchPublicResume = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axiosInstance.get(`/api/resume/public/${slug}`);
        setResume(response.data);
        document.title = `${response.data.title || "Resume"} | Resuma AI`;
      } catch (err) {
        console.error("Failed to load public resume:", err);
        setError(
          err.response?.data?.message ||
            "This resume could not be found or has been made private."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchPublicResume();
    }
  }, [slug]);

  // Auto-fit scale to available window width
  const calculateAutoFit = () => {
    if (!containerRef.current) return;
    const availableWidth = window.innerWidth - 48;
    if (availableWidth > 0) {
      const calculatedScale = Math.min(1.0, Math.max(0.4, availableWidth / A4_WIDTH_PX));
      setZoom(Number(calculatedScale.toFixed(2)));
    }
  };

  useEffect(() => {
    if (!isAutoFit) return;
    calculateAutoFit();
    window.addEventListener("resize", calculateAutoFit);
    return () => window.removeEventListener("resize", calculateAutoFit);
  }, [isAutoFit]);

  const [isExporting, setIsExporting] = useState(false);

  // 1-Click Server-Side Headless Vector PDF Download
  const handleDownloadPdf = async () => {
    if (!slug || isExporting) return;
    setIsExporting(true);
    const toastId = toast.loading("Generating vector PDF...", { id: "public-pdf" });

    try {
      const response = await axiosInstance.get(
        API_PATHS.RESUME.EXPORT_PUBLIC_PDF(slug),
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

      const blob = new Blob([blobData], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;

      const safeTitle = (resume?.title || "Candidate-Resume")
        .replace(/[^a-zA-Z0-9-_ ]/g, "")
        .trim() || "Candidate-Resume";
      link.download = `${safeTitle}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success("Vector PDF downloaded successfully!", { id: toastId });
    } catch (err) {
      console.error("Public PDF export error:", err);
      toast.error(err.response?.data?.message || "Failed to download vector PDF", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Public resume link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mb-4" />
        <p className="text-sm font-medium text-gray-600 animate-pulse">
          Loading candidate resume...
        </p>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <LuCircleAlert className="text-2xl" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Resume Not Found</h2>
          <p className="text-sm text-gray-500 mb-6">
            {error || "The resume link may have expired, or the owner has set it to private."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
          >
            <LuSparkles className="text-base" />
            <span>Create Your Free Resume</span>
          </Link>
        </div>
      </div>
    );
  }

  const resumeData = resume.data || {};
  const metadata = resumeData.metadata || {};
  const templateId = metadata.template || "azurill";
  const colorPalette = [
    metadata.theme?.background,
    metadata.theme?.text,
    metadata.theme?.primary,
  ];

  return (
    <div className="min-h-screen bg-[#fafafc] bg-[radial-gradient(ellipse_100%_45%_at_50%_-10%,rgba(147,40,231,0.07),rgba(255,255,255,0))] text-slate-800 antialiased flex flex-col font-sans">
      {/* Recruiter & Visitor Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          {/* Left: Branding & Candidate Overview */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-90 transition-opacity shrink-0"
              title="Resuma AI"
            >
              <img src={LOGO} alt="Resuma AI" className="w-[125px]" />
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-purple-50 text-purple-700 border border-purple-200/60">
                Studio
              </span>
            </Link>

            <div className="h-5 w-px bg-slate-200 hidden sm:block" />

            <div>
              <h1 className="text-xs md:text-sm font-bold text-gray-900 line-clamp-1">
                {resume.title}
              </h1>
              <p className="text-[11px] text-gray-500 line-clamp-1">
                Candidate: {resume.data?.basics?.name || resume.author?.name || "Professional"}
              </p>
            </div>
          </div>

          {/* Right: Recruiter View Count & Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Live Recruiter View Counter */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold shadow-2xs"
              title={`Viewed ${resume.viewsCount || 1} times`}
            >
              <LuEye className="text-sm" />
              <span>{resume.viewsCount || 1} Views</span>
            </div>

            {/* Copy Public Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              title="Copy share link"
            >
              {copied ? (
                <LuCheck className="text-xs text-emerald-600" />
              ) : (
                <LuCopy className="text-xs" />
              )}
              <span className="hidden sm:inline">{copied ? "Copied" : "Share"}</span>
            </button>

            {/* Download Vector PDF (Headless Chromium) */}
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <div className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LuDownload className="text-sm" />
              )}
              <span>{isExporting ? "Exporting..." : "Download PDF"}</span>
            </button>

            {/* Platform Branding CTA */}
            <Link
              to="/auth/sign-up"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
            >
              <LuSparkles className="text-xs" />
              <span>Build Your Own</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Canvas Presentation Viewport */}
      <main
        ref={containerRef}
        className="flex-1 flex flex-col items-center justify-start p-4 md:p-8 overflow-auto custom-scrollbar"
      >
        {/* Floating Zoom & Display Controls */}
        <div className="public-toolbar mb-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full border border-gray-200 shadow-md text-xs text-gray-700 select-none">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-1">
            Zoom
          </span>
          <button
            type="button"
            onClick={() => {
              setIsAutoFit(false);
              setZoom((prev) => Math.max(0.4, Number((prev - 0.05).toFixed(2))));
            }}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            title="Zoom out"
          >
            <LuZoomOut className="text-sm" />
          </button>
          <span className="min-w-[40px] text-center font-mono text-xs font-bold text-gray-700">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => {
              setIsAutoFit(false);
              setZoom((prev) => Math.min(1.3, Number((prev + 0.05).toFixed(2))));
            }}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            title="Zoom in"
          >
            <LuZoomIn className="text-sm" />
          </button>
          <div className="h-3 w-px bg-gray-200 mx-1" />
          <button
            type="button"
            onClick={() => {
              setIsAutoFit(true);
              calculateAutoFit();
            }}
            className={`p-1 rounded-full border transition-colors ${
              isAutoFit
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : "hover:bg-gray-100 text-gray-600 border-transparent"
            }`}
            title="Fit to screen width"
          >
            <LuMaximize2 className="text-xs" />
          </button>
        </div>

        {/* Scaled A4 Document Container */}
        <div
          style={{
            width: `${A4_WIDTH_PX * zoom}px`,
            minHeight: `${A4_HEIGHT_PX * zoom}px`,
            transition: "width 0.15s ease-out",
          }}
          className="relative flex justify-center mb-10"
        >
          <div
            ref={resumePrintRef}
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              width: `${A4_WIDTH_PX}px`,
            }}
            className="a4-paper-sheet relative shadow-2xl rounded-xs transition-transform duration-150 origin-top bg-white border border-gray-200/50"
          >
            <RenderResume
              templateId={templateId}
              resumeData={resumeData}
              colorPalette={colorPalette}
            />
          </div>
        </div>

        {/* Subtle Footer */}
        <footer className="public-toolbar text-center pb-8 text-xs text-gray-400">
          <p>
            Hosted on <Link to="/" className="text-purple-600 hover:underline font-semibold">Resuma AI</Link> — Executive AI Resume Builder
          </p>
        </footer>
      </main>
    </div>
  );
};

export default PublicResumeView;
