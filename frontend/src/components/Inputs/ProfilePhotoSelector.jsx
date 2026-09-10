import { useRef, useState } from 'react';
import { LuUser, LuUpload, LuTrash2, LuCamera } from 'react-icons/lu';
import uploadImage from '../../utils/uploadImage';
import toast from 'react-hot-toast';

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview, onImageUploaded }) => {
  const inputRef = useRef();
  const [previewURL, setPreviewURL] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be smaller than 5 MB");
        return;
      }

      setImage(file);
      const localPreview = URL.createObjectURL(file);
      setPreview?.(localPreview);
      setPreviewURL(localPreview);

      try {
        setIsUploading(true);
        const response = await uploadImage(file);
        if (response?.imageUrl) {
          onImageUploaded?.(response.imageUrl);
          toast.success("Photo uploaded successfully!");
        }
      } catch (err) {
        console.error("Image upload failed:", err);
        toast.error("Failed to upload photo.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewURL(null);
    setPreview?.(null);
    if (inputRef.current) inputRef.current.value = null;
    onImageUploaded?.("");
    toast.success("Photo removed");
  };

  const onChooseFile = () => {
    inputRef.current?.click();
  };

  const activeSrc = preview || previewURL || image;

  return (
    <div className="flex items-center gap-4 p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-2xl w-full">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Avatar Display */}
      <div
        onClick={onChooseFile}
        className="relative group w-18 h-18 rounded-2xl overflow-hidden bg-purple-50 border-2 border-white shadow-sm flex items-center justify-center cursor-pointer shrink-0 transition-transform active:scale-95"
        title="Click to change photo"
      >
        {activeSrc ? (
          <img
            src={activeSrc}
            alt="Profile Photo"
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
        ) : (
          <LuUser className="text-3xl text-purple-400" />
        )}

        {/* Hover Camera Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-base">
          <LuCamera />
        </div>
      </div>

      {/* Action Controls & Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-semibold text-slate-800 tracking-tight">
          Profile Photo
        </h4>
        <p className="text-[11px] text-slate-400 mt-0.5">
          PNG, JPG, WebP up to 5 MB. Headshots recommend.
        </p>

        <div className="flex items-center gap-2 mt-2">
          <button
            type="button"
            onClick={onChooseFile}
            disabled={isUploading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-200 rounded-xl shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <LuUpload className="text-xs text-purple-600" />
            <span>{isUploading ? "Uploading..." : activeSrc ? "Change Photo" : "Upload Photo"}</span>
          </button>

          {activeSrc && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl transition-colors cursor-pointer"
              title="Remove profile photo"
            >
              <LuTrash2 className="text-xs" />
              <span>Remove</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotoSelector;