import { useEffect } from "react";
import { LuUser } from "react-icons/lu";
import ProfilePhotoSelector from "../../../components/Inputs/ProfilePhotoSelector";

const PersonalInfoForm = ({ profileData, updateSection }) => {
  useEffect(() => {
    document.title = "Resuma AI - Personal Info";
  }, []);

  return (
    <div className="p-1 sm:p-2 space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-slate-100 flex items-start sm:items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Personal Information
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Your contact details and basic information.
          </p>
        </div>
      </div>

      {/* Profile Photo */}
      <ProfilePhotoSelector
        image={profileData?.picture?.url || ""}
        setImage={(value) =>
          updateSection("picture", {
            ...profileData?.picture,
            url: value,
          })
        }
        preview={profileData?.picture?.url || ""}
        setPreview={(value) =>
          updateSection("picture", {
            ...profileData?.picture,
            url: value,
          })
        }
        onImageUploaded={(url) =>
          updateSection("picture", {
            ...profileData?.picture,
            url,
          })
        }
      />

      {/* Main Details Form */}
      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="studio-label">Full Name</label>
          <input
            type="text"
            value={profileData?.name || ""}
            onChange={({ target }) => updateSection("name", target.value)}
            placeholder="e.g. Alex Morgan"
            className="studio-input"
          />
        </div>

        {/* Professional Headline */}
        <div>
          <label className="studio-label">Headline / Job Title</label>
          <input
            type="text"
            value={profileData?.headline || ""}
            onChange={({ target }) => updateSection("headline", target.value)}
            placeholder="e.g. Senior Software Engineer"
            className="studio-input"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Your current role or professional title
          </p>
        </div>

        {/* Contact Info (Email & Phone) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="studio-label">Email Address</label>
            <input
              type="email"
              value={profileData?.email || ""}
              onChange={({ target }) => updateSection("email", target.value)}
              placeholder="alex.morgan@example.com"
              className="studio-input"
            />
          </div>

          <div>
            <label className="studio-label">Phone Number</label>
            <input
              type="tel"
              value={profileData?.phone || ""}
              onChange={({ target }) => updateSection("phone", target.value)}
              placeholder="+1 (555) 234-5678"
              className="studio-input"
            />
          </div>
        </div>

        {/* Location & Portfolio Website */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="studio-label">Location / City</label>
            <input
              type="text"
              value={profileData?.location || ""}
              onChange={({ target }) => updateSection("location", target.value)}
              placeholder="San Francisco, CA (Remote)"
              className="studio-input"
            />
          </div>

          <div>
            <label className="studio-label">Portfolio / Website</label>
            <input
              type="url"
              value={profileData?.url?.href || ""}
              onChange={({ target }) =>
                updateSection("url", {
                  ...profileData?.url,
                  href: target.value,
                  label: target.value.replace(/^https?:\/\//, ""),
                })
              }
              placeholder="https://alexmorgan.dev"
              className="studio-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;