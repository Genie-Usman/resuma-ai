import { useState } from "react"
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";


const CreateResumeForm = () => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Handle Create Resume
  const handleCreateResume = async (e) => {
    e.preventDefault();

    if (!title) {
      setError("Please enter a title for your resume.");
      return;
    }

    setError("")

    // Resume Api Call
    try {
      const response = await axiosInstance.post(API_PATHS.RESUME.CREATE, {
        title,
      });
      
      if(response.data?._id){
        navigate(`/resume/${response.data._id}`);
      }

    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred while creating the resume. Please try again.");
      }
    }
  }

  return (
    <div className="w-[90vw] md:w-[70vw] max-w-lg p-6 md:p-8 mx-auto flex flex-col justify-center">
  <h3 className="text-xl font-semibold text-black">Create New Resume</h3>
  <p className="text-sm text-slate-700 mt-1.5 mb-4">
    Give your resume a title to get started. You can edit all details later.
  </p>

  {/* Form */}
  <form onSubmit={handleCreateResume} className="flex flex-col gap-4">
    <div className="flex flex-col">
      <label className="mb-1 font-semibold text-sm">Resume Title</label>
      <input
        type="text"
        value={title}
        onChange={({ target }) => setTitle(target.value)}
        placeholder="Eg: Usman's Resume"
        className="border border-gray-300 rounded px-3 py-2 w-full"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>

    <button
      type="submit"
      className="btn-primary"
    >
      Create Resume
    </button>
  </form>
</div>

  )
}

export default CreateResumeForm
