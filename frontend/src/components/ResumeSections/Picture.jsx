const Picture = ({ picture, fontSize = 16, className = "" }) => {
  // Basic URL validation
  const isValidUrl = picture?.url && typeof picture.url === "string" && picture.url.startsWith("http");

  if (!isValidUrl || picture.effects?.hidden) return null;

  // Determine border width based on fontSize if border is enabled
  const borderWidth = picture.effects?.border ? fontSize / 3 : 0;

  // Build dynamic className
  const classes = [
    "relative z-20 object-cover",
    picture.effects?.border ? "border-primary" : "",
    picture.effects?.grayscale ? "grayscale" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <img
      src={picture.url}
      alt="Profile"
      className={classes}
      style={{
        maxWidth: `${picture.size}px`,
        aspectRatio: `${picture.aspectRatio}`,
        borderRadius: `${picture.borderRadius}px`,
        borderWidth: `${borderWidth}px`,
        borderStyle: borderWidth > 0 ? "solid" : "none",
      }}
    />
  );
};

export default Picture;
