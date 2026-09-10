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
import ShareModal from "./components/ShareModal.jsx";
import ThemeSelector from "./ThemeSelector.jsx";
import RenderResume from "../../components/ResumeTemplates/RenderResume";
import { RESUME_TEMPLATES } from "../../constants";
import { exportToJsonResume } from "../../utils/jsonResumeAdapter";
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

  const [activePage, setActivePage] = useState("personal-info");
  const [newProfileImageFile, setNewProfileImageFile] = useState(null);
  const [openJobMatchModal, setOpenJobMatchModal] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewMode, setViewMode] = useState("split"); // "split" | "edit" | "preview"

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
    saveResume,
    uploadImagesAndSave,
  } = useResumeData(resumeId);

  const {
    openThemeSelector,
    setOpenThemeSelector,
    openPreviewModal,
    setOpenPreviewModal,
    handlePrint,
  } = useResumeExport(resumeDownloadRef, resumeData?.title);

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

  // Quick Save Handler
  const handleQuickSave = async () => {
    try {
      await uploadImagesAndSave(newProfileImageFile, resumeRef.current);
    } catch {
      // Error handled inside hook
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
      {/* 1. Studio Top Navigation Bar (Single Sleek 56px Bar - Never Wraps!) */}
      <header className="h-14 shrink-0 bg-white border-b border-slate-200/80 px-3 sm:px-5 flex items-center justify-between z-30 shadow-2xs">
        {/* Left: Back + Title + Real-time Save Status */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors cursor-pointer shrink-0"
            title="Back to Dashboard"
          >
            <LuArrowLeft className="text-lg" />
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block shrink-0" />

          {/* Title with hover edit */}
          <div className="flex items-center gap-2 min-w-0 max-w-[200px] sm:max-w-[300px] lg:max-w-[380px]">
            <TitleInput
              title={resumeData.title}
              setTitle={(value) => setResumeData((prev) => ({ ...prev, title: value }))}
            />
          </div>

          {/* Real-time Save Status Pill */}
          <div className="hidden md:flex items-center text-[11px] font-medium shrink-0">
            {isSaving ? (
              <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/70">
                <LuRefreshCw className="animate-spin text-xs" /> Saving...
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70">
                <LuCheck className="text-xs" /> Saved
              </span>
            )}
          </div>
        </div>

        {/* Center: View Switcher (Split | Form | Preview) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/70 text-xs font-medium text-slate-600 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
              viewMode === "split"
                ? "bg-white text-purple-700 shadow-xs font-semibold"
                : "hover:text-slate-900"
            }`}
            title="Split: Side-by-side Form and Live Preview"
          >
            <LuColumns2 className="text-sm" />
            <span className="hidden sm:inline">Split</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("edit")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
              viewMode === "edit"
                ? "bg-white text-purple-700 shadow-xs font-semibold"
                : "hover:text-slate-900"
            }`}
            title="Form: Focused editing panel"
          >
            <LuPencil className="text-sm" />
            <span className="hidden sm:inline">Form</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
              viewMode === "preview"
                ? "bg-white text-purple-700 shadow-xs font-semibold"
                : "hover:text-slate-900"
            }`}
            title="Preview: Full A4 Canvas"
          >
            <LuEye className="text-sm" />
            <span className="hidden sm:inline">Preview</span>
          </button>
        </div>

        {/* Right: Studio Action Buttons (Single Row) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* AI Job Match */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer"
            onClick={() => setOpenJobMatchModal(true)}
            title="Analyze ATS match with a target job description"
          >
            <LuSparkles className="text-xs" />
            <span className="hidden lg:inline">Job Match</span>
          </button>

          {/* Theme */}
          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200/90 shadow-2xs transition-colors cursor-pointer"
            onClick={() => setOpenThemeSelector(true)}
            title="Change resume template and color palette"
          >
            <LuPalette className="text-xs text-slate-500" />
            <span className="hidden xl:inline">Theme</span>
          </button>

          {/* Share */}
          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100/70 rounded-xl border border-purple-200/70 transition-colors cursor-pointer"
            onClick={() => setOpenShareModal(true)}
            title="Share public link & track recruiter views"
          >
            <LuShare2 className="text-xs" />
            <span className="hidden xl:inline">Share</span>
          </button>

          {/* Export PDF (Primary Action) */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            onClick={() => setOpenPreviewModal(true)}
            title="Download high-definition ATS vector PDF"
          >
            <LuDownload className="text-xs" />
            <span>Export PDF</span>
          </button>

          {/* Delete */}
          <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            onClick={handleDeleteResume}
            title="Delete this resume"
          >
            <LuTrash2 className="text-sm" />
          </button>
        </div>
      </header>

      {/* 2. Studio Workspace Body (Full Height: calc(100vh - 56px)) */}
      <main className="flex-1 h-[calc(100vh-56px)] flex overflow-hidden">
        {viewMode === "split" && (
          <div className="w-full h-full flex overflow-hidden">
            {/* Left: Section Navigation Sidebar */}
            <div className="h-full shrink-0">
              <EditorSidebar
                activePage={activePage}
                setActivePage={setActivePage}
                sections={resumeData.data?.sections || {}}
                layout={resumeData.data?.metadata?.layout || [[], []]}
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
              />
            )}
          </div>
        )}
      </main>

      {/* Theme Selector Modal */}
      <Modal
        isOpen={openThemeSelector}
        onClose={() => setOpenThemeSelector(false)}
        title="Change Theme"
        width="85vw"
        height="80vh"
      >
        <ThemeSelector
          selectedTheme={resumeData?.template}
          setSelectedTheme={(value) => {
            setResumeData((prev) => ({
              ...prev,
              data: {
                ...prev.data,
                metadata: {
                  ...prev.data.metadata,
                  template: value?.template || prev.data.metadata.template,
                  theme: {
                    background: value?.colorPalette?.[0] || prev.data.metadata.theme.background,
                    text: value?.colorPalette?.[1] || prev.data.metadata.theme.text,
                    primary: value?.colorPalette?.[2] || prev.data.metadata.theme.primary,
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

      {/* Print & Preview Modal (A4 High-Def Vector PDF) */}
      <Modal
        isOpen={openPreviewModal}
        onClose={() => setOpenPreviewModal(false)}
        title={resumeData?.title || "Resume Preview"}
        showActionBtn
        actionBtnText="Download ATS Vector PDF"
        actionBtnIcon={<LuDownload className="text-base" />}
        onActionClick={handlePrint}
        width="95vw"
        height="92vh"
        isPrint={true}
      >
        <div className="flex flex-col gap-3 max-w-5xl mx-auto w-full p-2">
          {/* ATS Vector Advice Banner */}
          <div className="p-3 bg-purple-50/90 border border-purple-200 rounded-xl text-xs text-purple-900 flex items-start gap-2.5 shadow-xs">
            <LuInfo className="text-base text-purple-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-purple-950">ATS-Searchable Vector PDF:</span> This export generates 100% searchable vector text with active hyperlinks (GitHub, LinkedIn, Portfolio). In the browser print dialog, select <strong>Destination: Save as PDF</strong>, <strong>Paper size: A4</strong>, and ensure <strong>Background graphics</strong> is checked.
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
    </div>
  );
};

export default EditResume;