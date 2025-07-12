const Picture = ({
  picture,
  fontSize = 16,
  className = "",
  size,
  style = {},
  border: enableBorder,
  borderColor: customBorderColor,
  borderWidth: customBorderWidth,
  borderRadius: customBorderRadius,
}) => {
  const isValidUrl =
    picture?.url && typeof picture.url === "string" && picture.url.startsWith("http");

  if (!isValidUrl || picture.effects?.hidden) return null;

  const showBorder = enableBorder;
  const finalBorderColor = customBorderColor || "#0891B2";
  const finalBorderWidth = customBorderWidth || fontSize / 3;
  const finalBorderRadius = customBorderRadius ?? 0;

  const classes = [
    "relative z-20 object-cover",
    picture.effects?.grayscale ? "grayscale" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const computedWidth = size || `${fontSize * 6}px`;
  const computedHeight = size || `${fontSize * 6}px`;

  return (
    <img
      src={picture.url}
      alt="Profile"
      crossOrigin="anonymous"
      className={classes}
      style={{
        width: typeof computedWidth === "number" ? `${computedWidth}px` : computedWidth,
        height: typeof computedHeight === "number" ? `${computedHeight}px` : computedHeight,
        aspectRatio: picture.aspectRatio || "1/1",
        borderRadius: `${finalBorderRadius}px`,
        border: showBorder ? `${finalBorderWidth}px solid ${finalBorderColor}` : "none",
        ...style,
      }}
    />
  );
};

export default Picture;