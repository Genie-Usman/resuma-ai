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
import ProfileForm from "./Forms/ProfileForm";
import ExperienceForm from "./Forms/ExperienceForm";
import { defaultAwardItem, defaultEducationItem, defaultExperienceItem, defaultInterestItem, defaultLanguageItem, defaultProfileItem, defaultPublicationItem, defaultReferenceItem, defaultSkillsItem, defaultVolunteerItem } from "../../constants";
import EducationForm from "./Forms/EducationForm";
import SkillsForm from "./Forms/SkillsForm";
import ProjectsForm from "./Forms/ProjectsForm";
import CertificationsForm from "./Forms/CertificationsForm";
import InterestForm from "./Forms/InterestForm";
import LanguageForm from "./Forms/LanguageForm";
import PublicationsForm from "./Forms/PublicationsForm";
import AwardsForm from "./Forms/AwardsForm";
import VolunteeringForm from "./Forms/VolunteeringForm";
import ReferenceForm from "./Forms/ReferenceForm";
import { captureElementAsImage, dataURLToFile, fixTailwindColors, stripHtml, waitForImageToLoad } from "../../utils/helper.jsx";
import RenderResume from "../../components/ResumeTemplates/RenderResume";
import uploadImage from "../../utils/uploadImage.js";

const EditResume = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const resumeRef = useRef(null);
  const resumeDownloadRef = useRef(null);

  const [baseWidth, setBaseWidth] = useState(800);
  const [openThemeSelector, setOpenThemeSelector] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("personal-info");
  const [progess, setProgress] = useState(0);
  const [resumeData, setResumeData] = useState(getDefaultResumeData());
  const [errorMsg, setErrorMsg] = useState("");
  const [newProfileImageFile, setNewProfileImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Next Step Function
  const goToNextStep = () => {
    const pages = [
      "personal-info",
      "profile-info",
      "experience-info",
      "education-info",
      "skills-info",
      "projects-info",
      "interests-and-languages-info",
      "certifications-info",
      "publications-awards-info",
      "volunteering-info",
      "references-info"
    ]

    if (currentPage === "references-info") { setOpenPreviewModal(true) }

    const currentIndex = pages.indexOf(currentPage);

    if (currentIndex !== -1 && currentIndex < pages.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentPage(pages[nextIndex]);

      // Set Progress as Percentage
      const percent = Math.round((nextIndex / (pages.length - 1)) * 100);
      setProgress(percent);
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

  };

  // Validate Inputs
  const validateAndNext = (e) => {
    e.preventDefault();
    const errors = [];

    const basics = resumeData.data.basics;
    const sections = resumeData.data.sections;
    const basicSummary = sections.summary?.content || '';

    switch (currentPage) {
      case 'personal-info': {
        const { name, headline, email, phone, location } = basics;

        const cleanedSummary = stripHtml(basicSummary)?.trim();

        if (!name.trim()) errors.push("Name is required.");
        if (!headline.trim()) errors.push("Headline is required.");
        if (!email.trim()) errors.push("Valid email is required.");
        if (!phone.trim()) errors.push("Phone is required.");
        if (!location.trim()) errors.push("Location is required.");
        if (!cleanedSummary) {
          errors.push("Summary cannot be empty.");
        }

        break;
      }

      case 'profile-info': {
        const profiles = sections.profiles?.items || [];

        if (profiles.length === 0) {
          errors.push("At least one profile is required.");
        } else {
          profiles.forEach((profile, i) => {
            if (!profile.visible) return;

            if (!profile.network?.trim()) { errors.push(`Profile #${i + 1}: Network is required.`) }
            if (!profile.username?.trim()) { errors.push(`Profile #${i + 1}: Username is required.`) }
            if (!profile.url?.href?.trim()) { errors.push(`Profile #${i + 1}: URL is required.`) }
          });
        }
        break;
      }

      case 'experience-info': {
        const experienceItems = sections.experience?.items || [];

        if (experienceItems.length === 0) {
          errors.push("At least one experience entry is required.");
        } else {
          experienceItems.forEach((item, i) => {
            if (!item.company?.trim()) errors.push(`Experience #${i + 1}: Company is required.`);
            if (!item.position?.trim()) errors.push(`Experience #${i + 1}: Position is required.`);
            if (!item.location?.trim()) errors.push(`Experience #${i + 1}: Location is required.`);
            if (!item.date?.trim()) errors.push(`Experience #${i + 1}: Date is required.`);
            if (!stripHtml(item.summary)?.trim()) {
              errors.push(`Experience #${i + 1}: Summary cannot be empty.`);
            }
          });
        }
        break;
      }

      case 'education-info': {
        const educationItems = sections.education?.items || [];
        if (educationItems.length === 0) {
          errors.push("At least one education entry is required.");
        } else {
          educationItems.forEach((item, i) => {
            if (!item.institution?.trim()) errors.push(`Education #${i + 1}: Institution is required.`);
            if (!item.studyType?.trim()) errors.push(`Education #${i + 1}: Degree is required.`);
          });
        }
        break;
      }

      case 'skills-info': {
        const skillsItems = sections.skills?.items || [];
        if (skillsItems.length === 0) {
          errors.push("At least one skill is required.");
        } else {
          skillsItems.forEach((item, i) => {
            if (!item.name?.trim()) errors.push(`Skill #${i + 1}: Name is required.`);
          });
        }
        break;
      }

      case 'projects-info': {
        const projects = sections.projects?.items || [];
        if (projects.length > 0) {
          projects.forEach((item, i) => {
            if (!item.name?.trim()) errors.push(`Project #${i + 1}: Name is required.`);
            if (!item.description?.trim()) errors.push(`Project #${i + 1}: Description is required.`);
          });
        }
        break;
      }

      case 'interests-and-languages-info': {
        const languages = sections.languages?.items || [];
        const interests = sections.interests?.items || [];
        if (languages.length === 0) {
          errors.push("At least one language is required.");
        }
        if (languages.length > 0) {
          languages.forEach((item, i) => {
            if (!item.name?.trim()) errors.push(`Language #${i + 1}: Name is required.`);
          })
        }
        if (interests.length === 0) {
          errors.push("At least one interest is required.");
        }
        break;
      }
    }

    // Handle the result
    if (errors.length > 0) {
      setErrorMsg(errors.join(", "))
      return;
    }

    // Proceed to the next step
    setErrorMsg('');
    goToNextStep();
  };

  // Previous Step Navigation Function
  const goBack = () => {
    const pages = [
      "personal-info",
      "profile-info",
      "experience-info",
      "education-info",
      "skills-info",
      "projects-info",
      "certifications-info",
      "interests-and-languages-info",
      "publications-awards-info",
      "volunteering-info",
      "references-info"
    ];

    if (currentPage === "personal-info") {
      navigate("/dashboard");
      return;
    }

    const currentIndex = pages.indexOf(currentPage);

    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const prevPage = pages[prevIndex];
      setCurrentPage(prevPage);

      // 👇 Restore section visibility on back
      const sectionMap = {
        "profile-info": "profiles",
        "experience-info": "experience",
        "education-info": "education",
        "skills-info": "skills",
        "projects-info": "projects",
        "certifications-info": "certifications",
        "interests-and-languages-info": ["interests", "languages"],
        "publications-awards-info": ["publications", "awards"],
        "volunteering-info": "volunteer",
        "references-info": "references",
      };

      const targetSections = sectionMap[prevPage];

      setResumeData((prev) => {
        const updatedSections = { ...prev.data.sections };

        if (Array.isArray(targetSections)) {
          targetSections.forEach((sec) => {
            updatedSections[sec] = {
              ...updatedSections[sec],
              visible: true,
            };
          });
        } else if (targetSections) {
          updatedSections[targetSections] = {
            ...updatedSections[targetSections],
            visible: true,
          };
        }

        return {
          ...prev,
          data: {
            ...prev.data,
            sections: updatedSections,
          },
        };
      });

      // Update Progress
      const percent = Math.round((prevIndex / (pages.length - 1)) * 100);
      setProgress(percent);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };


  const renderForm = () => {
    if (!resumeData?.data || !resumeData.data.basics) return null;
    switch (currentPage) {
      case "personal-info":
        return (
          <PersonalInfoForm
            profileData={resumeData.data.basics}
            updateSection={(key, value) => updateSection("basics", key, value)}
            resumeData={resumeData}
            setResumeData={setResumeData}
            onNext={validateAndNext}
          />
        )

      case 'profile-info':
        return (
          <ProfileForm
            profiles={resumeData.data.sections.profiles.items || []}
            updateArrayItem={(index, key, value) => updateArrayItem('profiles', index, key, value)}
            addArrayItem={() => addArrayItem('profiles', defaultProfileItem)}
            removeArrayItem={(index) => removeArrayItem('profiles', index)}
            setResumeData={setResumeData}
          />
        )

      case 'experience-info':
        return (
          <ExperienceForm
            experience={resumeData.data.sections.experience.items || []}
            updateArrayItem={(index, key, value) => updateArrayItem('experience', index, key, value)}
            addArrayItem={() => addArrayItem('experience', defaultExperienceItem)}
            removeArrayItem={(index) => removeArrayItem('experience', index)}
            setResumeData={setResumeData}
          />
        )

      case 'education-info':
        return (
          <EducationForm
            education={resumeData.data.sections.education.items || []}
            updateArrayItem={(index, key, value) => updateArrayItem('education', index, key, value)}
            addArrayItem={() => addArrayItem('education', defaultEducationItem)}
            removeArrayItem={(index) => removeArrayItem('education', index)}
            setResumeData={setResumeData}
          />
        )

      case 'skills-info':
        return (
          <SkillsForm
            skills={resumeData.data.sections.skills.items || []}
            updateArrayItem={(index, key, value) => updateArrayItem('skills', index, key, value)}
            addArrayItem={() => addArrayItem('skills', defaultSkillsItem)}
            removeArrayItem={(index) => removeArrayItem('skills', index)}
            setResumeData={setResumeData}
          />
        )

      case 'projects-info':
        return (
          <ProjectsForm
            projects={resumeData.data.sections.projects.items || []}
            updateArrayItem={(index, key, value) => updateArrayItem('projects', index, key, value)}
            addArrayItem={() => addArrayItem('projects', defaultSkillsItem)}
            removeArrayItem={(index) => removeArrayItem('projects', index)}
            setResumeData={setResumeData}
          />
        )

      case 'interests-and-languages-info':
        return (
          <>
          <LanguageForm
            languages={resumeData.data.sections.languages.items || []}
            updateArrayItem={(index, key, value) => updateArrayItem('languages', index, key, value)}
            addArrayItem={() => addArrayItem('languages', defaultLanguageItem)}
            removeArrayItem={(index) => removeArrayItem('languages', index)}
            setResumeData={setResumeData}
          />

            <InterestForm
              interests={resumeData.data.sections.interests.items || []}
              updateArrayItem={(index, key, value) => updateArrayItem('interests', index, key, value)}
              addArrayItem={() => addArrayItem('interests', defaultInterestItem)}
              removeArrayItem={(index) => removeArrayItem('interests', index)}
              setResumeData={setResumeData}
            />
          </>
        )

      case 'certifications-info':
        return (
          <>
            <CertificationsForm
              certifications={resumeData.data.sections.certifications.items || []}
              updateArrayItem={(index, key, value) => updateArrayItem('certifications', index, key, value)}
              addArrayItem={() => addArrayItem('certifications', defaultSkillsItem)}
              removeArrayItem={(index) => removeArrayItem('certifications', index)}
            />

            <PublicationsForm
              publications={resumeData.data.sections.publications.items || []}
              updateArrayItem={(index, key, value) => updateArrayItem('publications', index, key, value)}
              addArrayItem={() => addArrayItem('publications', defaultPublicationItem)}
              removeArrayItem={(index) => removeArrayItem('publications', index)}
            />

            <AwardsForm
              awards={resumeData.data.sections.awards.items || []}
              updateArrayItem={(index, key, value) => updateArrayItem('awards', index, key, value)}
              addArrayItem={() => addArrayItem('awards', defaultAwardItem)}
              removeArrayItem={(index) => removeArrayItem('awards', index)}
            />

            <VolunteeringForm
              volunteer={resumeData.data.sections.volunteer.items || []}
              updateArrayItem={(index, key, value) => updateArrayItem('volunteer', index, key, value)}
              addArrayItem={() => addArrayItem('volunteer', defaultVolunteerItem)}
              removeArrayItem={(index) => removeArrayItem('volunteer', index)}
            />

            <ReferenceForm
              references={resumeData.data.sections.references.items || []}
              updateArrayItem={(index, key, value) => updateArrayItem('references', index, key, value)}
              addArrayItem={() => addArrayItem('references', defaultReferenceItem)}
              removeArrayItem={(index) => removeArrayItem('references', index)}
            />
          </>
        )

      // case 'publications-awards-info':
      //   return (
      //     <>
      //     </>
      //   )

      // case 'volunteering-info':
      //   return (

      //   )

      // case 'references-info':
      //   return (


      //   )

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
  const updateArrayItem = (section, index, key, value) => {
    setResumeData((prev) => {
      const items = [...prev.data.sections[section].items];
      const item = { ...items[index] };

      if (!key) {
        // Replace the whole item if key is null
        items[index] = value;
      } else {
        const keys = key.split(".");
        let target = item;

        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          // Ensure nested object exists
          target[key] = target[key] || {};
          target = target[key];
        }

        target[keys[keys.length - 1]] = value;
        items[index] = item;
      }

      return {
        ...prev,
        data: {
          ...prev.data,
          sections: {
            ...prev.data.sections,
            [section]: {
              ...prev.data.sections[section],
              items,
            },
          },
        },
      };
    });
  };

  // Add new item to Array
  const addArrayItem = (section, newItem) => {
    setResumeData((prev) => {
      const items = prev.data.sections[section]?.items || [];

      return {
        ...prev,
        data: {
          ...prev.data,
          sections: {
            ...prev.data.sections,
            [section]: {
              ...prev.data.sections[section],
              items: [...items, newItem],
            },
          },
        },
      };
    });
  };

  // Remove item from Array
  const removeArrayItem = (section, index) => {
    setResumeData((prev) => {
      const items = [...(prev.data.sections[section]?.items || [])];
      items.splice(index, 1);

      return {
        ...prev,
        data: {
          ...prev.data,
          sections: {
            ...prev.data.sections,
            [section]: {
              ...prev.data.sections[section],
              items,
            },
          },
        },
      };
    });
  };

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
  const uploadResumeImages = async () => {
    try {
      setIsLoading(true);

      let uploadedProfileImageUrl = resumeData.data.basics.picture.url || '';

      if (newProfileImageFile) {
        const imgUploadRes = await uploadImage(newProfileImageFile);
        if (imgUploadRes.imageUrl) {
          uploadedProfileImageUrl = imgUploadRes.imageUrl;

          setResumeData((prev) => ({
            ...prev,
            data: {
              ...prev.data,
              basics: {
                ...prev.data.basics,
                picture: {
                  ...prev.data.basics.picture,
                  url: uploadedProfileImageUrl,
                  file: undefined,
                },
              },
            },
          }));

          await new Promise((resolve) => setTimeout(resolve, 300));
        } else {
          console.warn('No imageUrl returned from uploadImage');
        }
      }

      const profileImgUrl = resumeData.data.basics?.picture?.url;
      if (profileImgUrl) {
        try {
          await waitForImageToLoad(profileImgUrl);
        } catch (e) {
          console.warn("Profile image failed to preload. It may be missing from the thumbnail.");
        }
      }

      fixTailwindColors(resumeRef.current);
      await new Promise((r) => setTimeout(r, 1000));
      const imageDataUrl = await captureElementAsImage(resumeRef.current);
      const thumbnailFile = dataURLToFile(imageDataUrl, `resume-${resumeId}.png`);

      const formData = new FormData();
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

      const uploadResponse = await axiosInstance.put(
        API_PATHS.RESUME.UPLOAD_IMAGES(resumeId),
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const { thumbnailLink } = uploadResponse.data;

      const updatedResumeData = {
        ...resumeData,
        thumbnailLink: thumbnailLink || '',
        data: {
          ...resumeData.data,
          basics: {
            ...resumeData.data.basics,
            picture: {
              ...resumeData.data.basics.picture,
              url: uploadedProfileImageUrl,
              file: undefined,
            },
          },
        },
      };

      setResumeData(updatedResumeData);
      await updateResumeDetails(updatedResumeData);

      toast.success('Resume Updated Successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setIsLoading(false);
    }
  };

  const updateResumeDetails = async (updatedResume) => {
    try {
      await axiosInstance.put(API_PATHS.RESUME.UPDATE(resumeId), updatedResume);
    } catch (error) {
      console.error('Error updating resume details:', error);
    }
  };

  // Delete Resume 
  const handleDeleteResume = async () => { };

  // Download Resume
  const reactToPrintFn = useReactToPrint({ contentRef: resumeDownloadRef });

  // Function to update baseWidth based on the resume container size
  const updateBaseWidth = () => {
    if (resumeRef.current) {
      setBaseWidth(resumeRef.current.offsetWidth);
    }
  };

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
                  Back
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

            {resumeData?.data?.basics && (
              <RenderResume
                templateId={resumeData?.template?.theme || ""}
                resumeData={resumeData}
                colorPalette={resumeData?.template?.colorPalette || []}
                containerWidth={baseWidth}
              />
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}

export default EditResume