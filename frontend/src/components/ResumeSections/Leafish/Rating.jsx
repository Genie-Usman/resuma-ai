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
              width: '20px',
              height: '12px',
              border: `2px solid ${themeColors[2]}`,
              backgroundColor: isActive ? themeColors[2] : 'transparent',
            }}
          />
        );
      })}
    </div>
  );
}

export default Rating;