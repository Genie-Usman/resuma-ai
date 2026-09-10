import { useState } from 'react';
import { LuCopy, LuPencil, LuTrash2 } from 'react-icons/lu';

const ResumeSummaryCard = ({ imgUrl, title, lastUpdated, onSelect, onDuplicate, onDelete }) => {
  const [bgColor, setBgColor] = useState('#FFFFFF');

  return (
    <div
      className="relative group w-full max-w-[240px] bg-white rounded-lg border border-gray-200 hover:border-purple-300 overflow-hidden cursor-pointer mx-auto md:mx-0 shadow-sm hover:shadow-md transition-all"
      style={{ backgroundColor: bgColor }}
      onClick={onSelect}
    >
      {/* Action Buttons (Visible on hover) */}
      <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate?.();
          }}
          className="p-1.5 bg-white/95 hover:bg-purple-600 hover:text-white text-gray-700 rounded-md shadow transition-colors"
          title="Duplicate Resume"
        >
          <LuCopy className="text-sm" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.();
          }}
          className="p-1.5 bg-white/95 hover:bg-purple-600 hover:text-white text-gray-700 rounded-md shadow transition-colors"
          title="Edit Resume"
        >
          <LuPencil className="text-sm" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="p-1.5 bg-white/95 hover:bg-red-600 hover:text-white text-red-600 rounded-md shadow transition-colors"
          title="Delete Resume"
        >
          <LuTrash2 className="text-sm" />
        </button>
      </div>

      {/* Image wrapper with aspect ratio */}
      <div className="relative w-full aspect-[2/3]">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-contain rounded"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-100 rounded" />
        )}

        {/* Overlay info on hover */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 rounded group">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500 to-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded" />
          {/* Text content */}
          <div className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h5 className="text-base font-bold shadow-sm text-black truncate">{title}</h5>
            <p className="text-sm font-semibold shadow-sm text-black mt-1">Last Updated: {lastUpdated}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeSummaryCard;
