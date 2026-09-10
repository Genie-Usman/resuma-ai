const Rating = ({ level = 0, themeColors }) => {
  const normalized = level <= 5 ? Math.round(level) : Math.round((level / 100) * 5);

  return (
    <div className="flex items-center gap-x-1.5 my-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const isActive = normalized > index;
        return (
          <div
            key={index}
            style={{
              width: "14px",
              height: "6px",
              borderRadius: "2px",
              border: `1px solid ${themeColors[2]}`,
              backgroundColor: isActive ? themeColors[2] : "transparent",
            }}
          />
        );
      })}
    </div>
  );
};

export default Rating;