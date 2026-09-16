import { useEffect, useMemo } from "react";
import {
  LuUser,
  LuQrCode,
  LuSmartphone,
  LuSparkles,
  LuLink,
} from "react-icons/lu";
import {
  FaGlobe,
  FaLinkedin,
  FaGithub,
  FaLink as FaLinkIcon,
} from "react-icons/fa6";
import ProfilePhotoSelector from "../../../components/Inputs/ProfilePhotoSelector";
import ResumeQrCode, {
  resolveQrUrl,
  getDefaultSubtitle,
} from "../../../components/ResumeSections/ResumeQrCode";

const DESTINATIONS = [
  {
    id: "portfolio",
    label: "Portfolio",
    icon: FaGlobe,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: FaLinkedin,
  },
  {
    id: "github",
    label: "GitHub",
    icon: FaGithub,
  },
  {
    id: "custom",
    label: "Custom",
    icon: FaLinkIcon,
  },
];

const PersonalInfoForm = ({ profileData = {}, updateSection, profiles = [] }) => {
  useEffect(() => {
    document.title = "Resuma AI - Personal Info";
  }, []);

  const qr = profileData?.qrCode || {};
  const isQrEnabled = qr.enabled === true;

  const resolvedTargetUrl = useMemo(
    () => resolveQrUrl(qr, profileData, profiles),
    [qr, profileData, profiles]
  );

  return (
    <div className="p-1 sm:p-2 space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-slate-100 flex items-start sm:items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Personal Information
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Your contact details, digital identity, and basic information.
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

      {/* 3. Discreet QR Code Generator (Roadmap Item 3.2) */}
      <div className="border border-slate-200/80 rounded-2xl p-4 sm:p-5 bg-white shadow-2xs space-y-4 transition-all">
        {/* Card Header with Enable Toggle */}
        <div className="flex items-start sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
            <div
              className={`p-2.5 rounded-xl transition-colors shrink-0 mt-0.5 sm:mt-0 ${
                isQrEnabled
                  ? "bg-purple-600 text-white shadow-xs shadow-purple-500/20"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <LuQrCode className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h3 className="text-sm font-bold text-slate-900 whitespace-nowrap">
                  Discreet QR Code
                </h3>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                  Paper ➔ Digital
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                Connect your printed resume to your online profile or portfolio.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={isQrEnabled}
            onClick={() => {
              const nextEnabled = !isQrEnabled;
              updateSection("qrCode", {
                ...qr,
                enabled: nextEnabled,
                type: qr.type || "portfolio",
                size: qr.size || "small",
                subtitle: qr.subtitle || getDefaultSubtitle(qr.type || "portfolio"),
                showSubtitle: qr.showSubtitle !== false,
              });
            }}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 mt-0.5 sm:mt-0 ${
              isQrEnabled ? "bg-purple-600" : "bg-slate-200"
            }`}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                isQrEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Expanded Options when Enabled */}
        {isQrEnabled && (
          <div className="pt-3 border-t border-slate-100 space-y-4 animate-in fade-in duration-150">
            {/* 1. Target Destination Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Destination Link
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DESTINATIONS.map((dest) => {
                  const isSelected = (qr.type || "portfolio") === dest.id;
                  const Icon = dest.icon;
                  return (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => {
                        const newType = dest.id;
                        const newSubtitle = getDefaultSubtitle(newType);
                        updateSection("qrCode", {
                          ...qr,
                          type: newType,
                          subtitle: qr.subtitle || newSubtitle,
                        });
                      }}
                      className={`group flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-purple-50 text-purple-900 border-purple-500 ring-1 ring-purple-500/20 shadow-xs"
                          : "bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-purple-600 text-white shadow-2xs"
                            : "bg-slate-100 text-slate-600 group-hover:bg-slate-200 group-hover:text-slate-900"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                      </div>
                      <span className="tracking-tight">{dest.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resolved URL Preview or Custom Input */}
            {qr.type === "custom" ? (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Custom Target URL</label>
                <input
                  type="url"
                  value={qr.customUrl || ""}
                  onChange={({ target }) =>
                    updateSection("qrCode", {
                      ...qr,
                      customUrl: target.value,
                    })
                  }
                  placeholder="https://behance.net/yourprofile"
                  className="studio-input"
                />
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <LuLink className="text-slate-400 shrink-0" />
                  <span className="font-mono text-[11px] text-slate-700 truncate">
                    {resolvedTargetUrl || (
                      <span className="text-amber-600 font-sans italic">
                        No link detected yet. Please add a website or profile link.
                      </span>
                    )}
                  </span>
                </div>
                {resolvedTargetUrl && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                    Active
                  </span>
                )}
              </div>
            )}

            {/* 2. QR Code Size */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Footprint Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "small", label: "Discreet", sub: "18mm (Compact)" },
                  { id: "medium", label: "Standard", sub: "22mm (Balanced)" },
                  { id: "large", label: "Prominent", sub: "26mm (Large)" },
                ].map((s) => {
                  const isSelected = (qr.size || "small") === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => updateSection("qrCode", { ...qr, size: s.id })}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-purple-50 text-purple-900 border-purple-500 ring-1 ring-purple-500/20 shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="text-xs font-bold">{s.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{s.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Subtitle Customization */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Scan Subtitle
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={qr.showSubtitle !== false}
                    onChange={(e) =>
                      updateSection("qrCode", {
                        ...qr,
                        showSubtitle: e.target.checked,
                      })
                    }
                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-xs text-slate-600">Show Subtitle</span>
                </label>
              </div>

              {qr.showSubtitle !== false && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={qr.subtitle || ""}
                    onChange={({ target }) =>
                      updateSection("qrCode", {
                        ...qr,
                        subtitle: target.value,
                      })
                    }
                    placeholder="e.g. Scan for Portfolio"
                    className="studio-input"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Scan for Portfolio",
                      "Scan for LinkedIn",
                      "Scan to Connect",
                      "Scan for Work Samples",
                    ].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() =>
                          updateSection("qrCode", {
                            ...qr,
                            subtitle: s,
                          })
                        }
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                          qr.subtitle === s
                            ? "bg-purple-50 text-purple-900 border-purple-300 font-bold"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Live In-Form Scan Tester */}
            {resolvedTargetUrl && (
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 flex flex-col sm:flex-row items-center gap-4">
                <div className="shrink-0 bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex items-center justify-center">
                  <ResumeQrCode
                    qrCode={qr}
                    basics={profileData}
                    profiles={profiles}
                  />
                </div>
                <div className="text-xs text-slate-600 space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 font-bold text-slate-900">
                    <LuSmartphone className="text-purple-600 text-sm" />
                    <span>Live Camera Test</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Point your mobile camera at this QR code to verify it opens your link before downloading or printing.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoForm;