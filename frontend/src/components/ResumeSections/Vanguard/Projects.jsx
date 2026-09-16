import Section from "./Section";

const Projects = ({ section, themeColors = [] }) => {
  return (
    <Section
      section={section}
      urlKey="url"
      summaryKey="summary"
      keywordsKey="keywords"
      themeColors={themeColors}
      isTimeline={true}
    >
      {(item) => {
        const subtitle = [item.description, item.date].filter(Boolean).join(" • ");
        return (
          <div className="space-y-0.5">
            <div className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
              {item.name || "Project Name"}
            </div>
            {subtitle && (
              <div className="text-xs italic text-slate-600 font-medium leading-snug">
                {subtitle}
              </div>
            )}
          </div>
        );
      }}
    </Section>
  );
};

export default Projects;
