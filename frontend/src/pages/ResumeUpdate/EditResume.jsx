import { useEffect, useRef, useState } from "react";
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
import DashboardLayout from "../../components/layouts/DashboardLayout";
import TitleInput from "../../components/Inputs/TitleInput";
import Modal from "../../components/shared/Modal.jsx";
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
  const handleDeleteResume = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resume? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeId));
      toast.success("Resume deleted successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Delete resume error:", error);
      toast.error(error.response?.data?.message || "Failed to delete resume");
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
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full">
        {/* Top Studio Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl border border-slate-200/90 py-2 px-3 sm:px-4 mb-4 shadow-xs">
          {/* Left: Back + Title + Save Status */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors cursor-pointer"
              title="Back to Dashboard"
            >
              <LuArrowLeft className="text-lg" />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <TitleInput
                title={resumeData.title}
                setTitle={(value) => setResumeData((prev) => ({ ...prev, title: value }))}
              />

              {/* Real-time Save Status Badge */}
              <div className="hidden sm:flex items-center text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0">
                {isSaving ? (
                  <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                    <LuRefreshCw className="animate-spin text-xs" /> Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    <LuCheck className="text-xs" /> Saved
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Center: Studio View Mode Switcher */}
          <div className="hidden md:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "split"
                  ? "bg-white text-purple-700 shadow-xs font-semibold"
                  : "hover:text-slate-900"
              }`}
              title="Balanced side-by-side editing and live preview"
            >
              <LuColumns2 className="text-sm" />
              <span>Split View</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("edit")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "edit"
                  ? "bg-white text-purple-700 shadow-xs font-semibold"
                  : "hover:text-slate-900"
              }`}
              title="Expansive form writing without canvas distractions"
            >
              <LuPencil className="text-sm" />
              <span>Editor Focus</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "preview"
                  ? "bg-white text-purple-700 shadow-xs font-semibold"
                  : "hover:text-slate-900"
              }`}
              title="Full-screen A4 document review and export"
            >
              <LuEye className="text-sm" />
              <span>A4 Preview</span>
            </button>
          </div>

          {/* Right: Studio Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Job Match */}
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer"
              onClick={() => setOpenJobMatchModal(true)}
              title="Analyze ATS match with a target job description"
            >
              <LuSparkles className="text-sm" />
              <span className="hidden sm:inline">Job Match</span>
            </button>

            {/* Share */}
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors cursor-pointer border border-purple-200/70"
              onClick={() => setOpenShareModal(true)}
              title="Share public link & view analytics"
            >
              <LuShare2 className="text-sm" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Theme */}
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
              onClick={() => setOpenThemeSelector(true)}
              title="Change resume template and color palette"
            >
              <LuPalette className="text-sm" />
              <span className="hidden sm:inline">Theme</span>
            </button>

            {/* Export PDF */}
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer border border-emerald-200/80"
              onClick={() => setOpenPreviewModal(true)}
              title="Open high-def ATS vector PDF export dialog"
            >
              <LuDownload className="text-sm" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>

            {/* Delete */}
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              onClick={handleDeleteResume}
              title="Delete this resume"
            >
              <LuTrash2 className="text-base" />
            </button>

            {/* Save */}
            <button
              type="button"
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 text-xs md:text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              onClick={handleQuickSave}
            >
              <LuSave className="text-sm" />
              <span>{isSaving ? "Saving..." : "Save"}</span>
            </button>
          </div>
        </div>

        {/* Studio Workspace by View Mode */}
        <div className="w-full">
          {viewMode === "split" && (
            <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[calc(100vh-175px)]">
              {/* Left Column: Section Navigation Sidebar */}
              <div className="w-full lg:w-60 shrink-0 h-[280px] lg:h-full">
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

              {/* Middle Column: Active Form Panel (Roomy 490px - 530px so text never clips!) */}
              <div className="w-full lg:w-[490px] xl:w-[530px] shrink-0 h-[550px] lg:h-full bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 overflow-y-auto custom-scrollbar">
                {renderForm()}
              </div>

              {/* Right Column: Live A4 Resume Canvas with Page Break Guides & Height Calculation */}
              <div className="flex-1 min-w-[360px] h-[600px] lg:h-full rounded-2xl overflow-hidden shadow-xs">
                {resumeData?.data?.basics && (
                  <ResumeCanvas
                    resumeData={resumeData?.data}
                    templateId={resumeData?.data?.metadata?.template || RESUME_TEMPLATES[0].id}
                    colorPalette={[
                      resumeData?.data?.metadata?.theme?.background,
                      resumeData?.data?.metadata?.theme?.text,
                      resumeData?.data?.metadata?.theme?.primary,
                    ]}
                    canvasRef={resumeRef}
                  />
                )}
              </div>
            </div>
          )}

          {viewMode === "edit" && (
            <div className="flex flex-col lg:flex-row gap-5 h-auto lg:h-[calc(100vh-175px)]">
              {/* Left Column: Section Navigation Sidebar */}
              <div className="w-full lg:w-64 shrink-0 h-[280px] lg:h-full">
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

              {/* Expansive Form Focus Panel */}
              <div className="flex-1 h-full max-w-4xl bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 overflow-y-auto custom-scrollbar">
                {renderForm()}
              </div>
            </div>
          )}

          {viewMode === "preview" && (
            <div className="w-full max-w-5xl mx-auto h-[calc(100vh-175px)] rounded-2xl overflow-hidden shadow-xs">
              {resumeData?.data?.basics && (
                <ResumeCanvas
                  resumeData={resumeData?.data}
                  templateId={resumeData?.data?.metadata?.template || RESUME_TEMPLATES[0].id}
                  colorPalette={[
                    resumeData?.data?.metadata?.theme?.background,
                    resumeData?.data?.metadata?.theme?.text,
                    resumeData?.data?.metadata?.theme?.primary,
                  ]}
                  canvasRef={resumeRef}
                />
              )}
            </div>
          )}
        </div>
      </div>

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
    </DashboardLayout>
  );
};

export default EditResume;