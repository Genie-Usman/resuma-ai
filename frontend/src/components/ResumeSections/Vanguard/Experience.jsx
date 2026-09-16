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
            <div className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
              {item.position || "Position"}
            </div>
            {companyLocation && (
              <div className="text-xs italic text-slate-600 font-medium leading-snug">
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
