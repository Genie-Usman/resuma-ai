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
        const degreeInstitution = [item.studyType, item.institution]
          .filter(Boolean)
          .join(", ");

        return (
          <div className="space-y-0.5">
            <div className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
              {degreeInstitution || "Degree & Institution"}
            </div>
            {item.score && (
              <div className="text-[11px] font-medium text-slate-500">
                GPA / Honors: {item.score}
              </div>
            )}
          </div>
        );
      }}
    </Section>
  );
};

export default Education;
