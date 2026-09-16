import { LuUser } from "react-icons/lu";

const PersonalInfo = ({ basics = {}, themeColors = [] }) => {
  const primaryColor = themeColors[2] || "#1e293b";

  const items = [
    basics.location && { label: "Address", value: basics.location },
    basics.phone && { label: "Phone", value: basics.phone, href: `tel:${basics.phone}` },
    basics.email && { label: "E-mail", value: basics.email, href: `mailto:${basics.email}` },
    basics.url?.href && {
      label: "LinkedIn / Website",
      value: basics.url.label || basics.url.href.replace(/^https?:\/\//, ""),
      href: basics.url.href,
    },
  ].filter(Boolean);

  if (!items.length) return null;

  return (
    <div className="w-full mb-6 select-none">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3.5">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 shadow-2xs"
          style={{ backgroundColor: primaryColor }}
        >
          <LuUser className="w-3 h-3" />
        </div>
        <h3 className="text-sm sm:text-[15px] font-bold tracking-tight text-slate-900 capitalize">
          Personal Info
        </h3>
      </div>

      {/* Info Stack */}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="space-y-0.5">
            <div className="text-[11px] font-bold text-slate-900 leading-tight">
              {item.label}
            </div>
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-600 hover:text-slate-900 break-words block leading-snug"
              >
                {item.value}
              </a>
            ) : (
              <div className="text-xs text-slate-600 break-words leading-snug">
                {item.value}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalInfo;
