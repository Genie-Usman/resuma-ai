import { LuPhone, LuMail, LuLinkedin, LuGlobe, LuMapPin } from "react-icons/lu";
import Picture from "../Picture";

const ResumeHeader = ({ basics = {}, themeColors = [] }) => {
  const hasPicture = basics.picture?.url && !basics.picture?.effects?.hidden;
  const primaryColor = themeColors[2] || "#0d2f5a";

  const contactItems = [
    basics.phone && { icon: LuPhone, text: basics.phone, href: `tel:${basics.phone}` },
    basics.email && { icon: LuMail, text: basics.email, href: `mailto:${basics.email}` },
    basics.location && { icon: LuMapPin, text: basics.location },
    basics.url?.href && {
      icon: LuGlobe,
      text: basics.url.label || basics.url.href.replace(/^https?:\/\//, ""),
      href: basics.url.href,
    },
  ].filter(Boolean);

  return (
    <div className="w-full pb-4 pt-6 px-6 select-none">
      <div className="flex items-start gap-5">
        {hasPicture && (
          <div className="shrink-0">
            <div className="rounded-xl overflow-hidden shadow-sm ring-2 ring-slate-200">
              <Picture picture={basics.picture} size={100} borderRadius={12} />
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h1
            className="text-2xl sm:text-3xl font-black tracking-tight leading-none break-words"
            style={{ color: primaryColor }}
          >
            {basics.name || "Your Name"}
          </h1>

          {basics.headline && (
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1.5 leading-snug break-words">
              {basics.headline}
            </p>
          )}

          {/* Contact Details Grid (2-column layout matching Concept design) */}
          {contactItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 mt-3 pt-2.5 border-t border-slate-100">
              {contactItems.map((item, i) => {
                const Icon = item.icon;
                const content = (
                  <span className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors truncate">
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Icon className="w-2.5 h-2.5" />
                    </span>
                    <span className="truncate">{item.text}</span>
                  </span>
                );

                return item.href ? (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate inline-block"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={i} className="truncate">
                    {content}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeHeader;
