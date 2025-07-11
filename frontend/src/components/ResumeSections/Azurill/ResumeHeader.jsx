import Picture from "../Picture";
import { LuMapPin, LuPhone, LuLink } from "react-icons/lu";
import { MdAlternateEmail } from "react-icons/md";

const ResumeHeader = ({ basics, themeColors }) => {

  const isValidUrl = (v) => typeof v === "string" && v.startsWith("http");

  return (
    <div
      className="flex flex-col items-center space-y-2 pb-2 text-center"
      style={{ color: themeColors[1] }}
    >
      <Picture picture={basics.picture} />

      <div>
        <div className="text-2xl font-bold">{basics.name}</div>
        <div className="text-base">{basics.headline}</div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-sm">
        {basics.location && (
          <div className="flex items-center gap-x-1.5">
            <LuMapPin style={{ color: themeColors[2] }} />
            <span>{basics.location}</span>
          </div>
        )}

        {basics.phone && (
          <div className="flex items-center gap-x-1.5">
            <LuPhone style={{ color: themeColors[2] }} />
            <a
              href={`tel:${basics.phone}`}
              className="hover:underline"
              style={{ color: themeColors[1] }}
            >
              {basics.phone}
            </a>
          </div>
        )}

        {basics.email && (
          <div className="flex items-center gap-x-1.5">
            <MdAlternateEmail style={{ color: themeColors[2] }} />
            <a
              href={`mailto:${basics.email}`}
              className="hover:underline"
              style={{ color: themeColors[1] }}
            >
              {basics.email}
            </a>
          </div>
        )}

        {basics.url?.href && isValidUrl(basics.url.href) && (
          <div className="flex items-center gap-x-1.5">
            <LuLink style={{ color: themeColors[2] }} />
            <a
              href={basics.url.href}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:underline"
              style={{ color: themeColors[1] }}
            >
              {basics.url.label || basics.url.href}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeHeader;