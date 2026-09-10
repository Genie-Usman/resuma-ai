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
  maxWidth = '32rem',
  maxHeight,
  isPrint = false,
  noPadding = false,
  onActionClick = () => { },
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative mx-auto bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] border border-slate-100 flex flex-col overflow-hidden w-full transition-all"
        style={{
          width,
          height,
          maxWidth,
          maxHeight,
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        {!hideCloseBtn && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-xl cursor-pointer z-50 transition-colors"
            aria-label="Close dialog"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
              className="w-3.5 h-3.5"
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
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-white z-10">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
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
        <div className={`flex-1 overflow-auto ${isPrint || noPadding ? 'p-0 bg-white' : 'p-6 bg-white'} custom-scrollbar`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
