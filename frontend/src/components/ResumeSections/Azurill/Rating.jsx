import { linearTransform } from '../../../utils/helper';

const Rating = ({ level, themeColors }) => {
    const percentage = Math.min(100, Math.max(0, (level / 5) * 100));
    return (
        <div className="relative h-1 w-[128px] group-[.sidebar]:mx-auto">
            <div className="absolute inset-0 h-1 w-[128px] rounded opacity-25" style={{backgroundColor: themeColors[2], opacity: 0.25}}/>
            <div
                className="absolute inset-0 h-1 rounded overflow-hidden"
                style={{ width: `${percentage}%`, backgroundColor: themeColors[2] }}
            />
        </div>
    );
};

export default Rating;
