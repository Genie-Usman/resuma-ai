import Section from "./Section";

const Profiles = ({ section, themeColors = [] }) => {
  return (
    <Section section={section} themeColors={themeColors}>
      {(item) => (
        <div className="space-y-0.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {item.network || "Profile"}
          </div>
          <div className="text-xs font-semibold text-slate-800 break-words">
            {item.username || item.url?.label || (item.url?.href ? item.url.href.replace(/^https?:\/\//, "") : "")}
          </div>
        </div>
      )}
    </Section>
  );
};

export default Profiles;
