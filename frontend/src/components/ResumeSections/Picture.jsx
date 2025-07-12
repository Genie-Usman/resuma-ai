const Picture = ({
  picture,
  fontSize = 16,
  className = "",
  size,           // optional direct size control (number or string like "120px")
  width,
  height,
  style = {},
}) => {
  const isValidUrl = picture?.url && typeof picture.url === "string" && picture.url.startsWith("http");
  if (!isValidUrl || picture.effects?.hidden) return null;

  const borderWidth = picture.effects?.border ? fontSize / 3 : 0;

  const classes = [
    "relative z-20 object-cover",
    picture.effects?.border ? "border-primary" : "",
    picture.effects?.grayscale ? "grayscale" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const computedWidth =  size || `${fontSize * 6}px`; // fallback
  const computedHeight =  size || `${fontSize * 6}px`;

  return (
    <img
      src={picture.url}
      alt="Profile"
      className={classes}
      crossOrigin="anonymous"
      style={{
        width: typeof computedWidth === "number" ? `${computedWidth}px` : computedWidth,
        height: typeof computedHeight === "number" ? `${computedHeight}px` : computedHeight,
        aspectRatio: picture.aspectRatio || "1/1",
        borderRadius: `${picture.borderRadius ?? 0}px`,
        borderWidth: `${borderWidth}px`,
        borderStyle: borderWidth > 0 ? "solid" : "none",
        ...style, // allow override
      }}
    />
  );
};

export default Picture