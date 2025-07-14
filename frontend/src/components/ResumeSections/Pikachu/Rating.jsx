import { FaStar } from 'react-icons/fa';

const Rating = ({ level, themeColors }) => {
    const normalized = Math.round((level / 100) * 5);

    return (
        <div className="flex items-center gap-x-1.5">
            {Array.from({ length: 5 }).map((_, index) => {
                const isActive = normalized > index;
                return (
                    <FaStar
                        key={index}
                        style={{
                            color: isActive ? themeColors[2] : `${themeColors[1]}66`, // 66 = ~40% opacity
                            fontSize: "1rem"
                        }}
                    />
                );
            })}
        </div>
    );
};

export default Rating;