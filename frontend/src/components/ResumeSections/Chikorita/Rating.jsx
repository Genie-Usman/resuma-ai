const Rating = ({ level, themeColors }) => {
    const normalized = Math.round((level / 100) * 5);

    return (
        <div className="flex items-center gap-x-1.5">
            {Array.from({ length: 5 }).map((_, index) => {
                const isActive = normalized > index;
                return (
                    <div
                        key={index}
                        style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '9999px',
                            border: `1px solid ${themeColors[0]}`,
                            backgroundColor: isActive ? themeColors[0] : 'transparent',
                        }}
                    />
                );
            })}
        </div>
    );
};

export default Rating;
