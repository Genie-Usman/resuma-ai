import { useState, useEffect, useCallback, useRef } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { getDefaultResumeData } from "../../../utils/DefaultResume";
import { captureElementAsImage, dataURLToFile, waitForImageToLoad } from "../../../utils/helper";
import uploadImage from "../../../utils/uploadImage";
import toast from "react-hot-toast";
import { reorderLayoutColumns } from "../../../utils/layoutUtils";

export const useResumeData = (resumeId) => {
  const [resumeData, setResumeDataState] = useState(getDefaultResumeData());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Undo / Redo History Stacks
  const pastRef = useRef([]);
  const futureRef = useRef([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const lastSnapshotTimeRef = useRef(0);

  const resumeDataRef = useRef(resumeData);
  useEffect(() => {
    resumeDataRef.current = resumeData;
  }, [resumeData]);

  // Synchronous snapshot recording helper
  const recordSnapshot = useCallback((isStructural = false) => {
    const current = resumeDataRef.current;
    if (!current || !current._id || !current.data) return;

    const now = Date.now();
    // Immediate snapshot for structural mutations (add, delete, reorder, visibility toggle).
    // Debounced (800ms) for rapid text edits so undo restores cohesive blocks.
    if (isStructural || now - lastSnapshotTimeRef.current > 800) {
      try {
        const cloned = JSON.parse(JSON.stringify(current));
        pastRef.current.push(cloned);
        if (pastRef.current.length > 50) pastRef.current.shift();
        futureRef.current = [];
        setCanUndo(true);
        setCanRedo(false);
        lastSnapshotTimeRef.current = now;
      } catch (err) {
        console.warn("History snapshot failed:", err);
      }
    }
  }, []);

  // Safe State Updater that records history and guarantees non-null resumeData
  const setResumeData = useCallback(
    (action, isStructural = false) => {
      recordSnapshot(isStructural);
      setResumeDataState((prev) => {
        const next = typeof action === "function" ? action(prev) : action;
        if (!next || typeof next !== "object" || !next._id) {
          return prev; // Never allow state to become null or corrupted
        }
        return next;
      });
    },
    [recordSnapshot]
  );

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

        // Seed starter content if resume is completely empty
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

        const loadedResume = {
          _id: resumeInfo._id,
          title: resumeInfo.title || "Untitled",
          template: safeData.metadata?.template || resumeInfo.template || "azurill",
          thumbnailLink: resumeInfo.thumbnailLink || "",
          data: safeData,
        };

        // Reset history on initial fetch
        pastRef.current = [];
        futureRef.current = [];
        setCanUndo(false);
        setCanRedo(false);
        lastSnapshotTimeRef.current = 0;

        resumeDataRef.current = loadedResume;
        setResumeDataState(loadedResume);
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
  const updateSection = useCallback(
    (section, key, value) => {
      recordSnapshot(false);
      setResumeDataState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          data: {
            ...prev.data,
            [section]: {
              ...prev.data?.[section],
              [key]: value,
            },
          },
        };
      });
    },
    [recordSnapshot]
  );

  // Update Item in Array Section (e.g. experience.items[index].company)
  const updateArrayItem = useCallback(
    (section, index, key, value) => {
      recordSnapshot(false);
      setResumeDataState((prev) => {
        if (!prev || !prev.data?.sections) return prev;
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
    },
    [recordSnapshot]
  );

  // Add Item to Array Section
  const addArrayItem = useCallback(
    (section, newItem) => {
      recordSnapshot(true);
      setResumeDataState((prev) => {
        if (!prev || !prev.data?.sections) return prev;
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
    },
    [recordSnapshot]
  );

  // Remove Item from Array Section
  const removeArrayItem = useCallback(
    (section, index) => {
      recordSnapshot(true);
      setResumeDataState((prev) => {
        if (!prev || !prev.data?.sections) return prev;
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
    },
    [recordSnapshot]
  );

  // Toggle Section Visibility (Hide/Show in Template)
  const toggleSectionVisibility = useCallback(
    (sectionKey) => {
      recordSnapshot(true);
      setResumeDataState((prev) => {
        if (!prev || !prev.data?.sections) return prev;
        const currentSection = prev.data.sections[sectionKey];
        if (!currentSection) return prev;

        const newVisibility = !currentSection.visible;
        toast(
          newVisibility
            ? `Shown: ${currentSection.name || sectionKey}`
            : `Hidden: ${currentSection.name || sectionKey}`,
          {
            icon: newVisibility ? "👁️" : "🙈",
            duration: 1500,
          }
        );

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
    },
    [recordSnapshot]
  );

  // Reorder Sections in metadata.layout (Drag-and-Drop)
  const reorderSections = useCallback(
    (newSectionOrder, templateId = null) => {
      recordSnapshot(true);
      setResumeDataState((prev) => {
        if (!prev) return prev;
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
              ...prev.data?.metadata,
              layout: updatedLayout,
            },
          },
        };
      });
    },
    [recordSnapshot]
  );

  // Update Font Family in metadata.typography.font
  const updateFontFamily = useCallback(
    (fontFamily, category = "sans-serif") => {
      recordSnapshot(true);
      setResumeDataState((prev) => {
        if (!prev) return prev;
        const currentTypography = prev.data?.metadata?.typography || {};
        const currentFont = currentTypography.font || {};

        return {
          ...prev,
          data: {
            ...prev.data,
            metadata: {
              ...prev.data?.metadata,
              fontFamily,
              typography: {
                ...currentTypography,
                font: {
                  ...currentFont,
                  family: fontFamily,
                  category,
                },
              },
            },
          },
        };
      });
      toast.success(`Font changed to ${fontFamily}`, { id: "font-change-toast", duration: 1200 });
    },
    [recordSnapshot]
  );

  // Update Density Scale in metadata.typography.density
  const updateDensity = useCallback(
    (density) => {
      recordSnapshot(true);
      setResumeDataState((prev) => {
        if (!prev) return prev;
        const currentTypography = prev.data?.metadata?.typography || {};

        return {
          ...prev,
          data: {
            ...prev.data,
            metadata: {
              ...prev.data?.metadata,
              density,
              typography: {
                ...currentTypography,
                density,
                lineHeight: density === "compact" ? 1.3 : density === "spacious" ? 1.65 : 1.5,
              },
            },
          },
        };
      });
      const label =
        density === "compact"
          ? "Compact (0.92x)"
          : density === "spacious"
          ? "Spacious (1.05x)"
          : "Standard (1.0x)";
      toast.success(`Density: ${label}`, { id: "density-toast", duration: 1200 });
    },
    [recordSnapshot]
  );

  // Undo Handler
  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;
    const current = resumeDataRef.current;
    if (!current || !current._id) return;

    const previousState = pastRef.current.pop();
    if (!previousState || !previousState._id) return;

    // Push current state onto future stack for Redo
    futureRef.current.unshift(JSON.parse(JSON.stringify(current)));
    if (futureRef.current.length > 50) futureRef.current.pop();

    lastSnapshotTimeRef.current = 0;
    resumeDataRef.current = previousState;
    setResumeDataState(previousState);
    setCanUndo(pastRef.current.length > 0);
    setCanRedo(true);
    toast("Undone", { icon: "↩️", duration: 1200 });
  }, []);

  // Redo Handler
  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    const current = resumeDataRef.current;
    if (!current || !current._id) return;

    const nextState = futureRef.current.shift();
    if (!nextState || !nextState._id) return;

    // Push current state back onto past stack
    pastRef.current.push(JSON.parse(JSON.stringify(current)));
    if (pastRef.current.length > 50) pastRef.current.shift();

    lastSnapshotTimeRef.current = 0;
    resumeDataRef.current = nextState;
    setResumeDataState(nextState);
    setCanUndo(true);
    setCanRedo(futureRef.current.length > 0);
    toast("Redone", { icon: "↪️", duration: 1200 });
  }, []);

  // Save Resume to Database
  const saveResume = useCallback(
    async (customData = null, silent = false) => {
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
    },
    [resumeId, resumeData]
  );

  // Upload Thumbnail & Profile Images and Save
  const uploadImagesAndSave = useCallback(
    async (newProfileImageFile, resumeElement, silent = false) => {
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
        setResumeDataState(updatedResume);
        await saveResume(updatedResume, silent);
        return updatedResume;
      } catch (error) {
        console.error("Failed to upload images and save:", error);
        if (!silent) toast.error("Failed to save resume");
        try {
          await saveResume(resumeDataRef.current || resumeData, silent);
        } catch (fallbackErr) {
          console.error("Fallback save failed:", fallbackErr);
        }
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [resumeId, resumeData, saveResume, updateSection]
  );

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
    updateFontFamily,
    updateDensity,
    saveResume,
    uploadImagesAndSave,
    // History Actions & State
    undo,
    redo,
    canUndo,
    canRedo,
  };
};
