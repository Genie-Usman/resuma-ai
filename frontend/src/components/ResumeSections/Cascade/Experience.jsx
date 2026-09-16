import Section from "./Section";

const Experience = ({ section, themeColors = [] }) => {
  return (
    <Section
      section={section}
      urlKey="url"
      summaryKey="summary"
      themeColors={themeColors}
      isTimeline={true}
    >
      {(item) => {
        const companyLocation = [item.company, item.location]
          .filter(Boolean)
          .join(", ");

        return (
          <div className="space-y-0.5">
            {/* Sidebar-only date tag if placed in sidebar */}
            {item.date && (
              <div className="group-[.sidebar]:block hidden text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                {item.date}
              </div>
            )}

            {/* Position / Title */}
            <div className="text-xs sm:text-[13px] font-bold group-[.sidebar]:text-white group-[.main]:text-slate-900 leading-snug">
              {item.position || "Position"}
            </div>

            {/* Company & Location */}
            {companyLocation && (
              <div className="text-xs group-[.sidebar]:text-slate-300 group-[.main]:text-slate-500 font-medium leading-snug">
                {companyLocation}
              </div>
            )}
          </div>
        );
      }}
    </Section>
  );
};

export default Experience;
