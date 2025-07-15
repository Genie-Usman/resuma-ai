import { useState } from 'react';

const ResumeSummaryCard = ({ imgUrl, title, lastUpdated, onSelect }) => {
  const [bgColor, setBgColor] = useState('#FFFFFF');

  return (
    <div
      className="relative group w-full max-w-[240px] bg-white rounded-lg border border-gray-200 hover:border-purple-300 overflow-hidden cursor-pointer mx-auto md:mx-0"
      style={{ backgroundColor: bgColor }}
      onClick={onSelect}
    >
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
