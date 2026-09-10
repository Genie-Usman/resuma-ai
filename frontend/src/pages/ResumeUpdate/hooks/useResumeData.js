import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { getDefaultResumeData } from "../../../utils/DefaultResume";
import { captureElementAsImage, dataURLToFile, fixTailwindColors, waitForImageToLoad } from "../../../utils/helper";
import uploadImage from "../../../utils/uploadImage";
import toast from "react-hot-toast";

export const useResumeData = (resumeId) => {
  const [resumeData, setResumeData] = useState(getDefaultResumeData());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch Resume Details by ID
  const fetchResumeDetails = useCallback(async () => {
    if (!resumeId) return;
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_BY_ID(resumeId));
      if (response.data) {
        const resumeInfo = response.data;
        setResumeData((prev) => ({
          ...prev,
          _id: resumeInfo._id,
          title: resumeInfo.title || "Untitled",
          template: resumeInfo.template || prev.template,
          thumbnailLink: resumeInfo.thumbnailLink || "",
          data: resumeInfo.data || prev.data,
        }));
      }
    } catch (error) {
      console.error("Error fetching resume details: ", error);
      toast.error("Failed to load resume.");
    } finally {
      setIsLoading(false);
    }
  }, [resumeId]);

  useEffect(() => {
    fetchResumeDetails();
  }, [fetchResumeDetails]);

  // Update Simple Nested Field (e.g. basics.name)
  const updateSection = useCallback((section, key, value) => {
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
  }, []);

  // Update Item in Array Section (e.g. experience.items[index].company)
  const updateArrayItem = useCallback((section, index, key, value) => {
    setResumeData((prev) => {
      const items = [...(prev.data.sections[section]?.items || [])];
      const item = { ...items[index] };

      if (!key) {
        items[index] = value;
      } else {
        const keys = key.split(".");
        let target = item;
        for (let i = 0; i < keys.length - 1; i++) {
          const k = keys[i];
          target[k] = target[k] || {};
          target = target[k];
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
  }, []);

  // Add Item to Array Section
  const addArrayItem = useCallback((section, newItem) => {
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
  }, []);

  // Remove Item from Array Section
  const removeArrayItem = useCallback((section, index) => {
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
  }, []);

  // Toggle Section Visibility (Hide/Show in Template)
  const toggleSectionVisibility = useCallback((sectionKey) => {
    setResumeData((prev) => {
      const currentSection = prev.data.sections[sectionKey];
      if (!currentSection) return prev;

      const newVisibility = !currentSection.visible;
      toast(newVisibility ? `Shown: ${currentSection.name || sectionKey}` : `Hidden: ${currentSection.name || sectionKey}`, {
        icon: newVisibility ? '👁️' : '🙈',
        duration: 1500,
      });

      return {
        ...prev,
        data: {
          ...prev.data,
          sections: {
            ...prev.data.sections,
            [sectionKey]: {
              ...currentSection,
              visible: newVisibility,
            },
          },
        },
      };
    });
  }, []);

  // Reorder Sections in metadata.layout (Drag-and-Drop)
  const reorderSections = useCallback((newSectionOrder, columnIndex = 0) => {
    setResumeData((prev) => {
      const currentLayout = Array.isArray(prev.data.metadata.layout)
        ? [...prev.data.metadata.layout]
        : [[], []];

      currentLayout[columnIndex] = newSectionOrder;

      return {
        ...prev,
        data: {
          ...prev.data,
          metadata: {
            ...prev.data.metadata,
            layout: currentLayout,
          },
        },
      };
    });
  }, []);

  // Save Resume to Database
  const saveResume = useCallback(async (customData = null) => {
    try {
      setIsSaving(true);
      const payload = customData || resumeData;
      const response = await axiosInstance.put(API_PATHS.RESUME.UPDATE(resumeId), payload);
      toast.success("Resume saved successfully!");
      return response.data;
    } catch (error) {
      console.error("Save resume error:", error);
      toast.error(error.response?.data?.message || "Failed to save resume.");
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [resumeData, resumeId]);

  // Upload Thumbnail & Profile Images and Save
  const uploadImagesAndSave = useCallback(async (newProfileImageFile, resumeElement) => {
    try {
      setIsSaving(true);
      let uploadedProfileImageUrl = resumeData.data.basics.picture.url || "";

      if (newProfileImageFile) {
        const imgUploadRes = await uploadImage(newProfileImageFile);
        if (imgUploadRes?.imageUrl) {
          uploadedProfileImageUrl = imgUploadRes.imageUrl;
          updateSection("basics", "picture", {
            ...resumeData.data.basics.picture,
            url: uploadedProfileImageUrl,
          });
          await new Promise((r) => setTimeout(r, 200));
        }
      }

      const profileImgUrl = resumeData.data.basics?.picture?.url;
      if (profileImgUrl) {
        try {
          await waitForImageToLoad(profileImgUrl);
        } catch {
          // Preload failed, proceed with capture
        }
      }

      let thumbnailLink = resumeData.thumbnailLink || "";
      if (resumeElement) {
        fixTailwindColors(resumeElement);
        await new Promise((r) => setTimeout(r, 500));
        const imageDataUrl = await captureElementAsImage(resumeElement);
        const thumbnailFile = dataURLToFile(imageDataUrl, `resume-${resumeId}.png`);

        const formData = new FormData();
        if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

        const uploadResponse = await axiosInstance.put(
          API_PATHS.RESUME.UPLOAD_IMAGES(resumeId),
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (uploadResponse.data?.thumbnailLink) {
          thumbnailLink = uploadResponse.data.thumbnailLink;
        }
      }

      const updatedResume = {
        ...resumeData,
        thumbnailLink,
        data: {
          ...resumeData.data,
          basics: {
            ...resumeData.data.basics,
            picture: {
              ...resumeData.data.basics.picture,
              url: uploadedProfileImageUrl,
            },
          },
        },
      };

      setResumeData(updatedResume);
      await saveResume(updatedResume);
      return updatedResume;
    } catch (error) {
      console.error("Failed to upload images and save:", error);
      toast.error("Failed to save thumbnail/image");
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [resumeData, resumeId, saveResume, updateSection]);

  return {
    resumeData,
    setResumeData,
    isLoading,
    isSaving,
    errorMsg,
    setErrorMsg,
    updateSection,
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
    toggleSectionVisibility,
    reorderSections,
    saveResume,
    uploadImagesAndSave,
  };
};
