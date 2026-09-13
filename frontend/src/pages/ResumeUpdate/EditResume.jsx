import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LuPalette,
  LuSave,
  LuTrash2,
  LuEye,
  LuDownload,
  LuArrowLeft,
  LuInfo,
  LuTarget,
  LuShare2,
  LuColumns2,
  LuPencil,
  LuCheck,
  LuRefreshCw,
  LuSparkles,
  LuUndo2,
  LuRedo2,
  LuChevronDown,
  LuPrinter,
  LuFileJson,
  LuEllipsis,
} from "react-icons/lu";
import toast from "react-hot-toast";

// Hooks
import { useResumeData } from "./hooks/useResumeData";
import { useResumeExport } from "./hooks/useResumeExport";

// Layout & UI
import TitleInput from "../../components/Inputs/TitleInput";
import Modal from "../../components/shared/Modal.jsx";
import ConfirmModal from "../../components/shared/ConfirmModal.jsx";
import EditorSidebar from "./components/EditorSidebar.jsx";
import ResumeCanvas from "./components/ResumeCanvas.jsx";
import JobMatchModal from "./components/JobMatchModal.jsx";
import ResumeAuditModal from "./components/ResumeAuditModal.jsx";
import ShareModal from "./components/ShareModal.jsx";
import ThemeSelector from "./ThemeSelector.jsx";
import RenderResume from "../../components/ResumeTemplates/RenderResume";
import { RESUME_TEMPLATES } from "../../constants";
import { exportToJsonResume } from "../../utils/jsonResumeAdapter";
import { runResumeAudit } from "../../utils/resumeAuditEngine";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

// Section Forms
import PersonalInfoForm from "./Forms/PersonalInfoForm";
import SummarySectionForm from "./Forms/SummarySectionForm";
import ProfileForm from "./Forms/ProfileForm";
import ExperienceForm from "./Forms/ExperienceForm";
import EducationForm from "./Forms/EducationForm";
import SkillsForm from "./Forms/SkillsForm";
import ProjectsForm from "./Forms/ProjectsForm";
import CertificationsForm from "./Forms/CertificationsForm";
import AwardsForm from "./Forms/AwardsForm";
import VolunteeringForm from "./Forms/VolunteeringForm";
import ReferenceForm from "./Forms/ReferenceForm";
import LanguageForm from "./Forms/LanguageForm";
import InterestForm from "./Forms/InterestForm";
import PublicationsForm from "./Forms/PublicationsForm";

// Defaults
import {
  defaultProfileItem,
  defaultExperienceItem,
  defaultEducationItem,
  defaultSkillsItem,
  defaultProjectsItem,
  defaultCertificationsItem,
  defaultAwardItem,
  defaultLanguageItem,
  defaultInterestItem,
  defaultPublicationItem,
  defaultVolunteerItem,
  defaultReferenceItem,
} from "../../constants";

const EditResume = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const resumeRef = useRef(null);
  const resumeDownloadRef = useRef(null);
  const offscreenCaptureRef = useRef(null);
  const lastSavedDataRef = useRef(null);
  const initialLoadedRef = useRef(false);
  const autoSaveTimerRef = useRef(null);
  const exportMenuRef = useRef(null);
  const moreMenuRef = useRef(null);
  const aiMenuRef = useRef(null);
  const viewMenuRef = useRef(null);

  const [activePage, setActivePage] = useState("personal-info");
  const [newProfileImageFile, setNewProfileImageFile] = useState(null);
  const [openJobMatchModal, setOpenJobMatchModal] = useState(false);
  const [openAuditModal, setOpenAuditModal] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  const [viewMode, setViewMode] = useState("split"); // "split" | "edit" | "preview"
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const [viewMenuOpen, setViewMenuOpen] = useState(false);

  // Close dropdown menus on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setExportMenuOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setMoreMenuOpen(false);
      }
      if (aiMenuRef.current && !aiMenuRef.current.contains(event.target)) {
        setAiMenuOpen(false);
      }
      if (viewMenuRef.current && !viewMenuRef.current.contains(event.target)) {
        setViewMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setExportMenuOpen(false);
        setMoreMenuOpen(false);
        setAiMenuOpen(false);
        setViewMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Modular Hooks
  const {
    resumeData,
    setResumeData,
    isLoading,
    isSaving,
    errorMsg,
    updateSection,
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
    toggleSectionVisibility,
    reorderSections,
    updateFontFamily,
    saveResume,
    uploadImagesAndSave,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useResumeData(resumeId);

  // Global Keyboard Shortcuts for Undo (Ctrl+Z / Cmd+Z) and Redo (Ctrl+Y / Cmd+Y / Ctrl+Shift+Z / Cmd+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCtrl = e.ctrlKey || e.metaKey;
      if (!isCtrl) return;

      // Don't intercept native undo/redo if the user is typing inside an input, textarea, or contentEditable (Tiptap)
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isContentEditable = document.activeElement?.isContentEditable;
      if (activeTag === "input" || activeTag === "textarea" || isContentEditable) {
        return;
      }

      if (e.key === "z" || e.key === "Z") {
        if (e.shiftKey) {
          e.preventDefault();
          if (canRedo) redo();
        } else {
          e.preventDefault();
          if (canUndo) undo();
        }
      } else if (e.key === "y" || e.key === "Y") {
        e.preventDefault();
        if (canRedo) redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  // Real-time deterministic audit score for studio header
  const liveAudit = useMemo(() => {
    return runResumeAudit(resumeData?.data || resumeData || {});
  }, [resumeData]);

  const handleApplyBulletRewrite = (original, improved) => {
    const currentExp = resumeData?.data?.sections?.experience?.items || [];
    let updated = false;

    const newExp = currentExp.map((exp) => {
      if (!updated && exp.summary && exp.summary.includes(original)) {
        updated = true;
        return {
          ...exp,
          summary: exp.summary.replace(original, improved),
        };
      }
      return exp;
    });

    if (updated) {
      updateSection("experience", { items: newExp });
      return;
    }

    const currentProj = resumeData?.data?.sections?.projects?.items || [];
    const newProj = currentProj.map((proj) => {
      if (!updated && (proj.summary || proj.description) && (proj.summary?.includes(original) || proj.description?.includes(original))) {
        updated = true;
        return {
          ...proj,
          summary: (proj.summary || "").replace(original, improved),
          description: (proj.description || "").replace(original, improved),
        };
      }
      return proj;
    });

    if (updated) {
      updateSection("projects", { items: newProj });
    }
  };

  const {
    openThemeSelector,
    setOpenThemeSelector,
    openPreviewModal,
    setOpenPreviewModal,
    isExporting,
    handleDownloadVectorPdf,
  } = useResumeExport(resumeId, resumeData?.title);

  // Snapshot initial loaded data
  useEffect(() => {
    if (!isLoading && resumeData?._id && !initialLoadedRef.current) {
      initialLoadedRef.current = true;
      lastSavedDataRef.current = JSON.stringify(resumeData);
    }
  }, [isLoading, resumeData]);

  // Background debounced auto-save (1.5s debounce)
  useEffect(() => {
    if (!initialLoadedRef.current || isLoading || isDeleting || isNavigatingBack) return;

    const currentString = JSON.stringify(resumeData);
    if (lastSavedDataRef.current === null) {
      lastSavedDataRef.current = currentString;
      return;
    }

    if (currentString === lastSavedDataRef.current) {
      return;
    }

    setHasUnsavedChanges(true);

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        await saveResume(resumeData, true);
        lastSavedDataRef.current = JSON.stringify(resumeData);
        setHasUnsavedChanges(false);
      } catch (err) {
        console.warn("Background auto-save failed:", err);
      }
    }, 1500);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [resumeData, isLoading, isDeleting, isNavigatingBack, saveResume]);

  // Memoized Theme Colors to prevent unneeded child canvas re-renders
  const themeColorPalette = useMemo(() => [
    resumeData?.data?.metadata?.theme?.background,
    resumeData?.data?.metadata?.theme?.text,
    resumeData?.data?.metadata?.theme?.primary,
  ], [
    resumeData?.data?.metadata?.theme?.background,
    resumeData?.data?.metadata?.theme?.text,
    resumeData?.data?.metadata?.theme?.primary,
  ]);

  const currentTemplateId =
    resumeData?.data?.metadata?.template ||
    resumeData?.template ||
    RESUME_TEMPLATES[0].id;

  // Quick-add missing skill from Job Match analysis
  const handleAddMissingSkill = (skillName) => {
    setResumeData((prev) => {
      const skillsSection = prev.data?.sections?.skills || { items: [] };
      const currentItems = skillsSection.items || [];

      if (currentItems.length > 0) {
        const firstCategory = currentItems[0];
        const existingKeywords = firstCategory.keywords || "";
        const updatedKeywords = existingKeywords
          ? `${existingKeywords}, ${skillName}`
          : skillName;

        const updatedItems = [...currentItems];
        updatedItems[0] = { ...firstCategory, keywords: updatedKeywords };

        return {
          ...prev,
          data: {
            ...prev.data,
            sections: {
              ...prev.data.sections,
              skills: {
                ...skillsSection,
                items: updatedItems,
              },
            },
          },
        };
      } else {
        return {
          ...prev,
          data: {
            ...prev.data,
            sections: {
              ...prev.data.sections,
              skills: {
                ...skillsSection,
                items: [
                  {
                    name: "Core Skills",
                    keywords: skillName,
                    level: 4,
                  },
                ],
              },
            },
          },
        };
      }
    });
  };

  // Delete Resume
  const handleDeleteResume = () => {
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeId));
      toast.success("Resume deleted successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Delete resume error:", error);
      toast.error(error.response?.data?.message || "Failed to delete resume");
    } finally {
      setIsDeleting(false);
      setOpenDeleteModal(false);
    }
  };

  // Manual Save Handler
  const handleManualSave = async () => {
    try {
      toast.loading("Saving resume & thumbnail...", { id: "manual-save" });
      const targetElement = offscreenCaptureRef.current || resumeRef.current;
      await uploadImagesAndSave(newProfileImageFile, targetElement, true);
      lastSavedDataRef.current = JSON.stringify(resumeData);
      setHasUnsavedChanges(false);
      toast.success("Resume & thumbnail saved!", { id: "manual-save" });
    } catch (err) {
      console.error("Manual save failed:", err);
      toast.error("Failed to save resume", { id: "manual-save" });
    }
  };

  // Back to Dashboard Handler (Auto-saves progress & generates dashboard thumbnail)
  const handleBackToDashboard = async () => {
    if (isNavigatingBack) return;
    setIsNavigatingBack(true);

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    try {
      toast.loading("Saving progress & thumbnail...", { id: "back-nav-save" });
      const targetElement = offscreenCaptureRef.current || resumeRef.current;
      await uploadImagesAndSave(newProfileImageFile, targetElement, true);
      toast.success("Progress saved!", { id: "back-nav-save" });
    } catch (err) {
      console.warn("Save on back encountered an issue, saving data directly:", err);
      try {
        await saveResume(resumeData, true);
        toast.success("Progress saved!", { id: "back-nav-save" });
      } catch (fallbackErr) {
        console.error("Critical: Could not save resume data on back navigation:", fallbackErr);
      }
    } finally {
      navigate("/dashboard");
    }
  };

  // Export as standard JSON Resume
  const handleExportJson = () => {
    try {
      exportToJsonResume(resumeData, resumeData?.title);
      toast.success("Standard JSON Resume file exported successfully");
    } catch (err) {
      console.error("JSON Resume export error:", err);
      toast.error("Failed to export JSON Resume file");
    }
  };

  // Section Form Renderer
  const renderForm = () => {
    if (!resumeData?.data || !resumeData.data.basics) return null;
    const sections = resumeData.data.sections || {};

    switch (activePage) {
      case "personal-info":
        return (
          <PersonalInfoForm
            profileData={resumeData.data.basics}
            updateSection={(key, value) => updateSection("basics", key, value)}
          />
        );

      case "summary":
        return (
          <div className="p-1 sm:p-2">
            <SummarySectionForm
              sectionId="summary"
              item={{
                name: resumeData.data?.basics?.name || "",
                headline: resumeData.data?.basics?.headline || "",
              }}
              content={sections.summary?.content || ""}
              updateContent={(newContent) =>
                setResumeData((prev) => ({
                  ...prev,
                  data: {
                    ...prev.data,
                    sections: {
                      ...prev.data.sections,
                      summary: {
                        ...prev.data.sections.summary,
                        content: newContent,
                      },
                    },
                  },
                }))
              }
            />
          </div>
        );

      case "profiles":
        return (
          <ProfileForm
            profiles={sections.profiles?.items || []}
            updateArrayItem={(index, key, value) => updateArrayItem("profiles", index, key, value)}
            addArrayItem={() => addArrayItem("profiles", defaultProfileItem)}
            removeArrayItem={(index) => removeArrayItem("profiles", index)}
            setResumeData={setResumeData}
          />
        );

      case "experience":
        return (
          <ExperienceForm
            experience={sections.experience?.items || []}
            updateArrayItem={(index, key, value) => updateArrayItem("experience", index, key, value)}
            addArrayItem={() => addArrayItem("experience", defaultExperienceItem)}
            removeArrayItem={(index) => removeArrayItem("experience", index)}
            setResumeData={setResumeData}
          />
        );

      case "education":
        return (
          <EducationForm
            education={sections.education?.items || []}
            updateArrayItem={(index, key, value) => updateArrayItem("education", index, key, value)}
            addArrayItem={() => addArrayItem("education", defaultEducationItem)}
            removeArrayItem={(index) => removeArrayItem("education", index)}
            setResumeData={setResumeData}
          />
        );

      case "skills":
        return (
          <SkillsForm
            skills={sections.skills?.items || []}
            updateArrayItem={(index, key, value) => updateArrayItem("skills", index, key, value)}
            addArrayItem={() => addArrayItem("skills", defaultSkillsItem)}
            removeArrayItem={(index) => removeArrayItem("skills", index)}
            setResumeData={setResumeData}
          />
        );

      case "projects":
        return (
          <ProjectsForm
            projects={sections.projects?.items || []}
            updateArrayItem={(index, key, value) => updateArrayItem("projects", index, key, value)}
            addArrayItem={() => addArrayItem("projects", defaultProjectsItem)}
            removeArrayItem={(index) => removeArrayItem("projects", index)}
            setResumeData={setResumeData}
          />
        );

      case "certifications":
        return (
          <CertificationsForm
            certifications={sections.certifications?.items || []}
            updateArrayItem={(index, key, value) => updateArrayItem("certifications", index, key, value)}
            addArrayItem={() => addArrayItem("certifications", defaultCertificationsItem)}
            removeArrayItem={(index) => removeArrayItem("certifications", index)}
            setResumeData={setResumeData}
          />
        );

      case "awards":
        return (
          <AwardsForm
            awards={sections.awards?.items || []}
            updateArrayItem={(index, key, value) => updateArrayItem("awards", index, key, value)}
            addArrayItem={() => addArrayItem("awards", defaultAwardItem)}
            removeArrayItem={(index) => removeArrayItem("awards", index)}
            setResumeData={setResumeData}
          />
        );

      case "languages":
        return (
          <LanguageForm
            languages={sections.languages?.items || []}
            updateArrayItem={(index, key, value) => updateArrayItem("languages", index, key, value)}
            addArrayItem={() => addArrayItem("languages", defaultLanguageItem)}
            removeArrayItem={(index) => removeArrayItem("languages", index)}
            setResumeData={setResumeData}
          />
        );

      case "interests":
        return (
          <InterestForm
            interests={sections.interests?.items || []}
            updateArrayItem={(index, key, value) => updateArrayItem("interests", index, key, value)}
            addArrayItem={() => addArrayItem("interests", defaultInterestItem)}
            removeArrayItem={(index) => removeArrayItem("interests", index)}
            setResumeData={setResumeData}
          />
        );

      case "publications":
        return (
          <PublicationsForm
            publications={sections.publications?.items || []}
            updateArrayItem={(index, key, value) => updateArrayItem("publications", index, key, value)}
            addArrayItem={() => addArrayItem("publications", defaultPublicationItem)}
            removeArrayItem={(index) => removeArrayItem("publications", index)}
            setResumeData={setResumeData}
          />
        );

      case "volunteer":
        return (
          <VolunteeringForm
            volunteer={sections.volunteer?.items || []}
            updateArrayItem={(index, key, value) => updateArrayItem("volunteer", index, key, value)}
            addArrayItem={() => addArrayItem("volunteer", defaultVolunteerItem)}
            removeArrayItem={(index) => removeArrayItem("volunteer", index)}
            setResumeData={setResumeData}
          />
        );

      case "references":
        return (
          <ReferenceForm
            references={sections.references?.items || []}
            updateArrayItem={(index, key, value) => updateArrayItem("references", index, key, value)}
            addArrayItem={() => addArrayItem("references", defaultReferenceItem)}
            removeArrayItem={(index) => removeArrayItem("references", index)}
            setResumeData={setResumeData}
          />
        );

      default:
        return (
          <PersonalInfoForm
            profileData={resumeData.data.basics}
            updateSection={(key, value) => updateSection("basics", key, value)}
            resumeData={resumeData}
            setResumeData={setResumeData}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-purple-600 border-t-transparent"></div>
          <span className="text-xs font-medium text-slate-500">Loading Resume Studio...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-100 font-sans">
      {/* 1. Studio Top Navigation Bar (Standardized 64px Bar - Cohesive Branding & Workspace Actions) */}
      <header className="h-16 shrink-0 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between z-30 shadow-2xs">
        {/* Left: Back button + Full Title + Real-time Save Status */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={handleBackToDashboard}
            disabled={isNavigatingBack}
            className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            title="Save progress & Back to Dashboard"
          >
            {isNavigatingBack ? (
              <LuRefreshCw className="text-lg animate-spin text-purple-600" />
            ) : (
              <LuArrowLeft className="text-xl text-slate-700" />
            )}
          </button>

          {/* Title with hover edit */}
          <div className="flex items-center gap-2 min-w-0 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
            <TitleInput
              title={resumeData?.title || ""}
              setTitle={(value) => setResumeData((prev) => ({ ...prev, title: value }))}
            />
          </div>

          {/* Real-time Save Status Pill */}
          <div className="hidden sm:flex items-center text-xs font-medium shrink-0">
            {isSaving || isNavigatingBack ? (
              <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/80">
                <LuRefreshCw className="animate-spin text-xs text-amber-600" />
                <span>Saving...</span>
              </span>
            ) : hasUnsavedChanges ? (
              <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/80" title="Changes pending auto-save">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>Unsaved changes</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70">
                <LuCheck className="text-xs" /> Saved
              </span>
            )}
          </div>
        </div>

        {/* Right: Studio Action Buttons (All tools, View dropdown & Undo/Redo together) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* 1. Undo / Redo Actions (Crisp segmented pill matching adjacent studio tools) */}
          <div className="flex items-center bg-white border border-slate-200/90 shadow-2xs rounded-xl p-0.5 shrink-0 h-[34px]">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className={`w-7 h-7 rounded-lg text-xs transition-all flex items-center justify-center ${
                canUndo
                  ? "text-slate-700 hover:text-purple-700 hover:bg-purple-50 active:bg-purple-100/70 cursor-pointer active:scale-95"
                  : "text-slate-300/80 cursor-not-allowed"
              }`}
              title="Undo (Ctrl+Z)"
              aria-label="Undo"
            >
              <LuUndo2 className="text-sm stroke-[2.2]" />
            </button>
            <div className="h-3.5 w-px bg-slate-200/80 shrink-0" />
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className={`w-7 h-7 rounded-lg text-xs transition-all flex items-center justify-center ${
                canRedo
                  ? "text-slate-700 hover:text-purple-700 hover:bg-purple-50 active:bg-purple-100/70 cursor-pointer active:scale-95"
                  : "text-slate-300/80 cursor-not-allowed"
              }`}
              title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
              aria-label="Redo"
            >
              <LuRedo2 className="text-sm stroke-[2.2]" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 shrink-0 hidden sm:block" />

          {/* 2. Workspace View Dropdown (Moved to the right side with other dropdowns) */}
          <div className="relative" ref={viewMenuRef}>
            <button
              type="button"
              onClick={() => {
                setViewMenuOpen((prev) => !prev);
                setExportMenuOpen(false);
                setMoreMenuOpen(false);
                setAiMenuOpen(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-2xs transition-all cursor-pointer h-[34px] ${
                viewMenuOpen
                  ? "bg-purple-50 text-purple-700 border-purple-300 shadow-xs"
                  : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90"
              }`}
              title="Switch Workspace View (Split, Form, Preview)"
            >
              {viewMode === "split" && <LuColumns2 className="text-sm text-purple-600 shrink-0" />}
              {viewMode === "edit" && <LuPencil className="text-sm text-purple-600 shrink-0" />}
              {viewMode === "preview" && <LuEye className="text-sm text-purple-600 shrink-0" />}
              <span>
                {viewMode === "split" ? "Split" : viewMode === "edit" ? "Form" : "Preview"}
              </span>
              <LuChevronDown
                className={`text-xs transition-transform duration-200 text-slate-400 ${
                  viewMenuOpen ? "rotate-180 text-purple-600" : ""
                }`}
              />
            </button>

            {/* Floating View Menu */}
            {viewMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-50 text-slate-700 animate-in fade-in-0 zoom-in-95 duration-100">
                <div className="px-3.5 py-1 border-b border-slate-100 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Workspace View
                </div>

                {/* Split */}
                <button
                  type="button"
                  onClick={() => {
                    setViewMode("split");
                    setViewMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    viewMode === "split" ? "bg-purple-50 text-purple-700 font-semibold" : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <LuColumns2 className="text-sm" />
                    <span>Split View</span>
                  </span>
                  {viewMode === "split" && <LuCheck className="text-xs text-purple-600" />}
                </button>

                {/* Form */}
                <button
                  type="button"
                  onClick={() => {
                    setViewMode("edit");
                    setViewMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    viewMode === "edit" ? "bg-purple-50 text-purple-700 font-semibold" : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <LuPencil className="text-sm" />
                    <span>Form View</span>
                  </span>
                  {viewMode === "edit" && <LuCheck className="text-xs text-purple-600" />}
                </button>

                {/* Preview */}
                <button
                  type="button"
                  onClick={() => {
                    setViewMode("preview");
                    setViewMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    viewMode === "preview" ? "bg-purple-50 text-purple-700 font-semibold" : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <LuEye className="text-sm" />
                    <span>Preview View</span>
                  </span>
                  {viewMode === "preview" && <LuCheck className="text-xs text-purple-600" />}
                </button>
              </div>
            )}
          </div>
          {/* 1. Smart AI & Audit Dropdown Menu */}
          <div className="relative" ref={aiMenuRef}>
            <button
              type="button"
              onClick={() => {
                setAiMenuOpen((prev) => !prev);
                setExportMenuOpen(false);
                setMoreMenuOpen(false);
              }}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                aiMenuOpen
                  ? "bg-purple-50 text-purple-700 border-purple-300 shadow-xs"
                  : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200/90 shadow-2xs"
              }`}
              title="AI Tools & ATS Quality Audit"
            >
              <LuSparkles className="text-xs text-purple-600 shrink-0" />
              <span
                className={`flex items-center justify-center w-5 h-5 rounded-lg text-[10px] font-black shrink-0 ${
                  liveAudit.overallScore >= 80
                    ? "bg-emerald-100 text-emerald-700"
                    : liveAudit.overallScore >= 65
                    ? "bg-amber-100 text-amber-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {liveAudit.overallScore}
              </span>
              <span className="hidden sm:inline font-semibold text-slate-700">
                AI & Audit
              </span>
              <LuChevronDown
                className={`text-xs transition-transform duration-200 text-slate-400 ${
                  aiMenuOpen ? "rotate-180 text-purple-600" : ""
                }`}
              />
            </button>

            {/* Floating AI & Audit Popover */}
            {aiMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 text-slate-700 animate-in fade-in-0 zoom-in-95 duration-100">
                {/* Header with mini score summary */}
                <div className="px-3.5 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    AI Intelligence Suite
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                      liveAudit.overallScore >= 80
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                        : liveAudit.overallScore >= 65
                        ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                        : "bg-rose-50 text-rose-700 border border-rose-200/60"
                    }`}
                  >
                    {liveAudit.grade || "ATS Score"}: {liveAudit.overallScore}/100
                  </span>
                </div>

                {/* 1. Full ATS Audit Item */}
                <button
                  type="button"
                  onClick={() => {
                    setAiMenuOpen(false);
                    setOpenAuditModal(true);
                  }}
                  className="w-full text-left px-3.5 py-2.5 text-xs flex items-center gap-3 hover:bg-emerald-50/80 hover:text-emerald-950 transition-colors cursor-pointer group"
                >
                  <span
                    className={`p-2 rounded-xl text-sm font-black shrink-0 ${
                      liveAudit.overallScore >= 80
                        ? "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200"
                        : "bg-amber-100 text-amber-700 group-hover:bg-amber-200"
                    }`}
                  >
                    <LuTarget className="text-sm" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-800 group-hover:text-emerald-900 flex items-center justify-between">
                      <span>ATS Resume Audit</span>
                      <span className="text-[9px] font-semibold text-emerald-600 group-hover:underline">View Report →</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      6-pillar check ({liveAudit.issues?.length || 0} issues detected)
                    </p>
                  </div>
                </button>

                {/* 2. Job Description Match */}
                <button
                  type="button"
                  onClick={() => {
                    setAiMenuOpen(false);
                    setOpenJobMatchModal(true);
                  }}
                  className="w-full text-left px-3.5 py-2.5 text-xs flex items-center gap-3 hover:bg-purple-50/80 hover:text-purple-950 transition-colors cursor-pointer group"
                >
                  <span className="p-2 rounded-xl bg-purple-100/90 text-purple-700 group-hover:bg-purple-200 transition-colors shrink-0">
                    <LuSparkles className="text-sm" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-800 group-hover:text-purple-900 flex items-center justify-between">
                      <span>AI Job Match</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-md">Gemini</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      Target role keywords & match score
                    </p>
                  </div>
                </button>

                {/* Contextual helper tip */}
                <div className="mx-3 mt-1.5 px-2.5 py-1.5 bg-slate-50 rounded-xl border border-slate-100 text-[10px] text-slate-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                  <span>Use AI rewrite directly on any bullet point</span>
                </div>
              </div>
            )}
          </div>

          {/* 2. Export Dropdown Menu (Primary Action) */}
          <div className="relative" ref={exportMenuRef}>
            <button
              type="button"
              disabled={isExporting}
              onClick={() => {
                setExportMenuOpen((prev) => !prev);
                setAiMenuOpen(false);
                setMoreMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
              title="Export Options (Vector PDF, Print, JSON)"
            >
              {isExporting ? (
                <LuRefreshCw className="text-xs animate-spin" />
              ) : (
                <LuDownload className="text-xs" />
              )}
              <span className="hidden sm:inline">{isExporting ? "Exporting..." : "Export"}</span>
              <LuChevronDown className={`text-xs transition-transform duration-200 ${exportMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Floating Export Menu */}
            {exportMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-50 text-slate-700 animate-in fade-in-0 zoom-in-95 duration-100">
                <div className="px-3.5 py-1 border-b border-slate-100 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Export Options
                </div>

                {/* Direct Vector PDF */}
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => {
                    setExportMenuOpen(false);
                    handleDownloadVectorPdf();
                  }}
                  className="w-full text-left px-3.5 py-2.5 text-xs flex items-center gap-3 hover:bg-emerald-50/80 hover:text-emerald-950 transition-colors cursor-pointer group disabled:opacity-50"
                >
                  <span className="p-2 rounded-xl bg-emerald-100/90 text-emerald-700 group-hover:bg-emerald-200 transition-colors shrink-0">
                    <LuDownload className="text-sm" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-800 group-hover:text-emerald-900 flex items-center justify-between">
                      <span>Download PDF</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md">Vector</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">Crisp, ATS-ready vector document</p>
                  </div>
                </button>

                {/* Browser Print Preview */}
                <button
                  type="button"
                  onClick={() => {
                    setExportMenuOpen(false);
                    setOpenPreviewModal(true);
                  }}
                  className="w-full text-left px-3.5 py-2.5 text-xs flex items-center gap-3 hover:bg-purple-50/80 hover:text-purple-950 transition-colors cursor-pointer group"
                >
                  <span className="p-2 rounded-xl bg-purple-100/90 text-purple-700 group-hover:bg-purple-200 transition-colors shrink-0">
                    <LuPrinter className="text-sm" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-800 group-hover:text-purple-900">
                      Print / System PDF
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">Open browser print preview</p>
                  </div>
                </button>

                {/* Export JSON Resume */}
                <button
                  type="button"
                  onClick={() => {
                    setExportMenuOpen(false);
                    handleExportJson();
                  }}
                  className="w-full text-left px-3.5 py-2.5 text-xs flex items-center gap-3 hover:bg-indigo-50/80 hover:text-indigo-950 transition-colors cursor-pointer group"
                >
                  <span className="p-2 rounded-xl bg-indigo-100/90 text-indigo-700 group-hover:bg-indigo-200 transition-colors shrink-0">
                    <LuFileJson className="text-sm" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-800 group-hover:text-indigo-900 flex items-center justify-between">
                      <span>JSON Resume</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-md">v1.0</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">Open-standard schema backup</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 3. More Actions Dropdown Menu (•••) */}
          <div className="relative" ref={moreMenuRef}>
            <button
              type="button"
              onClick={() => {
                setMoreMenuOpen((prev) => !prev);
                setExportMenuOpen(false);
                setAiMenuOpen(false);
              }}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                moreMenuOpen
                  ? "bg-slate-100 text-purple-700 border-purple-300 shadow-xs"
                  : "bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-200/90 shadow-2xs"
              }`}
              title="More studio options (Theme, Share, Save, Delete)"
              aria-label="More options"
            >
              <LuEllipsis className="text-base" />
            </button>

            {/* Floating More Menu */}
            {moreMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-50 text-slate-700 animate-in fade-in-0 zoom-in-95 duration-100">
                <div className="px-3.5 py-1 border-b border-slate-100 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Studio Utilities
                </div>

                {/* Change Theme */}
                <button
                  type="button"
                  onClick={() => {
                    setMoreMenuOpen(false);
                    setOpenThemeSelector(true);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 hover:bg-purple-50/80 hover:text-purple-900 transition-colors cursor-pointer group"
                >
                  <span className="p-1.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-purple-100 group-hover:text-purple-700 transition-colors">
                    <LuPalette className="text-sm" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-800 group-hover:text-purple-900">Change Theme</div>
                    <p className="text-[10px] text-slate-500">12 templates & custom palette</p>
                  </div>
                </button>

                {/* Share Public Link */}
                <button
                  type="button"
                  onClick={() => {
                    setMoreMenuOpen(false);
                    setOpenShareModal(true);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 hover:bg-purple-50/80 hover:text-purple-900 transition-colors cursor-pointer group"
                >
                  <span className="p-1.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-purple-100 group-hover:text-purple-700 transition-colors">
                    <LuShare2 className="text-sm" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-800 group-hover:text-purple-900">Share Publicly</div>
                    <p className="text-[10px] text-slate-500">Recruiter link & permissions</p>
                  </div>
                </button>

                {/* Manual Save Snapshot */}
                <button
                  type="button"
                  disabled={isSaving || isNavigatingBack}
                  onClick={() => {
                    setMoreMenuOpen(false);
                    handleManualSave();
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 hover:bg-purple-50/80 hover:text-purple-900 transition-colors cursor-pointer group disabled:opacity-50"
                >
                  <span className="p-1.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-purple-100 group-hover:text-purple-700 transition-colors">
                    {isSaving ? (
                      <LuRefreshCw className="text-sm animate-spin text-purple-600" />
                    ) : (
                      <LuSave className="text-sm" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-800 group-hover:text-purple-900">Save Snapshot</div>
                    <p className="text-[10px] text-slate-500">Update cloud thumbnail now</p>
                  </div>
                </button>

                <div className="border-t border-slate-100 my-1" />

                {/* Delete Resume */}
                <button
                  type="button"
                  onClick={() => {
                    setMoreMenuOpen(false);
                    handleDeleteResume();
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 hover:bg-rose-50/80 hover:text-rose-900 transition-colors cursor-pointer group"
                >
                  <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 group-hover:bg-rose-100 transition-colors">
                    <LuTrash2 className="text-sm" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-rose-700 group-hover:text-rose-900">Delete Resume</div>
                    <p className="text-[10px] text-rose-500">Permanently delete document</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Studio Workspace Body (Full Height: calc(100vh - 64px)) */}
      <main className="flex-1 h-[calc(100vh-64px)] flex overflow-hidden">
        {viewMode === "split" && (
          <div className="w-full h-full flex overflow-hidden">
            {/* Left: Section Navigation Sidebar */}
            <div className="h-full shrink-0">
              <EditorSidebar
                activePage={activePage}
                setActivePage={setActivePage}
                sections={resumeData.data?.sections || {}}
                layout={resumeData.data?.metadata?.layout || [[], []]}
                templateId={currentTemplateId}
                onToggleVisibility={toggleSectionVisibility}
                onReorderSections={reorderSections}
                onExportJson={handleExportJson}
                isSaving={isSaving}
              />
            </div>

            {/* Middle: Active Form Panel */}
            <div className="w-[490px] lg:w-[540px] xl:w-[580px] shrink-0 h-full overflow-y-auto bg-white border-r border-slate-200/80 p-5 lg:p-6 custom-scrollbar">
              {renderForm()}
            </div>

            {/* Right: Live A4 Resume Canvas (fills entire remaining space!) */}
            <div className="flex-1 min-w-0 h-full overflow-hidden bg-slate-100 flex flex-col">
              {resumeData?.data?.basics && (
                <ResumeCanvas
                  resumeData={resumeData?.data}
                  templateId={resumeData?.data?.metadata?.template || RESUME_TEMPLATES[0].id}
                  colorPalette={themeColorPalette}
                  canvasRef={resumeRef}
                  onUpdateFont={updateFontFamily}
                  activeFont={resumeData?.data?.metadata?.typography?.font?.family || resumeData?.data?.metadata?.fontFamily}
                />
              )}
            </div>
          </div>
        )}

        {viewMode === "edit" && (
          <div className="w-full h-full flex overflow-hidden">
            {/* Left Sidebar */}
            <div className="h-full shrink-0">
              <EditorSidebar
                activePage={activePage}
                setActivePage={setActivePage}
                sections={resumeData.data?.sections || {}}
                layout={resumeData.data?.metadata?.layout || [[], []]}
                templateId={currentTemplateId}
                onToggleVisibility={toggleSectionVisibility}
                onReorderSections={reorderSections}
                onExportJson={handleExportJson}
                isSaving={isSaving}
              />
            </div>

            {/* Expansive Form View */}
            <div className="flex-1 h-full overflow-y-auto bg-slate-50/60 p-6 sm:p-10 flex justify-center custom-scrollbar">
              <div className="w-full max-w-3xl bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8">
                {renderForm()}
              </div>
            </div>
          </div>
        )}

        {viewMode === "preview" && (
          <div className="w-full h-full overflow-hidden bg-slate-100 flex flex-col">
            {resumeData?.data?.basics && (
              <ResumeCanvas
                resumeData={resumeData?.data}
                templateId={resumeData?.data?.metadata?.template || RESUME_TEMPLATES[0].id}
                colorPalette={themeColorPalette}
                canvasRef={resumeRef}
                onUpdateFont={updateFontFamily}
                activeFont={resumeData?.data?.metadata?.typography?.font?.family || resumeData?.data?.metadata?.fontFamily}
              />
            )}
          </div>
        )}
      </main>

      {/* Theme Selector Modal */}
      <Modal
        isOpen={openThemeSelector}
        onClose={() => setOpenThemeSelector(false)}
        hideHeader={true}
        hideCloseBtn={true}
        noPadding={true}
        width="95vw"
        maxWidth="1400px"
        height="88vh"
      >
        <ThemeSelector
          selectedTheme={resumeData?.template}
          setSelectedTheme={(value) => {
            setResumeData((prev) => ({
              ...prev,
              template: value?.template || prev.template,
              data: {
                ...prev.data,
                metadata: {
                  ...prev.data.metadata,
                  template: value?.template || prev.data.metadata.template,
                  theme: {
                    background: value?.colors?.[0] || prev.data.metadata.theme.background,
                    text: value?.colors?.[1] || prev.data.metadata.theme.text,
                    primary: value?.colors?.[2] || prev.data.metadata.theme.primary,
                  },
                },
              },
            }));
          }}
          resumeData={resumeData}
          setResumeData={setResumeData}
          onClose={() => setOpenThemeSelector(false)}
        />
      </Modal>

      {/* Print & Preview Modal */}
      <Modal
        isOpen={openPreviewModal}
        onClose={() => setOpenPreviewModal(false)}
        title={resumeData?.title || "Resume Preview"}
        showActionBtn
        actionBtnText={isExporting ? "Generating Vector PDF..." : "Download Vector PDF"}
        actionBtnIcon={isExporting ? <LuRefreshCw className="text-base animate-spin" /> : <LuDownload className="text-base" />}
        onActionClick={handleDownloadVectorPdf}
        width="95vw"
        height="92vh"
        isPrint={true}
      >
        <div className="flex flex-col gap-3 max-w-5xl mx-auto w-full p-2">
          {/* Vector PDF Export Tip */}
          <div className="p-3 bg-emerald-50/90 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5 shadow-xs">
            <LuSparkles className="text-base text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-emerald-950">1-Click Vector Export:</span> Resuma AI uses server-side headless Chromium to generate clean, selectable vector documents with clickable links and crisp typography.
            </div>
          </div>

          <div className="overflow-auto max-h-[72vh] p-4 bg-gray-100/90 rounded-xl border border-gray-200 flex justify-center custom-scrollbar">
            <div ref={resumeDownloadRef} className="a4-paper-sheet shadow-2xl rounded-xs bg-white">
              <RenderResume
                templateId={resumeData?.data?.metadata?.template || RESUME_TEMPLATES[0].id}
                resumeData={resumeData?.data}
                colorPalette={[
                  resumeData?.data?.metadata?.theme?.background,
                  resumeData?.data?.metadata?.theme?.text,
                  resumeData?.data?.metadata?.theme?.primary,
                ]}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Comprehensive Resume Quality & ATS Audit Modal */}
      <ResumeAuditModal
        isOpen={openAuditModal}
        onClose={() => setOpenAuditModal(false)}
        resumeData={resumeData?.data || resumeData || {}}
        onNavigateSection={(sectionKey) => {
          setActivePage(sectionKey);
          if (viewMode === "preview") setViewMode("split");
        }}
        onApplyBulletRewrite={handleApplyBulletRewrite}
      />

      {/* ATS Job Match Analyzer Modal */}
      <JobMatchModal
        isOpen={openJobMatchModal}
        onClose={() => setOpenJobMatchModal(false)}
        resumeData={resumeData}
        onAddSkill={handleAddMissingSkill}
      />

      {/* Public Share & Recruiter Analytics Modal */}
      <ShareModal
        isOpen={openShareModal}
        onClose={() => setOpenShareModal(false)}
        resume={resumeData}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={openDeleteModal}
        onClose={() => !isDeleting && setOpenDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Resume"
        message={`Are you sure you want to delete "${resumeData?.title || "this resume"}"? This action is permanent and cannot be undone.`}
        confirmText="Delete Resume"
        cancelText="Cancel"
        isLoading={isDeleting}
        isDestructive={true}
      />

      {/* Off-screen canvas for reliable 100% fidelity A4 thumbnail capture */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "794px",
          height: "1123px",
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: -9999,
          opacity: 1,
        }}
      >
        <div
          ref={offscreenCaptureRef}
          className="a4-paper-sheet bg-white"
          style={{ width: "794px", height: "1123px", overflow: "hidden" }}
        >
          {resumeData?.data?.basics && (
            <RenderResume
              templateId={resumeData?.data?.metadata?.template || RESUME_TEMPLATES[0].id}
              resumeData={resumeData?.data}
              colorPalette={themeColorPalette}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditResume;