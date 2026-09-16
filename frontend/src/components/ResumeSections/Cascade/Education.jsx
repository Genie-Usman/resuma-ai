import Section from "./Section";

const Education = ({ section, themeColors = [] }) => {
  return (
    <Section
      section={section}
      urlKey="url"
      summaryKey="summary"
      themeColors={themeColors}
      isTimeline={true}
    >
      {(item) => {
        // Degree title string
        const degree = [item.studyType, item.area].filter(Boolean).join(" in ");
        const title = degree || item.degree || "Degree";
        const institutionDetails = [item.institution, item.score]
          .filter(Boolean)
          .join(" • ");

        return (
          <div className="space-y-0.5">
            {/* Sidebar-only date tag if placed in sidebar */}
            {item.date && (
              <div className="group-[.sidebar]:block hidden text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                {item.date}
              </div>
            )}

            {/* Degree and Institution */}
            <div className="text-xs sm:text-[13px] font-bold group-[.sidebar]:text-white group-[.main]:text-slate-900 leading-snug">
              {title}
              {item.institution && `, ${item.institution}`}
            </div>

            {/* Area / Score / Details */}
            {item.score && (
              <div className="text-xs group-[.sidebar]:text-slate-300 group-[.main]:text-slate-500 font-medium leading-snug">
                Score: {item.score}
              </div>
            )}
          </div>
        );
      }}
    </Section>
  );
};

export default Education;
