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
  width,
  height,
  maxWidth,
  maxHeight,
  isPrint = false,
  onActionClick = () => { },
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div
        className="relative mx-auto bg-white rounded-lg shadow-xl flex flex-col overflow-hidden"
        style={{
          width,
          height,
          maxWidth,
          maxHeight,
        }}
      >

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-4 text-gray-500 hover:text-gray-800 cursor-pointer z-50"
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
          <div className="flex items-center justify-between px-6 py-4 mr-10 border-b border-gray-200 bg-white z-10">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            {showActionBtn && (
              <button
                onClick={onActionClick}
                className="btn-small-light"
              >
                {actionBtnIcon}
                {actionBtnText}
              </button>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className={`flex-1 overflow-auto ${isPrint ? 'px-0' : 'px-6'} py-4 custom-scrollbar bg-gray-50`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
