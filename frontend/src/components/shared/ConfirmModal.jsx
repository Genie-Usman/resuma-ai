import React, { useEffect } from "react";
import { LuTrash2, LuRefreshCw, LuX } from "react-icons/lu";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  isDestructive = true,
  isLoading = false,
  icon: Icon = LuTrash2,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
      onClick={() => {
        if (!isLoading) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 overflow-hidden transition-all transform scale-100"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close "X" Button */}
        {!isLoading && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <LuX className="w-4 h-4" />
          </button>
        )}

        <div className="flex flex-col items-center text-center">
          {/* Badge Icon */}
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
              isDestructive
                ? "bg-rose-50 text-rose-600 border border-rose-100 shadow-2xs shadow-rose-100"
                : "bg-purple-50 text-purple-600 border border-purple-100 shadow-2xs shadow-purple-100"
            }`}
          >
            <Icon className="w-6 h-6" />
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-sm text-slate-500 leading-relaxed max-w-xs mb-6">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 w-full">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200/90 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {cancelText}
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={onConfirm}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white transition-all shadow-xs cursor-pointer disabled:opacity-50 ${
                isDestructive
                  ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20 active:bg-rose-800"
                  : "bg-purple-600 hover:bg-purple-700 shadow-purple-600/20 active:bg-purple-800"
              }`}
            >
              {isLoading ? (
                <>
                  <LuRefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{confirmText}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
