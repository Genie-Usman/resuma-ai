const PersonalInfo = ({ basics = {}, themeColors = [] }) => {
  const items = [
    basics.location && { label: "Address", value: basics.location },
    basics.phone && { label: "Phone", value: basics.phone, href: `tel:${basics.phone}` },
    basics.email && { label: "E-mail", value: basics.email, href: `mailto:${basics.email}` },
    basics.url?.href && {
      label: "LinkedIn / Web",
      value: basics.url.label || basics.url.href.replace(/^https?:\/\//, ""),
      href: basics.url.href,
    },
  ].filter(Boolean);

  if (!items.length) return null;

  return (
    <div className="w-full mb-6 select-none">
      {/* Header with Underline Rule */}
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3.5">
        Personal Info
      </h3>

      {/* Info Items */}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="space-y-0.5">
            <div className="text-[11px] font-bold text-slate-800 leading-tight">
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
