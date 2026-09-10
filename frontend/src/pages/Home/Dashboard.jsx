import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuCirclePlus } from "react-icons/lu";
import moment from "moment";
import toast from "react-hot-toast";

// Utils
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

// Components
import DashboardLayout from "../../components/layouts/DashboardLayout";
import ResumeSummaryCard from "../../components/Cards/ResumeSummaryCard";
import CreateResumeForm from "./CreateResumeForm";
import Modal from "../../components/shared/Modal";

const Dashboard = () => {
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [allResumes, setAllResumes] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Delete Resume Handler
  const handleDeleteResume = async (resumeId, title) => {
    const confirm = window.confirm(`Are you sure you want to delete "${title || "this resume"}"?`);
    if (!confirm) return;

    try {
      await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeId));
      toast.success("Resume deleted");
      fetchAllResumes();
    } catch (error) {
      console.error("Failed to delete resume:", error);
      toast.error(error.response?.data?.message || "Failed to delete resume");
    }
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-1 pb-6 px-4 md:px-0">
        {/* New Resume Card */}
        <div
          className="relative w-full max-w-[240px] aspect-[2/3] flex items-center justify-center bg-white rounded-lg border-2 border-dashed border-purple-200 hover:border-purple-400 hover:bg-purple-50/40 cursor-pointer group transition-all duration-300 mx-auto md:mx-0 shadow-sm"
          onClick={() => setOpenCreateModal(true)}
        >
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-2xl group-hover:bg-purple-200 transition-colors">
              <LuCirclePlus className="text-2xl text-purple-600 group-hover:rotate-90 transition-transform duration-300" />
            </div>
            <h3 className="text-sm font-bold text-gray-700 group-hover:text-purple-700">
              Add New Resume
            </h3>
          </div>
        </div>

        {/* All Resumes */}
        {allResumes?.map((resume) => (
          <ResumeSummaryCard
            key={resume?._id}
            imgUrl={resume?.thumbnailLink || null}
            title={resume?.title}
            lastUpdated={
              resume?.updatedAt ? moment(resume.updatedAt).format("DD MMM YYYY") : ""
            }
            onSelect={() => navigate(`/resume/${resume._id}`)}
            onDuplicate={() => handleDuplicateResume(resume._id)}
            onDelete={() => handleDeleteResume(resume._id, resume.title)}
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
    </DashboardLayout>
  );
};

export default Dashboard;
