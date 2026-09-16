import { FaStar } from 'react-icons/fa';
import { normalizeRatingLevel } from '../../../utils/ratingUtils';

const Rating = ({ level, themeColors }) => {
    const normalized = normalizeRatingLevel(level);
    if (!normalized) return null;

    return (
        <div className="flex items-center gap-x-1.5">
            {Array.from({ length: 5 }).map((_, index) => {
                const isActive = normalized > index;
                return (
                    <FaStar
                        key={index}
                        style={{
                            color: isActive ? themeColors[2] : `${themeColors[1]}66`,
                            fontSize: "1rem"
                        }}
                    />
                );
            })}
        </div>
    );
};

export default Rating;