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
import ThemeSelector from "./ThemeSelector.jsx";
import RenderResume from "../../components/ResumeTemplates/RenderResume";
import { RESUME_TEMPLATES } from "../../constants";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

// Section Forms
import PersonalInfoForm from "./Forms/PersonalInfoForm";
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
            resumeData={resumeData}
            setResumeData={setResumeData}
          />
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
      <div className="container mx-auto">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-xl border border-gray-200 py-3 px-4 mb-4 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="Back to Dashboard"
            >
              <LuArrowLeft className="text-xl" />
            </button>
            <TitleInput
              title={resumeData.title}
              setTitle={(value) => setResumeData((prev) => ({ ...prev, title: value }))}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-semibold text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg shadow-sm transition-all cursor-pointer"
              onClick={() => setOpenJobMatchModal(true)}
              title="Analyze ATS match with a target job description"
            >
              <LuTarget className="text-base" />
              <span className="hidden sm:inline">Job Match</span>
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors cursor-pointer"
              onClick={() => setOpenThemeSelector(true)}
            >
              <LuPalette className="text-base" />
              <span className="hidden sm:inline">Theme</span>
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
              onClick={handleDeleteResume}
            >
              <LuTrash2 className="text-base" />
              <span className="hidden sm:inline">Delete</span>
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-semibold text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors cursor-pointer"
              onClick={() => setOpenPreviewModal(true)}
            >
              <LuEye className="text-base" />
              <span className="hidden sm:inline">Preview</span>
            </button>

            <button
              type="button"
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              onClick={handleQuickSave}
            >
              <LuSave className="text-base" />
              <span>{isSaving ? "Saving..." : "Save"}</span>
            </button>
          </div>
        </div>

        {/* Main Work Area: 3-column Layout (Sidebar, Active Form, Live Canvas) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Section Sidebar (Col 1-3 on Desktop) */}
          <div className="lg:col-span-3">
            <EditorSidebar
              activePage={activePage}
              setActivePage={setActivePage}
              sections={resumeData.data?.sections || {}}
              layout={resumeData.data?.metadata?.layout || [[], []]}
              onToggleVisibility={toggleSectionVisibility}
              onReorderSections={reorderSections}
              onSave={handleQuickSave}
              onOpenTheme={() => setOpenThemeSelector(true)}
              onOpenPreview={() => setOpenPreviewModal(true)}
              onOpenJobMatch={() => setOpenJobMatchModal(true)}
              onDownload={handlePrint}
              isSaving={isSaving}
            />
          </div>

          {/* Middle Column: Active Form Editor (Col 4-7 on Desktop) */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200 shadow-sm p-4 overflow-y-auto max-h-[85vh] custom-scrollbar">
            {renderForm()}
          </div>

          {/* Right Column: Live A4 Resume Canvas with Page Break Guides & Height Calculation */}
          <div className="lg:col-span-5 h-[85vh]">
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
    </DashboardLayout>
  );
};

export default EditResume;