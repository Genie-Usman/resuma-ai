import React from 'react';

const Modal = ({
  children,
  isOpen,
  onClose,
  title,
  hideHeader = false,
  showActionBtn = false,
  actionBtnIcon = null,
  actionBtnText = '',
  onActionClick = () => {},
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="relative w-full max-w-xl mx-auto bg-white rounded-lg shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 cursor-pointer"
        >
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
            className="w-5 h-5"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1l6 6m0 0l6-6m-6 6l6 6m-6-6l-6 6"
            />
          </svg>
        </button>

        {/* Modal Header */}
        {!hideHeader && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            {showActionBtn && (
              <button
                onClick={onActionClick}
                className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:underline"
              >
                {actionBtnIcon}
                {actionBtnText}
              </button>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
