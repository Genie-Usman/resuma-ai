import React from 'react';

const TemplateCard = ({ name, thumbnail, isSelected, onSelect }) => {
    return (
        <div
            className={`relative h-auto md:h-[300px] flex flex-col items-center justify-between bg-white rounded-lg border border-gray-200 hover:border-purple-300 overflow-hidden cursor-pointer transition-all duration-150 ${isSelected ? 'border-purple-500 border-2' : ''
                } group`}
            onClick={onSelect}
        >
            {thumbnail ? (
                <img src={thumbnail} alt={name} className="w-full rounded object-cover" />
            ) : (
                <div className="flex-1 w-full bg-gray-100" />
            )}

            {/*Hover Tooltip */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 capitalize font-semibold bg-white px-2 py-1 rounded text-sm text-gray-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                {name}
            </div>
        </div>
    );
};

export default TemplateCard;
