import { useEffect, useRef, useState } from "react";
import { getDefaultResumeData } from "../../utils/DefaultResume";
import { useNavigate, useParams } from "react-router-dom";
import { LuArrowLeft, LuCircleAlert, LuDownload, LuPalette, LuSave, LuTrash2 } from "react-icons/lu"
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import TitleInput from "../../components/Inputs/TitleInput";
import { useReactToPrint } from "react-to-print";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import StepProgress from "../../components/shared/StepProgress";
import PersonalInfoForm from "./Forms/PersonalInfoForm";
import SummarySectionForm from "./Forms/SummarySectionForm";
import ProfilesInfoForm from "./Forms/ProfilesInfoForm";

const EditResume = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const resumeRef = useRef(null);
  const resumeDownloadRef = useRef(null);

  const [baseWidth, setBaseWidth] = useState(800);
  const [openThemeSelector, setOpenThemeSelector] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("profiles-info");
  const [progess, setProgress] = useState(0);
  const [resumeData, setResumeData] = useState(getDefaultResumeData());
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);





  // Validate Inputs
  const validateAndNext = (e) => { };

  // Next Step Navigation Function
  const goToNextStep = () => { };

  // Previous Step Navigation Function
  const goBack = () => { };

  const renderForm = () => {
    if (!resumeData?.data || !resumeData.data.basics) return null;
    switch (currentPage) {
      case "personal-info":
        return (
          <>
            <PersonalInfoForm
              profileData={resumeData.data.basics}
              updateSection={(key, value) => updateSection("basics", key, value)}
              onNext={validateAndNext}
            />

            <SummarySectionForm
              content={resumeData.data.sections?.summary?.content || ''}
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
          </>
        )

      case 'profiles-info':
        return (
          <ProfilesInfoForm
            profiles={resumeData.data.sections.profiles.items || []}
            setResumeData={setResumeData}
          />
        )

      default:
        return null;
    }
  };

  // Update Simple Nested Object
  const updateSection = (section, key, value) => {
    setResumeData((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [section]: {
          ...prev.data[section],
          [key]: value,
        },
      },
    }));
  };

  // Update Array Items
  const updateArrayItem = (section, index, key, value) => { };

  // Add item to Array
  const addArrayItem = (section, newItem) => { };

  // Remove item from Array
  const removeArrayItem = (section, index) => { };

  // Fetch Resume Info by ID
  const fetchResumeDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_BY_ID(resumeId));

      if (response.data && response.data.data) {
        const resumeInfo = response.data;

        setResumeData((prevState) => ({
          ...prevState,
          title: resumeInfo.title || "Untitled",
          template: resumeInfo.template || prevState.template,
          data: resumeInfo.data || prevState.data,
        }));
      }
    } catch (error) {
      console.error("Error fetching resumes: ", error);
    }
  };

  // Upload thumbnail and Resume Profile Image
  const uploadResumeImages = async () => { };

  const updateResumeDetails = async (thumbnailLink, profilePreviewUrl) => { };

  // Delete Resume 
  const handleDeleteResume = async () => { };

  // Download Resume
  const reactToPrintFn = useReactToPrint({ contentRef: resumeDownloadRef });

  // Function to update baseWidth based on the resume container size
  const updateBaseWidth = () => { };

  useEffect(() => {
    updateBaseWidth();
    window.addEventListener("resize", updateBaseWidth);

    if (resumeId) {
      fetchResumeDetailsByID();
    }

    return () => {
      window.removeEventListener("resize", updateBaseWidth);
    }

  }, [])



  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-5 bg-white rounded-lg border border-purple-100 py-3 px-4 mb-4">
          <TitleInput
            title={resumeData.title}
            setTitle={(value) => setResumeData((prev) => ({ ...prev, title: value }))}
          />

          <div className="flex items-center gap-4">
            <button
              className="btn-small-light"
              onClick={() => setOpenThemeSelector(true)}
            >
              <LuPalette className="text-[16px]" />
              <span className="hidden md:block">Change Theme</span>
            </button>

            <button
              className="btn-small-light"
              onClick={handleDeleteResume}
            >
              <LuTrash2 className="text-[16px]" />
              <span className="hidden md:block">Delete</span>
            </button>

            <button
              className="btn-small-light"
              onClick={() => setOpenPreviewModal(true)}
            >
              <LuDownload className="text-[16px]" />
              <span className="hidden md:block">Preview & Download</span>
            </button>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-lg border border-purple-100 overflow-hidden">

            <StepProgress progress={30} />

            {renderForm()}

            <div className="mx-5">
              {errorMsg && (
                <div className="flex items-center gap-2 text-[11px] font-medium text-amber-600 bg-amber-100 px-2 py-0.5 my-1 rounded">
                  <LuCircleAlert className="text-base" /> {errorMsg}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 mt-3 mb-5">
                <button
                  className="btn-small-light"
                  onClick={goBack}
                  disabled={isLoading}
                >
                  <LuArrowLeft className="text-[16px]" />
                </button>

                <button
                  className="btn-small-light"
                  onClick={uploadResumeImages}
                  disabled={isLoading}
                >
                  <LuSave className="text-[16px]" />
                  {isLoading ? "Updating..." : "Save & Exit"}
                </button>

                <button
                  className="btn-small"
                  onClick={validateAndNext}
                  disabled={isLoading}
                >
                  {currentPage === 'additional-info' && (
                    <LuDownload className="text-[16px]" />
                  )}

                  {currentPage === 'additional-info' ? "Preview & Download" : "Next"}

                  {currentPage !== 'additional-info' && (
                    <LuArrowLeft className="text-[16px] rotate-180" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div ref={resumeRef} className="h-[100vh]">
            {/* Resume Template */}
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}

export default EditResume
