import { useState, useEffect, useCallback, useRef } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { getDefaultResumeData } from "../../../utils/DefaultResume";
import { captureElementAsImage, dataURLToFile, waitForImageToLoad } from "../../../utils/helper";
import uploadImage from "../../../utils/uploadImage";
import toast from "react-hot-toast";
import { reorderLayoutColumns } from "../../../utils/layoutUtils";

export const useResumeData = (resumeId) => {
  const [resumeData, setResumeData] = useState(getDefaultResumeData());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const resumeDataRef = useRef(resumeData);
  useEffect(() => {
    resumeDataRef.current = resumeData;
  }, [resumeData]);

  // Fetch Resume Details by ID
  const fetchResumeDetails = useCallback(async () => {
    if (!resumeId) return;
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_BY_ID(resumeId));
      if (response.data) {
        const resumeInfo = response.data;
        const defaultData = getDefaultResumeData();
        const incomingData = resumeInfo.data || {};

        // If the incoming resume has no content at all (0 experience, 0 education, 0 skills, 0 summary),
        // seed with default starter content so the template renders beautifully
        const hasContent =
          (incomingData.sections?.experience?.items?.length || 0) > 0 ||
          (incomingData.sections?.education?.items?.length || 0) > 0 ||
          (incomingData.sections?.skills?.items?.length || 0) > 0 ||
          Boolean(incomingData.sections?.summary?.content?.trim());

        const mergedSections = hasContent
          ? {
              ...defaultData.sections,
              ...(incomingData.sections || {}),
            }
          : defaultData.sections;

        const safeData = {
          ...defaultData,
          ...incomingData,
          basics: {
            ...defaultData.basics,
            ...(incomingData.basics || {}),
          },
          sections: mergedSections,
          metadata: {
            ...defaultData.metadata,
            ...(incomingData.metadata || {}),
          },
        };

        setResumeData((prev) => ({
          ...prev,
          _id: resumeInfo._id,
          title: resumeInfo.title || "Untitled",
          template: safeData.metadata?.template || resumeInfo.template || prev.template || "azurill",
          thumbnailLink: resumeInfo.thumbnailLink || "",
          data: safeData,
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
  const reorderSections = useCallback((newSectionOrder, templateId = null) => {
    setResumeData((prev) => {
      const activeTemplate = templateId || prev.data?.metadata?.template || prev.template;
      const updatedLayout = reorderLayoutColumns(
        prev.data?.metadata?.layout,
        newSectionOrder,
        prev.data?.sections,
        activeTemplate
      );

      return {
        ...prev,
        data: {
          ...prev.data,
          metadata: {
            ...prev.data.metadata,
            layout: updatedLayout,
          },
        },
      };
    });
  }, []);

  // Save Resume to Database
  const saveResume = useCallback(async (customData = null, silent = false) => {
    try {
      setIsSaving(true);
      const payload = customData || resumeDataRef.current || resumeData;
      const response = await axiosInstance.put(API_PATHS.RESUME.UPDATE(resumeId), payload);
      if (!silent) toast.success("Resume saved successfully!");
      return response.data;
    } catch (error) {
      console.error("Save resume error:", error);
      if (!silent) toast.error(error.response?.data?.message || "Failed to save resume.");
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [resumeId, resumeData]);

  // Upload Thumbnail & Profile Images and Save
  const uploadImagesAndSave = useCallback(async (newProfileImageFile, resumeElement, silent = false) => {
    try {
      setIsSaving(true);
      const currentResume = resumeDataRef.current || resumeData;
      let uploadedProfileImageUrl = currentResume.data?.basics?.picture?.url || "";

      if (newProfileImageFile) {
        try {
          const imgUploadRes = await uploadImage(newProfileImageFile);
          if (imgUploadRes?.imageUrl) {
            uploadedProfileImageUrl = imgUploadRes.imageUrl;
            updateSection("basics", "picture", {
              ...currentResume.data?.basics?.picture,
              url: uploadedProfileImageUrl,
            });
            await new Promise((r) => setTimeout(r, 200));
          }
        } catch (profileUploadErr) {
          console.warn("Profile image upload failed:", profileUploadErr);
        }
      }

      const profileImgUrl = currentResume.data?.basics?.picture?.url;
      if (profileImgUrl) {
        try {
          await waitForImageToLoad(profileImgUrl);
        } catch {
          // Preload failed, proceed with capture
        }
      }

      let thumbnailLink = currentResume.thumbnailLink || "";
      if (resumeElement) {
        try {
          const imageDataUrl = await captureElementAsImage(resumeElement);
          const ext = imageDataUrl.startsWith("data:image/jpeg") ? "jpg" : "png";
          const thumbnailFile = dataURLToFile(imageDataUrl, `resume-${resumeId}.${ext}`);

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
        } catch (captureErr) {
          console.error("Thumbnail capture or upload error:", captureErr);
        }
      }

      const latestData = resumeDataRef.current || currentResume;
      const updatedResume = {
        ...latestData,
        thumbnailLink: thumbnailLink || latestData.thumbnailLink,
        data: {
          ...latestData.data,
          basics: {
            ...latestData.data?.basics,
            picture: {
              ...latestData.data?.basics?.picture,
              url: uploadedProfileImageUrl,
            },
          },
        },
      };

      resumeDataRef.current = updatedResume;
      setResumeData(updatedResume);
      await saveResume(updatedResume, silent);
      return updatedResume;
    } catch (error) {
      console.error("Failed to upload images and save:", error);
      if (!silent) toast.error("Failed to save resume");
      // Fallback: at least save the JSON data
      try {
        await saveResume(resumeDataRef.current || resumeData, silent);
      } catch (fallbackErr) {
        console.error("Fallback save failed:", fallbackErr);
      }
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [resumeId, resumeData, saveResume, updateSection]);

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
