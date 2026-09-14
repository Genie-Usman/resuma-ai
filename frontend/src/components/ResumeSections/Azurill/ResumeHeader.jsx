import Picture from "../Picture";
import { LuMapPin, LuPhone, LuLink } from "react-icons/lu";
import { MdAlternateEmail } from "react-icons/md";
import ResumeQrCode from "../ResumeQrCode";

const ResumeHeader = ({ basics, themeColors, profiles, sections }) => {
  const resolvedProfiles = profiles || sections?.profiles?.items || [];
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

      <div className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1 text-sm leading-normal">
        {basics.location && (
          <div className="flex items-center gap-x-1.5">
            <LuMapPin style={{ color: themeColors[2] }} className="shrink-0 size-3.5" />
            <span className="leading-normal">{basics.location}</span>
          </div>
        )}

        {basics.phone && (
          <div className="flex items-center gap-x-1.5">
            <LuPhone style={{ color: themeColors[2] }} className="shrink-0 size-3.5" />
            <a
              href={`tel:${basics.phone}`}
              className="hover:underline leading-normal"
              style={{ color: themeColors[1] }}
            >
              {basics.phone}
            </a>
          </div>
        )}

        {basics.email && (
          <div className="flex items-center gap-x-1.5">
            <MdAlternateEmail style={{ color: themeColors[2] }} className="shrink-0 size-3.5" />
            <a
              href={`mailto:${basics.email}`}
              className="hover:underline leading-normal"
              style={{ color: themeColors[1] }}
            >
              {basics.email}
            </a>
          </div>
        )}

        {basics.url?.href && isValidUrl(basics.url.href) && (
          <div className="flex items-center gap-x-1.5">
            <LuLink style={{ color: themeColors[2] }} className="shrink-0 size-3.5" />
            <a
              href={basics.url.href}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:underline leading-normal"
              style={{ color: themeColors[1] }}
            >
              {basics.url.label || basics.url.href}
            </a>
          </div>
        )}
      </div>

      <ResumeQrCode
        qrCode={basics?.qrCode}
        basics={basics}
        profiles={resolvedProfiles}
        themeColors={themeColors}
        align="center"
        className="pt-1"
      />
    </div>
  );
};

export default ResumeHeader;