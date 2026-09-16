import ResumeQrCode from "../ResumeQrCode";

const Profiles = ({ section, themeColors = [], basics = {} }) => {
  const resolvedProfiles = section?.items || [];
  const address = basics.location || "";
  const phone = basics.phone || "";
  const email = basics.email || "";
  const website = basics.url?.label || basics.url?.href || "";
  const websiteHref = basics.url?.href || "";

  return (
    <div className="w-full mb-4">
      {/* Sidebar Personal Info Banner Header */}
      <div className="w-full bg-black/25 px-5 py-1.5 mb-2.5">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-white">
          {section?.title || section?.name || "Personal Info"}
        </h4>
      </div>

      <div className="px-5 space-y-2.5 text-left">
        {/* Address */}
        {address && (
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
              Address
            </span>
            <span className="text-xs font-medium text-white leading-snug block break-words">
              {address}
            </span>
          </div>
        )}

        {/* Phone */}
        {phone && (
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
              Phone
            </span>
            <a
              href={`tel:${phone}`}
              className="text-xs font-medium text-white hover:underline leading-snug block"
            >
              {phone}
            </a>
          </div>
        )}

        {/* Email */}
        {email && (
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
              E-mail
            </span>
            <a
              href={`mailto:${email}`}
              className="text-xs font-medium text-white hover:underline leading-snug block break-all"
            >
              {email}
            </a>
          </div>
        )}

        {/* Website / Portfolio */}
        {website && (
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
              Portfolio
            </span>
            <a
              href={websiteHref || `https://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-blue-200 hover:underline leading-snug block break-all"
            >
              {website}
            </a>
          </div>
        )}

        {/* Social Profiles (e.g. LinkedIn, GitHub) */}
        {resolvedProfiles
          .filter((item) => item.visible !== false)
          .map((item, idx) => (
            <div key={item.id || idx} className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
                {item.network || "Profile"}
              </span>
              <a
                href={item.url?.href || item.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-white hover:underline leading-snug block break-all"
              >
                {item.username || item.url?.label || item.url?.href || item.url || item.network}
              </a>
            </div>
          ))}

        {/* Discreet QR Code */}
        {basics.qrCode?.enabled && (
          <div className="pt-2">
            <ResumeQrCode
              qrCode={basics.qrCode}
              basics={basics}
              profiles={resolvedProfiles}
              themeColors={themeColors}
              align="left"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profiles;
