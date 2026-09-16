import { hexToRgba, linearTransform } from '../../../utils/helper';
import { normalizeRatingLevel } from '../../../utils/ratingUtils';

const Rating = ({ level, themeColors }) => {
    const normalized = normalizeRatingLevel(level);
    if (!normalized) return null;

    return (
        <div className="relative">
            <div className="h-2.5 w-full rounded-sm" style={{ backgroundColor: hexToRgba(themeColors[2], 0.4) }} />
            <div
                className="absolute inset-y-0 left-0 h-2.5 w-full rounded-sm"
                style={{
                    width: `${linearTransform(normalized, 0, 5, 0, 100)}%`,
                    backgroundColor: themeColors[2]
                }}
            />
        </div>
    );
};

export default Rating;