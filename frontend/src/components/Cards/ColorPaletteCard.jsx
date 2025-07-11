import React from 'react';

const ColorPaletteCard = ({ name, colors, isSelected, onSelect }) => {
    return (
        <div
            onClick={onSelect}
            className={`relative h-24 w-full cursor-pointer rounded-lg border-2 shadow-sm flex overflow-hidden transition-all duration-200 ${isSelected ? 'border-purple-500' : 'border-transparent hover:border-gray-300'
                } group`}
        >
            {/* Color Bars */}
            {colors.map((color, index) => (
                <div
                    key={`color_${index}`}
                    style={{ backgroundColor: color }}
                    className="flex-1"
                />
            ))}

            {/* Hover Tooltip */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 capitalize font-semibold bg-white px-2 py-1 rounded text-xs text-gray-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                {name}
            </div>
        </div>
    );
};

export default ColorPaletteCard;
