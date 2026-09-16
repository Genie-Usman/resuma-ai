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
  LuFileText,
  LuLock,
  LuLockOpen,
  LuKeyRound,
  LuShieldCheck,
  LuShieldAlert,
  LuLayoutGrid,
  LuFileSpreadsheet,
  LuMail,
  LuPhone,
  LuMapPin,
  LuGlobe,
  LuBriefcase,
  LuGraduationCap,
  LuCode,
  LuAward,
  LuExternalLink,
  LuX,
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
  const [viewMode, setViewMode] = useState("canvas"); // "canvas" | "portfolio"

  // Password Protection & Unlock State
  const [unlockToken, setUnlockToken] = useState(() => {
    return sessionStorage.getItem(`resuma_unlock_${slug}`) || "";
  });
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [openUnlockModal, setOpenUnlockModal] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState("");
  const [isSubmittingUnlock, setIsSubmittingUnlock] = useState(false);
  const [unlockError, setUnlockError] = useState("");

  const [isExporting, setIsExporting] = useState(false);

  // Fetch Public Resume and trigger recruiter view analytics
  const fetchPublicResume = async (tokenToUse = unlockToken) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (document.referrer) {
        params.set("ref", document.referrer);
      }
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz) params.set("tz", tz);
      } catch {}

      if (tokenToUse) {
        params.set("unlockToken", tokenToUse);
      }

      const response = await axiosInstance.get(`/api/resume/public/${slug}?${params.toString()}`);
      setResume(response.data);
      if (response.data.isUnlocked) {
        setIsUnlocked(true);
      }
      document.title = `${response.data.title || "Resume"} | Resuma AI Portfolio`;
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

  useEffect(() => {
    if (slug) {
      fetchPublicResume();
    }
  }, [slug]);

  // Auto-fit scale to available window width in canvas mode
  const calculateAutoFit = () => {
    if (!containerRef.current) return;
    const availableWidth = window.innerWidth - 48;
    if (availableWidth > 0) {
      const calculatedScale = Math.min(1.0, Math.max(0.4, availableWidth / A4_WIDTH_PX));
      setZoom(Number(calculatedScale.toFixed(2)));
    }
  };

  useEffect(() => {
    if (!isAutoFit || viewMode !== "canvas") return;
    calculateAutoFit();
    window.addEventListener("resize", calculateAutoFit);
    return () => window.removeEventListener("resize", calculateAutoFit);
  }, [isAutoFit, viewMode]);

  // Recruiter Unlock Submission
  const handleUnlockSubmit = async (e) => {
    e.preventDefault();
    if (!unlockPassword.trim()) {
      setUnlockError("Please enter the password or PIN.");
      return;
    }

    setIsSubmittingUnlock(true);
    setUnlockError("");

    try {
      const response = await axiosInstance.post(API_PATHS.RESUME.UNLOCK_PUBLIC(slug), {
        password: unlockPassword.trim(),
      });

      const token = response.data.unlockToken;
      if (token) {
        sessionStorage.setItem(`resuma_unlock_${slug}`, token);
        setUnlockToken(token);
      }

      setIsUnlocked(true);
      setOpenUnlockModal(false);
      setUnlockPassword("");

      // Update in-memory resume data with unmasked information
      setResume((prev) => ({
        ...prev,
        isUnlocked: true,
        data: response.data.data || {
          ...prev.data,
          basics: response.data.basics || prev.data?.basics,
          sections: response.data.sections || prev.data?.sections,
        },
      }));

      toast.success("Contact details unlocked successfully!");
    } catch (err) {
      console.error("Unlock error:", err);
      setUnlockError(err.response?.data?.message || "Incorrect password or PIN.");
    } finally {
      setIsSubmittingUnlock(false);
    }
  };

  // 1-Click Server-Side Headless Vector PDF Download
  const handleDownloadPdf = async () => {
    if (!slug || isExporting) return;
    setIsExporting(true);
    const toastId = toast.loading("Generating vector PDF...", { id: "public-pdf" });

    try {
      const response = await axiosInstance.get(
        API_PATHS.RESUME.EXPORT_PUBLIC_PDF(slug, unlockToken),
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

  // 1-Click Server-Side Editable Word Document (.docx) Download
  const handleDownloadDocx = async () => {
    if (!slug || isExporting) return;
    setIsExporting(true);
    const toastId = toast.loading("Generating editable Word document (.docx)...", { id: "public-docx" });

    try {
      const response = await axiosInstance.get(
        API_PATHS.RESUME.EXPORT_PUBLIC_DOCX(slug, unlockToken),
        { responseType: "blob" }
      );

      let blobData = response.data;
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

      const safeTitle = (resume?.title || "Candidate-Resume")
        .replace(/[^a-zA-Z0-9-_ ]/g, "")
        .trim() || "Candidate-Resume";
      link.download = `${safeTitle}.docx`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success("Word document (.docx) downloaded successfully!", { id: toastId });
    } catch (err) {
      console.error("Public DOCX export error:", err);
      toast.error(err.response?.data?.message || "Failed to download Word document", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Portfolio link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mb-4" />
        <p className="text-sm font-medium text-gray-600 animate-pulse">
          Loading professional portfolio...
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
  const basics = resumeData.basics || {};
  const sections = resumeData.sections || {};
  const metadata = resumeData.metadata || {};
  const templateId = metadata.template || "azurill";
  const colorPalette = [
    metadata.theme?.background || "#ffffff",
    metadata.theme?.text || "#111827",
    metadata.theme?.primary || "#7c3aed",
  ];

  const hasProtection = Boolean(resume.isProtected);
  const isProtectedAndLocked = hasProtection && !isUnlocked;

  return (
    <div className="min-h-screen bg-[#fafafc] bg-[radial-gradient(ellipse_100%_45%_at_50%_-10%,rgba(147,40,231,0.07),rgba(255,255,255,0))] text-slate-800 antialiased flex flex-col font-sans">
      {/* Sticky Recruiter Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          {/* Left: Branding & Candidate Quick Profile */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0"
              title="Resuma AI"
            >
              <img src={LOGO} alt="Resuma AI" className="w-[115px]" />
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-purple-50 text-purple-700 border border-purple-200/60">
                Portfolio
              </span>
            </Link>

            <div className="h-5 w-px bg-slate-200 hidden sm:block" />

            <div>
              <h1 className="text-xs md:text-sm font-bold text-gray-900 line-clamp-1">
                {resume.title}
              </h1>
              <p className="text-[11px] text-gray-500 line-clamp-1">
                Candidate: {basics.name || resume.author?.name || "Professional"}
              </p>
            </div>
          </div>

          {/* Right: Security Badge, Analytics, and Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Password Protection Badge */}
            {hasProtection && (
              <button
                type="button"
                onClick={() => isProtectedAndLocked && setOpenUnlockModal(true)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-2xs transition-colors ${
                  isProtectedAndLocked
                    ? "bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 cursor-pointer"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-default"
                }`}
                title={
                  isProtectedAndLocked
                    ? "Contact information is password-protected. Click to unlock."
                    : "Contact information unlocked."
                }
              >
                {isProtectedAndLocked ? (
                  <>
                    <LuLock className="text-xs text-amber-600 shrink-0" />
                    <span>Locked Contact</span>
                  </>
                ) : (
                  <>
                    <LuShieldCheck className="text-xs text-emerald-600 shrink-0" />
                    <span>Unlocked</span>
                  </>
                )}
              </button>
            )}

            {/* Recruiter Live Views Count */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold shadow-2xs"
              title={`Viewed ${resume.viewsCount || 1} times`}
            >
              <LuEye className="text-xs" />
              <span>{resume.viewsCount || 1} Views</span>
            </div>

            {/* Copy Share Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              title="Copy public portfolio link"
            >
              {copied ? (
                <LuCheck className="text-xs text-emerald-600" />
              ) : (
                <LuCopy className="text-xs" />
              )}
              <span className="hidden sm:inline">{copied ? "Copied" : "Share"}</span>
            </button>

            {/* Download Vector PDF */}
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <div className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LuDownload className="text-sm" />
              )}
              <span>Download PDF</span>
            </button>

            {/* Download Word Document (.docx) */}
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadDocx}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
              title="Download editable Microsoft Word document (.docx)"
            >
              <LuFileText className="text-sm" />
              <span className="hidden md:inline">Word</span>
              <span>(.docx)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Viewport Container */}
      <main
        ref={containerRef}
        className="flex-1 flex flex-col items-center justify-start p-4 md:p-8 overflow-auto custom-scrollbar"
      >
        {/* View Switcher & Toolbar */}
        <div className="public-toolbar mb-6 flex items-center justify-between gap-3 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-gray-200 shadow-md text-xs text-gray-700 select-none max-w-xl w-full flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode("canvas")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "canvas"
                  ? "bg-white text-purple-700 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <LuFileSpreadsheet className="text-sm" />
              <span>Document (A4)</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("portfolio")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "portfolio"
                  ? "bg-white text-purple-700 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <LuLayoutGrid className="text-sm" />
              <span>Web Portfolio</span>
            </button>
          </div>

          {/* Canvas Zoom Controls (Only in Canvas Mode) */}
          {viewMode === "canvas" && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setIsAutoFit(false);
                  setZoom((prev) => Math.max(0.4, Number((prev - 0.05).toFixed(2))));
                }}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
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
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
                title="Zoom in"
              >
                <LuZoomIn className="text-sm" />
              </button>
              <div className="h-3.5 w-px bg-gray-200 mx-1" />
              <button
                type="button"
                onClick={() => {
                  setIsAutoFit(true);
                  calculateAutoFit();
                }}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isAutoFit
                    ? "bg-purple-50 text-purple-700 border-purple-200"
                    : "hover:bg-gray-100 text-gray-600 border-transparent"
                }`}
                title="Fit to screen width"
              >
                <LuMaximize2 className="text-xs" />
              </button>
            </div>
          )}

          {/* Unlocked / Locked Quick Action */}
          {isProtectedAndLocked && (
            <button
              type="button"
              onClick={() => setOpenUnlockModal(true)}
              className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors cursor-pointer"
            >
              <LuKeyRound className="text-xs" />
              <span>Unlock Info</span>
            </button>
          )}
        </div>

        {/* View 1: Canvas A4 Document Mode */}
        {viewMode === "canvas" ? (
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
        ) : (
          /* View 2: Responsive Web Portfolio Mode */
          <div className="max-w-4xl w-full flex flex-col gap-6 mb-16 animate-fadeIn">
            {/* Hero Profile Card */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
                {/* Candidate Picture */}
                {basics.picture?.url && !basics.picture?.effects?.hidden ? (
                  <img
                    src={basics.picture.url}
                    alt={basics.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-purple-100 shadow-md shrink-0"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-3xl shadow-md shrink-0">
                    {(basics.name || "P").charAt(0)}
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                      {basics.name}
                    </h2>
                    {hasProtection && isProtectedAndLocked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        <LuLock className="text-[10px]" /> Protected Contact
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <LuShieldCheck className="text-[10px]" /> Verified Candidate
                      </span>
                    )}
                  </div>

                  <p className="text-base font-semibold text-purple-700 mt-1">
                    {basics.headline || resume.title}
                  </p>

                  {/* Sensitive Contact Badges */}
                  <div className="flex items-center gap-2.5 flex-wrap mt-4 text-xs">
                    {/* Location */}
                    {basics.location && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700">
                        <LuMapPin className="text-purple-600 text-sm" />
                        <span>{basics.location}</span>
                      </div>
                    )}

                    {/* Email */}
                    {basics.email && (
                      <div
                        onClick={() => isProtectedAndLocked && setOpenUnlockModal(true)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
                          isProtectedAndLocked
                            ? "bg-amber-50/70 border-amber-200 text-amber-900 cursor-pointer hover:bg-amber-100"
                            : "bg-gray-50 border-gray-200 text-gray-700"
                        }`}
                        title={isProtectedAndLocked ? "Click to unlock candidate email" : ""}
                      >
                        <LuMail className="text-purple-600 text-sm" />
                        <span>{basics.email}</span>
                        {isProtectedAndLocked && (
                          <LuLock className="text-[10px] text-amber-600 ml-1" />
                        )}
                      </div>
                    )}

                    {/* Phone */}
                    {basics.phone && (
                      <div
                        onClick={() => isProtectedAndLocked && setOpenUnlockModal(true)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
                          isProtectedAndLocked
                            ? "bg-amber-50/70 border-amber-200 text-amber-900 cursor-pointer hover:bg-amber-100"
                            : "bg-gray-50 border-gray-200 text-gray-700"
                        }`}
                        title={isProtectedAndLocked ? "Click to unlock candidate phone" : ""}
                      >
                        <LuPhone className="text-purple-600 text-sm" />
                        <span>{basics.phone}</span>
                        {isProtectedAndLocked && (
                          <LuLock className="text-[10px] text-amber-600 ml-1" />
                        )}
                      </div>
                    )}

                    {/* Personal URL */}
                    {basics.url?.href && (
                      <a
                        href={basics.url.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-200 text-gray-700 hover:text-purple-700 transition-colors"
                      >
                        <LuGlobe className="text-purple-600 text-sm" />
                        <span>{basics.url.label || basics.url.href}</span>
                      </a>
                    )}
                  </div>

                  {/* Online Profiles */}
                  {sections.profiles?.items?.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap mt-3">
                      {sections.profiles.items.map((prof, i) => (
                        <a
                          key={i}
                          href={prof.url?.href || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-800 transition-colors"
                        >
                          <span>{prof.network || "Profile"}:</span>
                          <span className="font-semibold">{prof.username || prof.url?.label}</span>
                          <LuExternalLink className="text-[10px]" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Unlock Banner when locked */}
              {isProtectedAndLocked && (
                <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white text-amber-700 shadow-2xs">
                      <LuLock className="text-lg" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">
                        Sensitive Contact Information Protected
                      </p>
                      <p className="text-[11px] text-gray-600">
                        Candidate email, phone number, and direct contact details require an access PIN.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenUnlockModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <LuKeyRound className="text-sm" />
                    <span>Enter PIN / Password</span>
                  </button>
                </div>
              )}
            </div>

            {/* Professional Summary */}
            {sections.summary?.visible && sections.summary?.content && (
              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <LuSparkles className="text-purple-600 text-lg" />
                  <span>{sections.summary.name || "Professional Summary"}</span>
                </h3>
                <div
                  className="text-sm text-gray-700 leading-relaxed prose prose-purple max-w-none"
                  dangerouslySetInnerHTML={{ __html: sections.summary.content }}
                />
              </div>
            )}

            {/* Work Experience */}
            {sections.experience?.visible && sections.experience?.items?.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <LuBriefcase className="text-purple-600 text-lg" />
                  <span>{sections.experience.name || "Work Experience"}</span>
                </h3>
                <div className="flex flex-col gap-6">
                  {sections.experience.items.map((exp, i) => (
                    <div
                      key={i}
                      className="border-l-2 border-purple-200 pl-4 sm:pl-6 pb-2 relative last:pb-0"
                    >
                      <div className="absolute -left-[7px] top-1.5 size-3 rounded-full bg-purple-600 ring-4 ring-purple-100" />
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">
                            {exp.position}
                          </h4>
                          <p className="text-xs font-semibold text-purple-700">
                            {exp.company}
                            {exp.location && ` • ${exp.location}`}
                          </p>
                        </div>
                        {exp.date && (
                          <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                            {exp.date}
                          </span>
                        )}
                      </div>
                      {exp.summary && (
                        <div
                          className="text-xs sm:text-sm text-gray-600 mt-2.5 leading-relaxed prose prose-purple max-w-none"
                          dangerouslySetInnerHTML={{ __html: exp.summary }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Skills */}
            {sections.skills?.visible && sections.skills?.items?.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <LuCode className="text-purple-600 text-lg" />
                  <span>{sections.skills.name || "Skills & Expertise"}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sections.skills.items.map((sk, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-gray-900">
                          {sk.name}
                        </span>
                        {sk.level && (
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                            Level {sk.level}/5
                          </span>
                        )}
                      </div>
                      {sk.description && (
                        <p className="text-[11px] text-gray-500 mt-1">
                          {sk.description}
                        </p>
                      )}
                      {sk.keywords && (
                        <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                          {Array.isArray(sk.keywords)
                            ? sk.keywords.map((kw, ki) => (
                                <span
                                  key={ki}
                                  className="text-[11px] font-medium bg-white text-gray-700 px-2 py-0.5 rounded-md border border-gray-200"
                                >
                                  {kw}
                                </span>
                              ))
                            : String(sk.keywords)
                                .split(",")
                                .map((kw, ki) => (
                                  <span
                                    key={ki}
                                    className="text-[11px] font-medium bg-white text-gray-700 px-2 py-0.5 rounded-md border border-gray-200"
                                  >
                                    {kw.trim()}
                                  </span>
                                ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Projects */}
            {sections.projects?.visible && sections.projects?.items?.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <LuSparkles className="text-purple-600 text-lg" />
                  <span>{sections.projects.name || "Key Projects"}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sections.projects.items.map((proj, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-gray-900">
                            {proj.name}
                          </h4>
                          {proj.date && (
                            <span className="text-[10px] text-gray-500 font-medium">
                              {proj.date}
                            </span>
                          )}
                        </div>
                        {proj.description && (
                          <p className="text-[11px] font-semibold text-purple-700 mt-0.5">
                            {proj.description}
                          </p>
                        )}
                        {proj.summary && (
                          <div
                            className="text-xs text-gray-600 mt-2 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: proj.summary }}
                          />
                        )}
                      </div>

                      {proj.url?.href && (
                        <a
                          href={proj.url.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 mt-3 self-start"
                        >
                          <span>{proj.url.label || "View Project"}</span>
                          <LuExternalLink className="text-xs" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education & Certifications */}
            {sections.education?.visible && sections.education?.items?.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <LuGraduationCap className="text-purple-600 text-lg" />
                  <span>{sections.education.name || "Education"}</span>
                </h3>
                <div className="flex flex-col gap-4">
                  {sections.education.items.map((edu, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3 last:border-none last:pb-0 flex-wrap"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">
                          {edu.studyType} in {edu.area}
                        </h4>
                        <p className="text-xs font-semibold text-purple-700">
                          {edu.institution}
                        </p>
                        {edu.score && (
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            Grade: {edu.score}
                          </p>
                        )}
                      </div>
                      {edu.date && (
                        <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                          {edu.date}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="public-toolbar text-center pb-8 text-xs text-gray-400">
          <p>
            Hosted on{" "}
            <Link to="/" className="text-purple-600 hover:underline font-semibold">
              Resuma AI
            </Link>{" "}
            — Executive AI Resume & Portfolio Builder
          </p>
        </footer>
      </main>

      {/* Floating Mobile Action Pill (Sticky Download Bar) */}
      <div className="sm:hidden fixed bottom-4 left-4 right-4 z-30 bg-white/95 backdrop-blur-xl border border-gray-200/90 rounded-2xl p-2.5 shadow-xl flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === "canvas" ? "portfolio" : "canvas")}
            className="px-2.5 py-1.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            {viewMode === "canvas" ? "Portfolio View" : "A4 View"}
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={isExporting}
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            <LuDownload className="text-sm" />
            <span>PDF</span>
          </button>
          <button
            type="button"
            disabled={isExporting}
            onClick={handleDownloadDocx}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors disabled:opacity-50"
          >
            <LuFileText className="text-sm" />
            <span>Word</span>
          </button>
        </div>
      </div>

      {/* Recruiter Unlock PIN Modal */}
      {openUnlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-3xl border border-gray-200 p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => {
                setOpenUnlockModal(false);
                setUnlockError("");
              }}
              className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <LuX className="text-lg" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 shadow-xs">
              <LuKeyRound className="text-2xl" />
            </div>

            <h3 className="text-base font-bold text-gray-900 text-center">
              Unlock Contact Information
            </h3>
            <p className="text-xs text-gray-500 text-center mt-1 mb-5">
              Enter the access PIN or password provided by the candidate to view full contact details.
            </p>

            <form onSubmit={handleUnlockSubmit} className="flex flex-col gap-3">
              <div>
                <input
                  type="password"
                  autoFocus
                  placeholder="Enter PIN or password..."
                  value={unlockPassword}
                  onChange={(e) => {
                    setUnlockPassword(e.target.value);
                    setUnlockError("");
                  }}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-center tracking-widest text-gray-800"
                />
                {unlockError && (
                  <p className="text-[11px] font-semibold text-rose-600 mt-1.5 text-center">
                    {unlockError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmittingUnlock}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmittingUnlock ? (
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LuLockOpen className="text-sm" />
                    <span>Unlock Details</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicResumeView;
