import { useState, useEffect } from "react";
import {
  LuShare2,
  LuCopy,
  LuCheck,
  LuExternalLink,
  LuEye,
  LuClock,
  LuFileCode2,
  LuLock,
  LuLockOpen,
  LuKeyRound,
  LuShieldCheck,
  LuChartNoAxesCombined,
  LuGlobe,
  LuRadio,
  LuPencil,
  LuRotateCcw,
  LuLaptop,
  LuSmartphone,
  LuTablet,
} from "react-icons/lu";
import toast from "react-hot-toast";
import moment from "moment";
import Modal from "../../../components/shared/Modal.jsx";
import { exportToJsonResume } from "../../../utils/jsonResumeAdapter";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";

const ShareModal = ({ isOpen, onClose, resume, onUpdateResume }) => {
  const [activeTab, setActiveTab] = useState("link"); // "link" | "analytics"
  const [copied, setCopied] = useState(false);

  // Custom Slug state
  const resumeId = resume?._id;
  const initialSlug = resume?.slug || resume?._id || "";
  const [currentSlug, setCurrentSlug] = useState(initialSlug);
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [slugInput, setSlugInput] = useState(initialSlug);
  const [isSavingSlug, setIsSavingSlug] = useState(false);
  const [slugError, setSlugError] = useState("");

  // Protection state
  const [isProtected, setIsProtected] = useState(
    Boolean(resume?.protection?.isProtected)
  );
  const [hasPassword, setHasPassword] = useState(
    Boolean(resume?.protection?.hasPassword || resume?.protection?.passwordHash)
  );
  const [passwordInput, setPasswordInput] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isSavingProtection, setIsSavingProtection] = useState(false);

  // Analytics state
  const [analytics, setAnalytics] = useState(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  useEffect(() => {
    if (resume) {
      const s = resume.slug || resume._id || "";
      setCurrentSlug(s);
      setSlugInput(s);
      setIsProtected(Boolean(resume.protection?.isProtected));
      setHasPassword(
        Boolean(resume.protection?.hasPassword || resume.protection?.passwordHash)
      );
    }
  }, [resume]);

  // Load analytics when opening Analytics tab
  useEffect(() => {
    if (isOpen && activeTab === "analytics" && resumeId) {
      const fetchAnalytics = async () => {
        try {
          setIsLoadingAnalytics(true);
          const response = await axiosInstance.get(
            API_PATHS.RESUME.GET_ANALYTICS(resumeId)
          );
          setAnalytics(response.data);
          if (response.data.protection) {
            setIsProtected(response.data.protection.isProtected);
            setHasPassword(response.data.protection.hasPassword);
          }
        } catch (err) {
          console.error("Fetch analytics error:", err);
        } finally {
          setIsLoadingAnalytics(false);
        }
      };
      fetchAnalytics();
    }
  }, [isOpen, activeTab, resumeId]);

  if (!resume) return null;

  const publicUrl = `${window.location.origin}/p/${currentSlug}`;
  const viewsCount = analytics?.viewsCount ?? (resume.viewsCount || 0);
  const lastViewedAt = analytics?.lastViewedAt ?? resume.lastViewedAt;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("Public link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveSlug = async (e) => {
    e.preventDefault();
    if (!slugInput.trim()) {
      setSlugError("Please enter a custom slug.");
      return;
    }

    setIsSavingSlug(true);
    setSlugError("");

    try {
      const response = await axiosInstance.put(
        API_PATHS.RESUME.UPDATE_SLUG(resumeId),
        { slug: slugInput.trim() }
      );

      const newSlug = response.data.slug;
      setCurrentSlug(newSlug);
      setSlugInput(newSlug);
      setIsEditingSlug(false);
      toast.success("Custom public URL updated successfully!");

      if (onUpdateResume) {
        onUpdateResume({ ...resume, slug: newSlug });
      }
    } catch (err) {
      console.error("Save slug error:", err);
      setSlugError(
        err.response?.data?.message || "Failed to update custom URL slug."
      );
    } finally {
      setIsSavingSlug(false);
    }
  };

  const handleToggleProtection = async (enable, pass = "") => {
    const passwordToUse = pass || passwordInput.trim();
    if (enable && !hasPassword && !passwordToUse) {
      setShowPasswordForm(true);
      return;
    }

    setIsSavingProtection(true);
    try {
      const response = await axiosInstance.put(
        API_PATHS.RESUME.UPDATE_PROTECTION(resumeId),
        {
          isProtected: enable,
          protectType: "contact_only",
          password: passwordToUse || undefined,
        }
      );

      setIsProtected(response.data.protection.isProtected);
      setHasPassword(response.data.protection.hasPassword);
      setShowPasswordForm(false);
      setPasswordInput("");

      toast.success(
        enable
          ? "Password protection enabled for sensitive contact info."
          : "Password protection disabled."
      );

      if (onUpdateResume) {
        onUpdateResume({
          ...resume,
          protection: response.data.protection,
        });
      }
    } catch (err) {
      console.error("Toggle protection error:", err);
      toast.error(
        err.response?.data?.message || "Failed to update protection settings."
      );
    } finally {
      setIsSavingProtection(false);
    }
  };

  const handleExportJson = () => {
    try {
      exportToJsonResume(resume, resume.title);
      toast.success("Exported standard JSON Resume file!");
    } catch (err) {
      console.error("JSON Resume export error:", err);
      toast.error("Failed to export JSON Resume.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share & Recruiter Insights"
      width="600px"
    >
      <div className="flex flex-col gap-4 text-gray-800">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("link")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "link"
                ? "bg-white text-purple-700 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <LuShare2 className="text-sm" />
            <span>Public Link & Security</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("analytics")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "analytics"
                ? "bg-white text-purple-700 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <LuChartNoAxesCombined className="text-sm" />
            <span>Recruiter Analytics</span>
            {viewsCount > 0 && (
              <span className="px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded-full text-[10px] font-extrabold ml-1">
                {viewsCount}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: Public Link & Security */}
        {activeTab === "link" && (
          <div className="flex flex-col gap-4">
            {/* Public Portfolio URL Card */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700">
                  Public Web Portfolio Link
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingSlug(!isEditingSlug);
                    setSlugError("");
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-600 hover:text-purple-800 cursor-pointer"
                >
                  <LuPencil className="text-[10px]" />
                  <span>{isEditingSlug ? "Cancel Edit" : "Customize URL"}</span>
                </button>
              </div>

              {!isEditingSlug ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={publicUrl}
                    className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-mono select-all focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors shadow-xs cursor-pointer"
                  >
                    {copied ? (
                      <LuCheck className="text-sm text-white" />
                    ) : (
                      <LuCopy className="text-sm" />
                    )}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl border border-gray-200 transition-colors"
                    title="Open public portfolio view in new tab"
                  >
                    <LuExternalLink className="text-sm" />
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSaveSlug} className="flex flex-col gap-2">
                  <div className="flex items-center bg-white border border-gray-300 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-purple-500">
                    <span className="text-xs font-mono text-gray-400 select-none">
                      {window.location.host}/p/
                    </span>
                    <input
                      type="text"
                      autoFocus
                      value={slugInput}
                      onChange={(e) => {
                        setSlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "-"));
                        setSlugError("");
                      }}
                      className="flex-1 text-xs font-mono font-bold text-gray-800 bg-transparent focus:outline-none"
                      placeholder="custom-slug"
                    />
                  </div>
                  {slugError && (
                    <p className="text-[11px] font-semibold text-rose-600">
                      {slugError}
                    </p>
                  )}
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingSlug(false);
                        setSlugInput(currentSlug);
                        setSlugError("");
                      }}
                      className="px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingSlug}
                      className="px-3.5 py-1 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {isSavingSlug ? "Saving..." : "Save Custom URL"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Password Protection for Sensitive Info */}
            <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-2xl flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-white text-amber-700 shadow-2xs">
                    {isProtected ? (
                      <LuLock className="text-base text-amber-600" />
                    ) : (
                      <LuLockOpen className="text-base text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">
                        Password-Protect Contact Details
                      </span>
                      {isProtected && !showPasswordForm && (
                        <button
                          type="button"
                          onClick={() => setShowPasswordForm(true)}
                          className="text-[10px] font-bold text-amber-700 hover:text-amber-900 underline cursor-pointer"
                        >
                          Change PIN
                        </button>
                      )}
                    </div>
                    <span className="block text-[11px] text-gray-500">
                      Hide email & phone from scrapers; recruiters unlock with your PIN.
                    </span>
                  </div>
                </div>

                {/* Switch / Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    if (isProtected) {
                      handleToggleProtection(false);
                    } else if (hasPassword) {
                      handleToggleProtection(true);
                    } else {
                      setShowPasswordForm(true);
                    }
                  }}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isProtected ? "bg-amber-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      isProtected ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Password Setup Form */}
              {showPasswordForm && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (passwordInput.trim()) {
                      handleToggleProtection(true, passwordInput.trim());
                    }
                  }}
                  className="mt-2 pt-2 border-t border-amber-200/60 flex flex-col gap-2 animate-fadeIn"
                >
                  <label className="text-[11px] font-bold text-amber-900">
                    Set Recruiter Access PIN / Password
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 1234 or SecretKey"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-xl font-mono text-gray-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      type="submit"
                      disabled={isSavingProtection || !passwordInput.trim()}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {isSavingProtection ? "Saving..." : "Lock Contact Info"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordInput("");
                      }}
                      className="px-2.5 py-1.5 text-xs text-gray-500 hover:bg-amber-100 rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* JSON Resume Ecosystem Export */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white rounded-xl text-purple-600 border border-gray-200 shadow-2xs">
                  <LuFileCode2 className="text-base" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-900">
                    Standard JSON Resume Data
                  </span>
                  <span className="block text-[11px] text-gray-500">
                    Standard open-source resume schema export
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleExportJson}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl shadow-2xs transition-colors cursor-pointer"
              >
                <span>Export JSON</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Recruiter Analytics */}
        {activeTab === "analytics" && (
          <div className="flex flex-col gap-4">
            {isLoadingAnalytics ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="animate-spin size-7 border-3 border-purple-600 border-t-transparent rounded-full mb-3" />
                <p className="text-xs text-gray-500">Aggregating visitor metrics...</p>
              </div>
            ) : (
              <>
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-2xl">
                    <div className="flex items-center gap-2 text-purple-700 mb-1">
                      <LuEye className="text-sm" />
                      <span className="text-[11px] font-bold">Total Views</span>
                    </div>
                    <p className="text-xl font-extrabold text-gray-900">
                      {viewsCount}
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl">
                    <div className="flex items-center gap-2 text-blue-700 mb-1">
                      <LuGlobe className="text-sm" />
                      <span className="text-[11px] font-bold">Countries</span>
                    </div>
                    <p className="text-xl font-extrabold text-gray-900">
                      {analytics?.countries?.length || (viewsCount > 0 ? 1 : 0)}
                    </p>
                  </div>

                  <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl col-span-2 sm:col-span-1">
                    <div className="flex items-center gap-2 text-indigo-700 mb-1">
                      <LuClock className="text-sm" />
                      <span className="text-[11px] font-bold">Last Viewed</span>
                    </div>
                    <p className="text-xs font-bold text-gray-900 line-clamp-1 mt-1">
                      {lastViewedAt ? moment(lastViewedAt).fromNow() : "Not viewed yet"}
                    </p>
                  </div>
                </div>

                {/* Country Breakdown */}
                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                  <h4 className="text-xs font-bold text-gray-900 mb-2.5 flex items-center gap-1.5">
                    <LuGlobe className="text-purple-600 text-sm" />
                    <span>Top Visitor Countries</span>
                  </h4>
                  {analytics?.countries?.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {analytics.countries.slice(0, 4).map((c, i) => {
                        const pct = Math.round(
                          (c.count / Math.max(1, viewsCount)) * 100
                        );
                        return (
                          <div key={i} className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-gray-700">
                                {c.country} ({c.code})
                              </span>
                              <span className="text-[11px] font-bold text-gray-900">
                                {c.count} ({pct}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-purple-600 h-full rounded-full transition-all"
                                style={{ width: `${Math.min(100, Math.max(8, pct))}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">
                      No country telemetry recorded yet. Share your portfolio link to start tracking!
                    </p>
                  )}
                </div>

                {/* Referral Sources Breakdown */}
                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                  <h4 className="text-xs font-bold text-gray-900 mb-2.5 flex items-center gap-1.5">
                    <LuRadio className="text-purple-600 text-sm" />
                    <span>Referral Channels</span>
                  </h4>
                  {analytics?.referrers?.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {analytics.referrers.slice(0, 4).map((r, i) => {
                        const pct = Math.round(
                          (r.count / Math.max(1, viewsCount)) * 100
                        );
                        return (
                          <div key={i} className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-gray-700">
                                {r.source}
                              </span>
                              <span className="text-[11px] font-bold text-gray-900">
                                {r.count} ({pct}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-indigo-600 h-full rounded-full transition-all"
                                style={{ width: `${Math.min(100, Math.max(8, pct))}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">
                      No referral data yet.
                    </p>
                  )}
                </div>

                {/* Recent Views Log */}
                {analytics?.recentViews?.length > 0 && (
                  <div className="bg-white p-3 rounded-2xl border border-gray-200 max-h-40 overflow-auto custom-scrollbar">
                    <h4 className="text-xs font-bold text-gray-900 mb-2">
                      Recent Activity
                    </h4>
                    <div className="flex flex-col gap-2">
                      {analytics.recentViews.slice(0, 6).map((rv, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-[11px] text-gray-600 border-b border-gray-100 pb-1.5 last:border-none last:pb-0"
                        >
                          <div className="flex items-center gap-2">
                            {rv.device === "Mobile" ? (
                              <LuSmartphone className="text-gray-400" />
                            ) : rv.device === "Tablet" ? (
                              <LuTablet className="text-gray-400" />
                            ) : (
                              <LuLaptop className="text-gray-400" />
                            )}
                            <span className="font-semibold text-gray-800">
                              {rv.country}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span>{rv.referrer || "Direct Link"}</span>
                          </div>
                          <span className="text-gray-400">
                            {moment(rv.viewedAt).fromNow()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
