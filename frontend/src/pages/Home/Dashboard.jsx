import { useEffect, useState, useRef, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuPlus,
  LuUpload,
  LuSearch,
  LuX,
  LuFileText,
  LuSparkles,
} from "react-icons/lu";
import moment from "moment";
import toast from "react-hot-toast";

// Context
import { UserContext } from "../../context/userContext";

// Utils
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { importFromJsonResume } from "../../utils/jsonResumeAdapter";

// Components
import DashboardLayout from "../../components/layouts/DashboardLayout";
import ResumeSummaryCard from "../../components/Cards/ResumeSummaryCard";
import CreateResumeForm from "./CreateResumeForm";
import Modal from "../../components/shared/Modal";
import ConfirmModal from "../../components/shared/ConfirmModal";
import ShareModal from "../ResumeUpdate/components/ShareModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user } = useContext(UserContext);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedShareResume, setSelectedShareResume] = useState(null);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [allResumes, setAllResumes] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const firstName = user?.name ? user.name.split(" ")[0] : "there";

  const fetchAllResumes = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL);
      setAllResumes(response.data);
    } catch (error) {
      console.error("Error fetching Resumes: ", error);
      toast.error("Failed to load resumes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = "My Resumes - Resuma AI";
    fetchAllResumes();
  }, []);

  // Filtered Resumes by search query
  const filteredResumes = useMemo(() => {
    if (!allResumes) return [];
    if (!searchQuery.trim()) return allResumes;
    return allResumes.filter((r) =>
      (r.title || "").toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [allResumes, searchQuery]);

  // Total Views summary
  const totalViews = useMemo(() => {
    if (!allResumes) return 0;
    return allResumes.reduce((sum, r) => sum + (r.viewsCount || 0), 0);
  }, [allResumes]);

  // Duplicate Resume Handler
  const handleDuplicateResume = async (resumeId) => {
    try {
      toast.loading("Duplicating resume...", { id: "duplicate-toast" });
      await axiosInstance.post(API_PATHS.RESUME.DUPLICATE(resumeId));
      toast.success("Resume duplicated successfully!", { id: "duplicate-toast" });
      fetchAllResumes();
    } catch (error) {
      console.error("Failed to duplicate resume:", error);
      toast.error(error.response?.data?.message || "Failed to duplicate resume", {
        id: "duplicate-toast",
      });
    }
  };

  // Delete Resume Trigger
  const handleDeleteResume = (resumeId, title) => {
    setResumeToDelete({ id: resumeId, title });
  };

  const handleConfirmDelete = async () => {
    if (!resumeToDelete) return;

    setIsDeleting(true);
    try {
      await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeToDelete.id));
      toast.success("Resume deleted");
      fetchAllResumes();
    } catch (error) {
      console.error("Failed to delete resume:", error);
      toast.error(error.response?.data?.message || "Failed to delete resume");
    } finally {
      setIsDeleting(false);
      setResumeToDelete(null);
    }
  };

  // Import JSON Resume Handler
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      toast.loading("Importing resume...", { id: "import-toast" });

      const text = await file.text();
      const { title, data } = importFromJsonResume(text);

      const response = await axiosInstance.post(API_PATHS.RESUME.CREATE, {
        title,
        data,
      });

      toast.success("Resume imported successfully!", { id: "import-toast" });
      navigate(`/resume/${response.data._id}`);
    } catch (err) {
      console.error("Failed to import JSON resume:", err);
      toast.error(
        err.message || "Failed to parse JSON file.",
        { id: "import-toast" }
      );
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <DashboardLayout>
      {/* Hidden file input for JSON import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="space-y-6">
        {/* 1. Dashboard Executive Header */}
        <div className="space-y-4 pb-6 border-b border-slate-200/80">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200/60">
                  Workspace
                </span>
                <span className="text-xs text-slate-300">/</span>
                <span className="text-xs text-slate-500 font-medium">
                  Welcome back, {firstName} 👋
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
                <span>My Resumes</span>
                {!isLoading && allResumes && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white shadow-2xs">
                    {allResumes.length}
                  </span>
                )}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Design, refine, and publish your professional resumes.
              </p>
            </div>

            {/* Header Controls: Search & Actions */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              {/* Search Input */}
              <div className="relative w-full sm:w-64">
                <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resumes..."
                  className="w-full pl-9 pr-8 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-800 placeholder:text-slate-400 shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <LuX className="text-xs" />
                  </button>
                )}
              </div>

              {/* Quick Import Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer shrink-0 shadow-2xs hover:shadow-xs"
                title="Import resume from JSON"
              >
                <LuUpload className="text-sm text-purple-600" />
                <span className="hidden sm:inline">Import JSON</span>
              </button>

              {/* Create Resume Primary Action */}
              <button
                type="button"
                onClick={() => setOpenCreateModal(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl shadow-md shadow-purple-500/25 hover:shadow-lg hover:shadow-purple-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer shrink-0"
              >
                <LuPlus className="text-sm" />
                <span>Create Resume</span>
              </button>
            </div>
          </div>

          {/* Metric Badges Strip */}
          <div className="flex items-center gap-2.5 overflow-x-auto pt-1 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-slate-700 font-medium shrink-0">
              <LuFileText className="text-purple-600 text-sm" />
              <span>{allResumes ? allResumes.length : 0} Resumes</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-slate-700 font-medium shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{totalViews} Total Views</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-slate-700 font-medium shrink-0">
              <LuSparkles className="text-amber-500 text-sm" />
              <span>12 Designer Templates</span>
            </div>
          </div>
        </div>

        {/* 2. Resumes Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Action Card: Create New Resume */}
          <div
            onClick={() => setOpenCreateModal(true)}
            className="group relative flex flex-col justify-between bg-gradient-to-b from-purple-50/50 via-white to-white rounded-2xl border border-purple-200/80 hover:border-purple-400 hover:shadow-[0_16px_36px_-8px_rgba(124,58,237,0.12),0_8px_16px_-4px_rgba(0,0,0,0.04)] hover:-translate-y-1.5 cursor-pointer transition-all duration-300 w-full p-6 text-left shadow-2xs aspect-[1/1.34]"
          >
            {/* Top Badge & Icon */}
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 flex items-center justify-center bg-purple-100/80 text-purple-600 rounded-2xl group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-2xs">
                <LuPlus className="text-2xl" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100/70 text-purple-700 border border-purple-200/50">
                New
              </span>
            </div>

            {/* Middle Section */}
            <div className="my-auto py-2">
              <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors tracking-tight">
                Create New Resume
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Start with a clean canvas or choose from our 12 tailored templates.
              </p>
            </div>

            {/* Bottom Section */}
            <div className="space-y-2 pt-4 border-t border-purple-100/70">
              <div className="w-full py-2.5 px-3 bg-purple-600 group-hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5">
                <LuPlus className="text-sm" />
                <span>Start New Resume</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 pt-1">
                <span>or</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="text-purple-600 hover:text-purple-700 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <LuUpload className="text-xs" />
                  <span>import JSON</span>
                </button>
              </div>
            </div>
          </div>

          {/* Loading Skeletons */}
          {isLoading &&
            Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="w-full aspect-[1/1.34] bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col justify-between animate-pulse shadow-2xs"
              >
                <div className="w-full h-3/4 bg-slate-100 rounded-xl" />
                <div className="space-y-2 pt-3">
                  <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                  <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
            ))}

          {/* Existing Resumes */}
          {!isLoading &&
            filteredResumes.map((resume) => (
              <ResumeSummaryCard
                key={resume?._id}
                imgUrl={resume?.thumbnailLink || null}
                resumeData={resume?.data}
                title={resume?.title}
                viewsCount={resume?.viewsCount || 0}
                lastUpdated={
                  resume?.updatedAt
                    ? moment(resume.updatedAt).fromNow()
                    : "Recently"
                }
                template={
                  resume?.data?.metadata?.template ||
                  resume?.data?.template ||
                  "azurill"
                }
                candidateName={
                  resume?.data?.basics?.name ||
                  resume?.data?.profileInfo?.name ||
                  resume?.title
                }
                role={
                  resume?.data?.basics?.headline ||
                  resume?.data?.profileInfo?.role ||
                  "Executive Resume"
                }
                themeColor={
                  resume?.data?.metadata?.theme?.primary ||
                  resume?.data?.theme?.accentColor ||
                  "#7c3aed"
                }
                onSelect={() => navigate(`/resume/${resume._id}`)}
                onDuplicate={() => handleDuplicateResume(resume._id)}
                onDelete={() => handleDeleteResume(resume._id, resume.title)}
                onShare={() => setSelectedShareResume(resume)}
              />
            ))}
        </div>

        {/* 3. Empty Search Results State */}
        {!isLoading && filteredResumes.length === 0 && searchQuery && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 max-w-md mx-auto my-6 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
              <LuSearch />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No resumes found
            </h3>
            <p className="text-xs text-slate-500">
              No resumes match &ldquo;{searchQuery}&rdquo;. Try another search term or clear the search.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="px-4 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

      {/* Create Resume Modal */}
      <Modal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        hideHeader
        maxWidth="500px"
        noPadding
      >
        <CreateResumeForm onClose={() => setOpenCreateModal(false)} />
      </Modal>

      {/* Share Modal */}
      <ShareModal
        isOpen={!!selectedShareResume}
        onClose={() => setSelectedShareResume(null)}
        resume={selectedShareResume}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!resumeToDelete}
        onClose={() => !isDeleting && setResumeToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Resume"
        message={`Are you sure you want to delete "${resumeToDelete?.title || "this resume"}"? This action cannot be undone.`}
        confirmText="Delete Resume"
        cancelText="Cancel"
        isLoading={isDeleting}
        isDestructive={true}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
