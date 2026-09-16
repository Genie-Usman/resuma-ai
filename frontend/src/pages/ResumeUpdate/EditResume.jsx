import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LuPalette,
  LuSave,
  LuTrash2,
  LuEye,
  LuDownload,
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
  LuFileText,
  LuMail,
  LuFileArchive,
  LuLayers,
  LuEllipsis,
} from "react-icons/lu";
import toast from "react-hot-toast";

// Assets
import LOGO from "../../assets/logo.svg";

// Hooks
import { useResumeData } from "./hooks/useResumeData";
import { useResumeExport } from "./hooks/useResumeExport";

// Layout & UI
import TitleInput from "../../components/Inputs/TitleInput";
import Modal from "../../components/shared/Modal.jsx";
import ConfirmModal from "../../components/shared/ConfirmModal.jsx";
import EditorSidebar from "./components/EditorSidebar.jsx";
import ResumeCanvas from "./components/ResumeCanvas.jsx";
import StudioActivityRail from "./components/StudioActivityRail.jsx";
import ContentDrawer from "./components/drawers/ContentDrawer.jsx";
import TemplatesDrawer from "./components/drawers/TemplatesDrawer.jsx";
import DesignDrawer from "./components/drawers/DesignDrawer.jsx";
import AiAuditDrawer from "./components/drawers/AiAuditDrawer.jsx";
import CoverLetterDrawer from "./components/drawers/CoverLetterDrawer.jsx";
import SectionFormHeader from "./components/SectionFormHeader.jsx";
import JobMatchModal from "./components/JobMatchModal.jsx";
import ResumeAuditModal from "./components/ResumeAuditModal.jsx";
import ShareModal from "./components/ShareModal.jsx";
import ThemeSelector from "./ThemeSelector.jsx";
import RenderResume from "../../components/ResumeTemplates/RenderResume";
import { RESUME_TEMPLATES, isTwoColumnTemplate } from "../../constants";
import AddCustomSectionModal from "./components/AddCustomSectionModal.jsx";
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
import CustomSectionForm from "./Forms/CustomSectionForm";

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
  const isNavigatingBackRef = useRef(false);
  const resumeDataRef = useRef(null);
  const newProfileImageFileRef = useRef(null);
  const initialSnapshotRef = useRef(null);
  const hasUnsavedChangesRef = useRef(false);

  const [activePage, setActivePage] = useState("personal-info");
  const [newProfileImageFile, setNewProfileImageFile] = useState(null);
  const [openJobMatchModal, setOpenJobMatchModal] = useState(false);
  const [openAuditModal, setOpenAuditModal] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  const [activeTab, setActiveTab] = useState("content"); // "content" | "templates" | "formatting" | "cover-letter" | "ai"
  const [canvasDocType, setCanvasDocType] = useState("resume"); // "resume" | "cover-letter"
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);

  // Close dropdown menus on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setExportMenuOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setMoreMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setExportMenuOpen(false);
        setMoreMenuOpen(false);
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
    updateSectionTitle,
    reorderSections,
    addCustomSection,
    removeCustomSection,
    updateFontFamily,
    updateDensity,
    updatePageMargin,
    updatePaperFormat,
    updateHeaderStyle,
    updateCoverLetter,
    shrinkToSinglePage,
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
    handleDownloadCoverLetterPdf,
    handleDownloadApplicationPackage,
    handleDownloadZipPackage,
    handleDownloadDocx,
  } = useResumeExport(resumeId, resumeData?.title);

  // Check if cover letter has been created with meaningful content
  const hasCoverLetter = useMemo(() => {
    const cl = resumeData?.data?.coverLetter;
    if (!cl) return false;
    if (cl.bodyHtml && cl.bodyHtml.replace(/<[^>]*>/g, "").trim().length > 0) return true;
    if (Array.isArray(cl.bodyParagraphs) && cl.bodyParagraphs.some((p) => p && p.trim().length > 0)) return true;
    if (cl.opening && cl.opening.trim().length > 0) return true;
    return false;
  }, [resumeData?.data?.coverLetter]);

  // Snapshot initial loaded data
  useEffect(() => {
    if (!isLoading && resumeData?._id && !initialLoadedRef.current) {
      initialLoadedRef.current = true;
      const initialStr = JSON.stringify(resumeData);
      lastSavedDataRef.current = initialStr;
      initialSnapshotRef.current = initialStr;
    }
  }, [isLoading, resumeData]);

  // Keep refs synchronized for history popstate and back navigation
  useEffect(() => {
    resumeDataRef.current = resumeData;
  }, [resumeData]);

  useEffect(() => {
    newProfileImageFileRef.current = newProfileImageFile;
  }, [newProfileImageFile]);

  useEffect(() => {
    hasUnsavedChangesRef.current = hasUnsavedChanges;
  }, [hasUnsavedChanges]);

  useEffect(() => {
    isNavigatingBackRef.current = isNavigatingBack;
  }, [isNavigatingBack]);

  // Auto-correct invalid or legacy empty "custom" activePage
  useEffect(() => {
    if (
      activePage === "custom" &&
      !resumeData?.data?.sections?.custom?.isCustom &&
      !resumeData?.data?.sections?.custom?.type
    ) {
      setActivePage("personal-info");
    }
  }, [activePage, resumeData]);

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

  // Custom Section Creation (Roadmap Item 3.1)
  const handleAddCustomSection = ({ name, type, column }) => {
    const newSectionId = addCustomSection({ name, type, column });
    if (newSectionId) {
      setActivePage(newSectionId);
      setActiveTab("content");
      setIsDrawerOpen(true);
    }
  };

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
      const savedStr = JSON.stringify(resumeData);
      lastSavedDataRef.current = savedStr;
      initialSnapshotRef.current = savedStr;
      setHasUnsavedChanges(false);
      toast.success("Resume & thumbnail saved!", { id: "manual-save" });
    } catch (err) {
      console.error("Manual save failed:", err);
      toast.error("Failed to save resume", { id: "manual-save" });
    }
  };

  // Check if anything was actually modified in the resume
  const checkIfResumeChanged = () => {
    if (newProfileImageFileRef.current) return true;
    if (hasUnsavedChangesRef.current) return true;
    if (!initialSnapshotRef.current) return false;
    if (!resumeDataRef.current) return false;
    return JSON.stringify(resumeDataRef.current) !== initialSnapshotRef.current;
  };

  // Back to Dashboard Handler (Auto-saves progress & generates dashboard thumbnail ONLY when changed)
  const handleBackToDashboard = async () => {
    if (isNavigatingBackRef.current) return;
    isNavigatingBackRef.current = true;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    const hasChanges = checkIfResumeChanged();

    // If nothing changed, exit to dashboard immediately without save or thumbnail overhead
    if (!hasChanges) {
      navigate("/dashboard", { replace: true });
      return;
    }

    // Changes were made: show saving state and generate thumbnail
    setIsNavigatingBack(true);

    try {
      toast.loading("Saving progress & thumbnail...", { id: "back-nav-save" });
      const targetElement = offscreenCaptureRef.current || resumeRef.current;
      await uploadImagesAndSave(newProfileImageFileRef.current, targetElement, true);
      initialSnapshotRef.current = JSON.stringify(resumeDataRef.current);
      toast.success("Progress saved!", { id: "back-nav-save" });
    } catch (err) {
      console.warn("Save on back encountered an issue, saving data directly:", err);
      try {
        await saveResume(resumeDataRef.current, true);
        toast.success("Progress saved!", { id: "back-nav-save" });
      } catch (fallbackErr) {
        console.error("Critical: Could not save resume data on back navigation:", fallbackErr);
      }
    } finally {
      navigate("/dashboard", { replace: true });
    }
  };

  // Intercept browser back button to trigger saving state and thumbnail generation
  useEffect(() => {
    if (!window.history.state?.inStudio) {
      window.history.pushState({ inStudio: true }, "");
    }

    const handleBrowserPopState = async () => {
      if (isNavigatingBackRef.current) return;
      await handleBackToDashboard();
    };

    window.addEventListener("popstate", handleBrowserPopState);
    return () => {
      window.removeEventListener("popstate", handleBrowserPopState);
    };
  }, []);

  // Warn user on tab close/refresh if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges && !isNavigatingBackRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

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

    // Roadmap 3.1: Custom Section Form Dispatcher
    if (sections[activePage]?.isCustom || activePage?.startsWith("custom_")) {
      const customSection = sections[activePage] || {};
      return (
        <CustomSectionForm
          sectionId={activePage}
          section={customSection}
          updateArrayItem={(index, key, value) => updateArrayItem(activePage, index, key, value)}
          addArrayItem={(defaultItem) => addArrayItem(activePage, defaultItem)}
          removeArrayItem={(index) => removeArrayItem(activePage, index)}
          isVisible={customSection.visible !== false}
          onToggleVisibility={() => toggleSectionVisibility(activePage)}
          onRenameTitle={(newTitle, isFinal) => updateSectionTitle(activePage, newTitle, isFinal)}
          onRemoveSection={(customId) => {
            removeCustomSection(customId);
            setActivePage("personal-info");
          }}
        />
      );
    }

    switch (activePage) {
      case "personal-info":
        return (
          <PersonalInfoForm
            profileData={resumeData.data.basics}
            updateSection={(key, value) => updateSection("basics", key, value)}
            profiles={sections.profiles?.items || []}
          />
        );

      case "summary":
        return (
          <div className="p-1 sm:p-2 space-y-6">
            <SectionFormHeader
              title={sections.summary?.name || "Professional Summary"}
              subtitle="A concise overview of your background, key achievements, and career goals."
              icon={LuPencil}
              isVisible={sections.summary?.visible !== false}
              onToggleVisibility={() => toggleSectionVisibility("summary")}
              sectionKey="summary"
              onRenameTitle={(newTitle, isFinal) => updateSectionTitle("summary", newTitle, isFinal)}
            />
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
            isVisible={sections.profiles?.visible !== false}
            onToggleVisibility={() => toggleSectionVisibility("profiles")}
            title={sections.profiles?.name}
            onRenameTitle={(newTitle, isFinal) => updateSectionTitle("profiles", newTitle, isFinal)}
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
            isVisible={sections.experience?.visible !== false}
            onToggleVisibility={() => toggleSectionVisibility("experience")}
            title={sections.experience?.name}
            onRenameTitle={(newTitle, isFinal) => updateSectionTitle("experience", newTitle, isFinal)}
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
            isVisible={sections.education?.visible !== false}
            onToggleVisibility={() => toggleSectionVisibility("education")}
            title={sections.education?.name}
            onRenameTitle={(newTitle, isFinal) => updateSectionTitle("education", newTitle, isFinal)}
          />
        );

      case "skills":
        return (
          <SkillsForm
            skills={sections.skills?.items || []}
            showRatings={sections.skills?.showRatings !== false}
            onToggleShowRatings={(val) =>
              setResumeData((prev) => ({
                ...prev,
                data: {
                  ...prev.data,
                  sections: {
                    ...prev.data.sections,
                    skills: {
                      ...prev.data.sections.skills,
                      showRatings: typeof val === "boolean" ? val : !prev.data.sections.skills?.showRatings,
                    },
                  },
                },
              }), true)
            }
            updateArrayItem={(index, key, value) => updateArrayItem("skills", index, key, value)}
            addArrayItem={() => addArrayItem("skills", defaultSkillsItem)}
            removeArrayItem={(index) => removeArrayItem("skills", index)}
            setResumeData={setResumeData}
            isVisible={sections.skills?.visible !== false}
            onToggleVisibility={() => toggleSectionVisibility("skills")}
            title={sections.skills?.name}
            onRenameTitle={(newTitle, isFinal) => updateSectionTitle("skills", newTitle, isFinal)}
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
            isVisible={sections.projects?.visible !== false}
            onToggleVisibility={() => toggleSectionVisibility("projects")}
            title={sections.projects?.name}
            onRenameTitle={(newTitle, isFinal) => updateSectionTitle("projects", newTitle, isFinal)}
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
            isVisible={sections.certifications?.visible !== false}
            onToggleVisibility={() => toggleSectionVisibility("certifications")}
            title={sections.certifications?.name}
            onRenameTitle={(newTitle, isFinal) => updateSectionTitle("certifications", newTitle, isFinal)}
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
            isVisible={sections.awards?.visible !== false}
            onToggleVisibility={() => toggleSectionVisibility("awards")}
            title={sections.awards?.name}
            onRenameTitle={(newTitle, isFinal) => updateSectionTitle("awards", newTitle, isFinal)}
          />
        );

      case "languages":
        return (
          <LanguageForm
            languages={sections.languages?.items || []}
            showRatings={sections.languages?.showRatings !== false}
            onToggleShowRatings={(val) =>
              setResumeData((prev) => ({
                ...prev,
                data: {
                  ...prev.data,
                  sections: {
                    ...prev.data.sections,
                    languages: {
                      ...prev.data.sections.languages,
                      showRatings: typeof val === "boolean" ? val : !prev.data.sections.languages?.showRatings,
                    },
                  },
                },
              }), true)
            }
            updateArrayItem={(index, key, value) => updateArrayItem("languages", index, key, value)}
            addArrayItem={() => addArrayItem("languages", defaultLanguageItem)}
            removeArrayItem={(index) => removeArrayItem("languages", index)}
            setResumeData={setResumeData}
            isVisible={sections.languages?.visible !== false}
            onToggleVisibility={() => toggleSectionVisibility("languages")}
            title={sections.languages?.name}
            onRenameTitle={(newTitle, isFinal) => updateSectionTitle("languages", newTitle, isFinal)}
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
            isVisible={sections.interests?.visible !== false}
            onToggleVisibility={() => toggleSectionVisibility("interests")}
            title={sections.interests?.name}
            onRenameTitle={(newTitle, isFinal) => updateSectionTitle("interests", newTitle, isFinal)}
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
            isVisible={sections.publications?.visible !== false}
            onToggleVisibility={() => toggleSectionVisibility("publications")}
            title={sections.publications?.name}
            onRenameTitle={(newTitle, isFinal) => updateSectionTitle("publications", newTitle, isFinal)}
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
            isVisible={sections.volunteer?.visible !== false}
            onToggleVisibility={() => toggleSectionVisibility("volunteer")}
            title={sections.volunteer?.name}
            onRenameTitle={(newTitle, isFinal) => updateSectionTitle("volunteer", newTitle, isFinal)}
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
            isVisible={sections.references?.visible !== false}
            onToggleVisibility={() => toggleSectionVisibility("references")}
            title={sections.references?.name}
            onRenameTitle={(newTitle, isFinal) => updateSectionTitle("references", newTitle, isFinal)}
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
      <header className="h-16 shrink-0 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between relative z-30 shadow-2xs">
        {/* Left: Site Logo in same size as site header + Studio Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleBackToDashboard}
            disabled={isNavigatingBack}
            className="cursor-pointer hover:opacity-90 transition-opacity focus:outline-none disabled:opacity-60"
            title="Back to Dashboard"
          >
            <img
              src={LOGO}
              alt="Resuma AI"
              className="w-[135px] select-none"
            />
          </button>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-purple-50 text-purple-700 border border-purple-200/60 select-none">
            Studio
          </span>
        </div>

        {/* Center: Resume Title (Centered in Header) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center max-w-[32%] sm:max-w-[42%] md:max-w-[50%] min-w-0 z-10 pointer-events-auto">
          <TitleInput
            title={resumeData?.title || ""}
            setTitle={(value) => setResumeData((prev) => ({ ...prev, title: value }))}
          />
        </div>

        {/* Right: Studio Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* 1. Undo / Redo Actions */}
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

          {/* 2. Public Share Link Button */}
          <button
            type="button"
            onClick={() => setOpenShareModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs rounded-xl transition-all cursor-pointer h-[34px]"
            title="Share public recruiter link"
          >
            <LuShare2 className="text-xs text-purple-600 shrink-0" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* 3. Export Dropdown Menu (Primary Action) */}
          <div className="relative" ref={exportMenuRef}>
            <button
              type="button"
              disabled={isExporting}
              onClick={() => {
                setExportMenuOpen((prev) => !prev);
                setMoreMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 h-[34px]"
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
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 text-slate-700 animate-in fade-in-0 zoom-in-95 duration-100">
                <div className="px-3.5 py-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase border-b border-slate-100">
                  Export Options
                </div>

                {/* Section 1: RESUME */}
                <div className="px-3.5 pt-2.5 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Resume
                </div>

                {/* 1. Resume PDF */}
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => {
                    setExportMenuOpen(false);
                    handleDownloadVectorPdf("resume");
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-3 hover:bg-emerald-50/80 hover:text-emerald-950 transition-colors cursor-pointer group disabled:opacity-50"
                >
                  <span className="p-2 rounded-xl bg-emerald-100/90 text-emerald-700 group-hover:bg-emerald-200 transition-colors shrink-0">
                    <LuFileText className="text-sm" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-800 group-hover:text-emerald-900 flex items-center justify-between">
                      <span>Resume (PDF)</span>
                      <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">.pdf</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">Standard PDF document</p>
                  </div>
                </button>

                {/* 2. Resume Word (.docx) */}
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => {
                    setExportMenuOpen(false);
                    handleDownloadDocx();
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-3 hover:bg-blue-50/80 hover:text-blue-950 transition-colors cursor-pointer group disabled:opacity-50"
                >
                  <span className="p-2 rounded-xl bg-blue-100/90 text-blue-700 group-hover:bg-blue-200 transition-colors shrink-0">
                    <LuFileText className="text-sm" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-800 group-hover:text-blue-900 flex items-center justify-between">
                      <span>Resume (Word)</span>
                      <span className="text-[10px] font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/60">.docx</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">Editable Word document</p>
                  </div>
                </button>

                <div className="my-1.5 border-t border-slate-100" />

                {/* Section 2: COVER LETTER */}
                <div className="px-3.5 pt-1.5 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center justify-between">
                  <span>Cover Letter</span>
                  {!hasCoverLetter && (
                    <span className="text-[9px] font-normal text-slate-400 normal-case">Not created</span>
                  )}
                </div>

                {/* 3. Cover Letter PDF */}
                <button
                  type="button"
                  disabled={isExporting || !hasCoverLetter}
                  onClick={() => {
                    if (!hasCoverLetter) return;
                    setExportMenuOpen(false);
                    handleDownloadCoverLetterPdf();
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-3 transition-colors ${
                    hasCoverLetter
                      ? "hover:bg-purple-50/80 hover:text-purple-950 cursor-pointer group"
                      : "opacity-45 cursor-not-allowed bg-slate-50/50"
                  }`}
                  title={hasCoverLetter ? "Download Cover Letter PDF" : "Create a cover letter in the Letter tab first"}
                >
                  <span className={`p-2 rounded-xl shrink-0 transition-colors ${
                    hasCoverLetter
                      ? "bg-purple-100/90 text-purple-700 group-hover:bg-purple-200"
                      : "bg-slate-100 text-slate-400"
                  }`}>
                    <LuMail className="text-sm" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-800 group-hover:text-purple-900 flex items-center justify-between">
                      <span>Cover Letter (PDF)</span>
                      <span className="text-[10px] font-medium text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200/60">.pdf</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {hasCoverLetter ? "Standalone cover letter" : "Create in the Letter tab first"}
                    </p>
                  </div>
                </button>

                <div className="my-1.5 border-t border-slate-100" />

                {/* Section 3: PACKAGE */}
                <div className="px-3.5 pt-1.5 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center justify-between">
                  <span>Package</span>
                  {!hasCoverLetter && (
                    <span className="text-[9px] font-normal text-slate-400 normal-case">Requires cover letter</span>
                  )}
                </div>

                {/* 4. Zipped Package */}
                <button
                  type="button"
                  disabled={isExporting || !hasCoverLetter}
                  onClick={() => {
                    if (!hasCoverLetter) return;
                    setExportMenuOpen(false);
                    handleDownloadZipPackage();
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-3 transition-colors ${
                    hasCoverLetter
                      ? "hover:bg-indigo-50/80 hover:text-indigo-950 cursor-pointer group"
                      : "opacity-45 cursor-not-allowed bg-slate-50/50"
                  }`}
                  title={hasCoverLetter ? "Download separated Resume & Cover Letter in a ZIP archive" : "Create a cover letter first to unlock package"}
                >
                  <span className={`p-2 rounded-xl shrink-0 transition-colors ${
                    hasCoverLetter
                      ? "bg-indigo-100/90 text-indigo-700 group-hover:bg-indigo-200"
                      : "bg-slate-100 text-slate-400"
                  }`}>
                    <LuFileArchive className="text-sm" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-800 group-hover:text-indigo-900 flex items-center justify-between">
                      <span>Resume + Cover Letter</span>
                      <span className="text-[10px] font-medium text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200/60">.zip</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {hasCoverLetter
                        ? "Separated PDFs in a ZIP file"
                        : "Only available with a cover letter"}
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 4. More Actions Dropdown Menu (•••) */}
          <div className="relative" ref={moreMenuRef}>
            <button
              type="button"
              onClick={() => {
                setMoreMenuOpen((prev) => !prev);
                setExportMenuOpen(false);
              }}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center h-[34px] w-[34px] ${
                moreMenuOpen
                  ? "bg-slate-100 text-purple-700 border-purple-300 shadow-xs"
                  : "bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-200/90 shadow-2xs"
              }`}
              title="More options (Save snapshot, Delete resume)"
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
        {/* Left Activity Rail (68px) */}
        <StudioActivityRail
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setIsDrawerOpen(true);
            if (tab === "cover-letter") {
              setCanvasDocType("cover-letter");
            }
          }}
          isDrawerOpen={isDrawerOpen}
          onToggleDrawer={() => setIsDrawerOpen((prev) => !prev)}
          onBack={handleBackToDashboard}
          overallScore={liveAudit.overallScore}
          isSaving={isSaving}
          hasUnsavedChanges={hasUnsavedChanges}
          isNavigatingBack={isNavigatingBack}
          onManualSave={handleManualSave}
        />

        {/* Standardized Studio Drawer (480px) - Zero Layout Shift Across Modes */}
        {isDrawerOpen && (
          <div className="w-[460px] sm:w-[480px] h-full shrink-0 z-20 border-r border-slate-200/90 bg-white flex flex-col overflow-hidden select-none">
            {activeTab === "content" && (
              <ContentDrawer
                activePage={activePage}
                setActivePage={setActivePage}
                sections={resumeData.data?.sections || {}}
                layout={resumeData.data?.metadata?.layout || [[], []]}
                templateId={currentTemplateId}
                onToggleVisibility={toggleSectionVisibility}
                onReorderSections={reorderSections}
                onExportJson={handleExportJson}
                onOpenAddSectionModal={() => setIsAddSectionModalOpen(true)}
                isSaving={isSaving}
                onClose={() => setIsDrawerOpen(false)}
              >
                {renderForm()}
              </ContentDrawer>
            )}

            {activeTab === "templates" && (
              <TemplatesDrawer
                currentTemplate={resumeData?.data?.metadata?.template || currentTemplateId}
                onSelectTemplate={(templateId) => {
                  setResumeData((prev) => ({
                    ...prev,
                    template: templateId,
                    data: {
                      ...prev.data,
                      metadata: {
                        ...prev.data?.metadata,
                        template: templateId,
                      },
                    },
                  }), true);
                }}
                currentColors={themeColorPalette}
                onUpdateColors={(colors) => {
                  setResumeData((prev) => ({
                    ...prev,
                    data: {
                      ...prev.data,
                      metadata: {
                        ...prev.data?.metadata,
                        theme: {
                          background: colors[0],
                          text: colors[1],
                          primary: colors[2],
                        },
                      },
                    },
                  }), true);
                }}
                onClose={() => setIsDrawerOpen(false)}
              />
            )}

            {activeTab === "formatting" && (
              <DesignDrawer
                activeFont={resumeData?.data?.metadata?.typography?.font?.family || resumeData?.data?.metadata?.fontFamily}
                onUpdateFont={updateFontFamily}
                activeDensity={resumeData?.data?.metadata?.typography?.density || resumeData?.data?.metadata?.density || "normal"}
                onUpdateDensity={updateDensity}
                activeMargin={resumeData?.data?.metadata?.page?.marginPreset || (resumeData?.data?.metadata?.page?.margin === 12 ? "narrow" : resumeData?.data?.metadata?.page?.margin === 24 ? "wide" : "standard")}
                onUpdateMargin={updatePageMargin}
                activePaperFormat={resumeData?.data?.metadata?.page?.format || "a4"}
                onUpdatePaperFormat={updatePaperFormat}
                activeHeaderStyle={resumeData?.data?.metadata?.typography?.headerStyle || resumeData?.data?.metadata?.headerStyle || "default"}
                onUpdateHeaderStyle={updateHeaderStyle}
                pageCount={1}
                onShrinkToSinglePage={shrinkToSinglePage}
                onClose={() => setIsDrawerOpen(false)}
              />
            )}

            {activeTab === "cover-letter" && (
              <CoverLetterDrawer
                resumeData={resumeData}
                updateCoverLetter={updateCoverLetter}
                onDownloadCoverLetterPdf={handleDownloadCoverLetterPdf}
                onDownloadApplicationPackage={handleDownloadApplicationPackage}
                isExporting={isExporting}
                onClose={() => setIsDrawerOpen(false)}
                onSwitchToCoverLetterView={() => setCanvasDocType("cover-letter")}
                canvasDocType={canvasDocType}
              />
            )}

            {activeTab === "ai" && (
              <AiAuditDrawer
                resumeData={resumeData?.data || resumeData}
                onOpenJobMatch={() => setOpenJobMatchModal(true)}
                onOpenFullAudit={() => setOpenAuditModal(true)}
                onClose={() => setIsDrawerOpen(false)}
              />
            )}
          </div>
        )}

        {/* Live Resume Canvas Workspace (Expands to fill all remaining width!) */}
        <div className="flex-1 min-w-0 h-full overflow-hidden bg-slate-100 flex flex-col">
          {resumeData?.data?.basics && (
            <ResumeCanvas
              resumeData={resumeData?.data}
              templateId={resumeData?.data?.metadata?.template || RESUME_TEMPLATES[0].id}
              colorPalette={themeColorPalette}
              canvasRef={resumeRef}
              paperFormat={resumeData?.data?.metadata?.page?.format || "a4"}
              docType={canvasDocType}
              onDocTypeChange={setCanvasDocType}
              onShrinkToSinglePage={shrinkToSinglePage}
              onOpenDesignDrawer={() => {
                setActiveTab("formatting");
                setIsDrawerOpen(true);
              }}
              onOpenAiAuditDrawer={() => {
                setActiveTab("ai");
                setIsDrawerOpen(true);
              }}
              overallScore={liveAudit.overallScore}
            />
          )}
        </div>
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
        actionBtnText={isExporting ? "Generating PDF..." : "Download PDF"}
        actionBtnIcon={isExporting ? <LuRefreshCw className="text-base animate-spin" /> : <LuDownload className="text-base" />}
        onActionClick={handleDownloadVectorPdf}
        width="95vw"
        height="92vh"
        isPrint={true}
      >
        <div className="flex flex-col gap-3 max-w-5xl mx-auto w-full p-2">
          {/* PDF Export Tip */}
          <div className="p-3 bg-emerald-50/90 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5 shadow-xs">
            <LuSparkles className="text-base text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-emerald-950">High Quality PDF:</span> Download a clean, job-ready document with sharp text and clickable links.
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
          setActiveTab("content");
          setIsDrawerOpen(true);
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
        onUpdateResume={(updated) => {
          setResumeData((prev) => ({ ...prev, ...updated }));
        }}
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

      {/* Add Custom Section Modal (Roadmap Item 3.1) */}
      <AddCustomSectionModal
        isOpen={isAddSectionModalOpen}
        onClose={() => setIsAddSectionModalOpen(false)}
        onAddSection={handleAddCustomSection}
        isTwoColumn={isTwoColumnTemplate(currentTemplateId)}
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