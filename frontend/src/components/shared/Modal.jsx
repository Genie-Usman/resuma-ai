import React from 'react';

const Modal = ({
  children,
  isOpen,
  onClose,
  title,
  hideHeader = false,
  hideCloseBtn = false,
  showActionBtn = false,
  actionBtnIcon = null,
  actionBtnText = '',
  width,
  height,
  maxWidth,
  maxHeight,
  isPrint = false,
  noPadding = false,
  onActionClick = () => { },
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-2 sm:p-4">
      <div
        className="relative mx-auto bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden w-full"
        style={{
          width,
          height,
          maxWidth,
          maxHeight,
        }}
      >

        {/* Close Button */}
        {!hideCloseBtn && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-xl cursor-pointer z-50 transition-colors"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
              className="w-4 h-4"
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
        )}

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
        <div className={`flex-1 overflow-auto ${isPrint || noPadding ? 'p-0 bg-white' : 'px-6 py-4 bg-gray-50'} custom-scrollbar`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
