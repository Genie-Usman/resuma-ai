import { useState } from "react";
import {
  LuShare2,
  LuCopy,
  LuCheck,
  LuExternalLink,
  LuEye,
  LuClock,
  LuFileCode2,
} from "react-icons/lu";
import toast from "react-hot-toast";
import moment from "moment";
import Modal from "../../../components/shared/Modal.jsx";
import { exportToJsonResume } from "../../../utils/jsonResumeAdapter";

const ShareModal = ({ isOpen, onClose, resume }) => {
  const [copied, setCopied] = useState(false);

  if (!resume) return null;

  const publicSlug = resume.slug || resume._id;
  const publicUrl = `${window.location.origin}/view/${publicSlug}`;
  const viewsCount = resume.viewsCount || 0;
  const lastViewedAt = resume.lastViewedAt;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    toast.success("Public link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
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
      title="Share Resume"
      width="540px"
    >
      <div className="flex flex-col gap-5 p-2 text-gray-800">
        {/* Header Icon & Intro */}
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700 shadow-xs">
            <LuShare2 className="text-xl" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Public Resume Link
            </h3>
            <p className="text-xs text-gray-500">
              Anyone with this link can view your resume without logging in.
            </p>
          </div>
        </div>

        {/* Public Share Link Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">
            Public Share URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={publicUrl}
              className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-mono select-all focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-xs cursor-pointer"
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
              className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg border border-gray-200 transition-colors"
              title="Open public view in new tab"
            >
              <LuExternalLink className="text-sm" />
            </a>
          </div>
        </div>

        {/* Recruiter View Tracking Analytics */}
        <div className="grid grid-cols-2 gap-3 p-3.5 bg-purple-50/70 border border-purple-100 rounded-xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white rounded-lg text-purple-700 shadow-2xs">
              <LuEye className="text-base" />
            </div>
            <div>
              <span className="block text-[11px] text-gray-500 font-medium">
                Total Views
              </span>
              <span className="text-base font-bold text-gray-900">
                {viewsCount} {viewsCount === 1 ? "view" : "views"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white rounded-lg text-purple-700 shadow-2xs">
              <LuClock className="text-base" />
            </div>
            <div>
              <span className="block text-[11px] text-gray-500 font-medium">
                Last Viewed
              </span>
              <span className="text-xs font-bold text-gray-900 line-clamp-1">
                {lastViewedAt ? moment(lastViewedAt).fromNow() : "Not viewed yet"}
              </span>
            </div>
          </div>
        </div>

        {/* JSON Resume Ecosystem Export */}
        <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white rounded-lg text-gray-700 border border-gray-200 shadow-2xs">
              <LuFileCode2 className="text-base text-purple-600" />
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-900">
                Download JSON Data
              </span>
              <span className="block text-[11px] text-gray-500">
                Save your resume information in standard JSON format
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <span>Export JSON</span>
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
