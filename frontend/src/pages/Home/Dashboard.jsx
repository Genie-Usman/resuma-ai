import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuCirclePlus } from "react-icons/lu";
import moment from "moment"

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

  const fetchAllResumes = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL);
      setAllResumes(response.data)
    } catch (error) {
      console.error('Error fetching Resumes: ', error);
    }
  }

  useEffect(() => {
    fetchAllResumes();
  }, [])

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-5 md:gap-7 2xl:gap-0 pt-1 pb-6 px-4 md:px-0 gap-4">

        {/* New Resume */}
        <div
          className="relative w-full max-w-[240px] aspect-[2/3] flex items-center justify-center bg-white rounded-lg border border-purple-100 hover:border-purple-300 hover:bg-purple-50/40 cursor-pointer group transition-all duration-300 mx-auto md:mx-0"
          onClick={() => setOpenCreateModal(true)}
        >
          {/* Hover background overlay (optional) */}
          <div className="absolute inset-0 bg-purple-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />

          {/* Icon and text */}
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-purple-200/60 rounded-2xl">
              <LuCirclePlus className="text-2xl text-purple-500 group-hover:rotate-90 transition-transform duration-300" />
            </div>
            <h3 className="text-sm font-bold text-gray-700">Add New Resume</h3>
          </div>
        </div>

        {/* All Resumes */}
        {allResumes?.map((resume) => {
          return (
            <ResumeSummaryCard
              key={resume?._id}
              imgUrl={resume?.thumbnailLink || null}
              title={resume?.title}
              lastUpdated={
                resume?.updatedAt ? moment(resume.updatedAt).format("DD MMM YYYY") : ""
              }
              onSelect={() => navigate(`/resume/${resume._id}`)}
            />
          );
        })}

      </div>

      <Modal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        hideHeader
      >
        <div className="">
          <CreateResumeForm />
        </div>
      </Modal>

    </DashboardLayout>
  )
}

export default Dashboard
