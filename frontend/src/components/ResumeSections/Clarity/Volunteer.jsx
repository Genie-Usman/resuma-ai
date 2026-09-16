import Section from "./Section";

const Volunteer = ({ section, themeColors = [] }) => {
  return (
    <Section
      section={section}
      urlKey="url"
      summaryKey="summary"
      themeColors={themeColors}
      isTimeline={true}
    >
      {(item) => {
        const orgLocation = [item.organization, item.location].filter(Boolean).join(", ");
        return (
          <div className="space-y-0.5">
            <div className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
              {item.position || "Volunteer Position"}
            </div>
            {orgLocation && (
              <div className="text-xs italic text-slate-600 font-medium leading-snug">
                {orgLocation}
              </div>
            )}
          </div>
        );
      }}
    </Section>
  );
};

export default Volunteer;
