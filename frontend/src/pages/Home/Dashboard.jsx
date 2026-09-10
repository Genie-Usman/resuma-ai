import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LuCirclePlus, LuUpload, LuFileCode2 } from "react-icons/lu";
import moment from "moment";
import toast from "react-hot-toast";

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

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedShareResume, setSelectedShareResume] = useState(null);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [allResumes, setAllResumes] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);

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
    document.title = "Dashboard - Resuma AI";
    fetchAllResumes();
  }, []);

  // Duplicate Resume Handler
  const handleDuplicateResume = async (resumeId) => {
    try {
      toast.loading("Duplicating resume...", { id: "duplicate-toast" });
      const response = await axiosInstance.post(API_PATHS.RESUME.DUPLICATE(resumeId));
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
      toast.loading("Importing JSON Resume...", { id: "import-toast" });

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
        err.message || "Failed to parse JSON Resume. Ensure it adheres to the standard schema.",
        { id: "import-toast" }
      );
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <DashboardLayout>
      {/* Hidden file input for JSON Resume import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-1 pb-6 px-4 md:px-0">
        {/* New Resume Card */}
        <div
          className="relative w-full max-w-[240px] aspect-[2/3] flex items-center justify-center bg-white rounded-lg border-2 border-dashed border-purple-200 hover:border-purple-400 hover:bg-purple-50/40 cursor-pointer group transition-all duration-300 mx-auto md:mx-0 shadow-sm"
          onClick={() => setOpenCreateModal(true)}
        >
          <div className="relative z-10 flex flex-col items-center gap-3 text-center p-3">
            <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-2xl group-hover:bg-purple-200 transition-colors">
              <LuCirclePlus className="text-2xl text-purple-600 group-hover:rotate-90 transition-transform duration-300" />
            </div>
            <h3 className="text-sm font-bold text-gray-700 group-hover:text-purple-700">
              Create New Resume
            </h3>
            <p className="text-[11px] text-gray-400">Start from a modern template</p>
          </div>
        </div>

        {/* Import JSON Resume Card */}
        <div
          className="relative w-full max-w-[240px] aspect-[2/3] flex items-center justify-center bg-white rounded-lg border-2 border-dashed border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/40 cursor-pointer group transition-all duration-300 mx-auto md:mx-0 shadow-sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="relative z-10 flex flex-col items-center gap-3 text-center p-3">
            <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 rounded-2xl group-hover:bg-indigo-200 transition-colors">
              <LuUpload className="text-2xl text-indigo-600 group-hover:-translate-y-1 transition-transform duration-300" />
            </div>
            <h3 className="text-sm font-bold text-gray-700 group-hover:text-indigo-700">
              Import JSON Resume
            </h3>
            <p className="text-[11px] text-gray-400">Upload standard .json schema</p>
          </div>
        </div>

        {/* All Resumes */}
        {allResumes?.map((resume) => (
          <ResumeSummaryCard
            key={resume?._id}
            imgUrl={resume?.thumbnailLink || null}
            title={resume?.title}
            viewsCount={resume?.viewsCount || 0}
            lastUpdated={
              resume?.updatedAt ? moment(resume.updatedAt).format("DD MMM YYYY") : ""
            }
            onSelect={() => navigate(`/resume/${resume._id}`)}
            onDuplicate={() => handleDuplicateResume(resume._id)}
            onDelete={() => handleDeleteResume(resume._id, resume.title)}
            onShare={() => setSelectedShareResume(resume)}
          />
        ))}
      </div>

      <Modal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        hideHeader
      >
        <div>
          <CreateResumeForm />
        </div>
      </Modal>

      {/* Share & Recruiter Analytics Modal */}
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

