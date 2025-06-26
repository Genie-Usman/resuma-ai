const RatingInput = ({
  value = 0,
  total = 5,
  onChange = () => {},
}) => {
    // Convert 0-100 value to 0-total scale
  const filledCount = Math.round((value / 100) * total);

  // Convert 0-total value to 0-100 scale
  const handleClick = (index) => {
    const newValue = Math.round(((index + 1) / total) * 100);
    onChange(newValue);
  };

  return (
    <div className="flex gap-2 cursor-pointer">
      {[...Array(total)].map((_, index) => {
        const isActive = index < filledCount;
        return (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className={`w-4 h-4 rounded transition-colors ${isActive ? "bg-purple-600" : "bg-purple-200"}`}
          />
        );
      })}
    </div>
  );
};

export default RatingInput;
