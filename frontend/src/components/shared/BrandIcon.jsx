import { forwardRef } from "react";
import LINKEDIN from "../../assets/linkedin.svg";

const BrandIcon = forwardRef(({ slug = ""}, ref) => {
  if (!slug) return null;

  const iconSlug = slug.toLowerCase().trim();

  if (iconSlug === "linkedin" || iconSlug === "linked in") {
    return (
      <img
        ref={ref}
        alt=""
        className="size-6"
        src={LINKEDIN}
        crossOrigin="anonymous"
        loading="lazy"
      />
    );
  }

  return (
    <img
      ref={ref}
      alt=""
      className="size-6"
      src={`https://cdn.simpleicons.org/${iconSlug}`}
      loading="lazy"
    />
  );
});

export default BrandIcon;
