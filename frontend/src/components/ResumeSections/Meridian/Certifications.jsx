import Section from "./Section";

const Certifications = ({ section, themeColors = [] }) => {
  return (
    <Section
      section={section}
      urlKey="url"
      summaryKey="summary"
      themeColors={themeColors}
      isTimeline={true}
    >
      {(item) => {
        const issuerDate = [item.issuer, item.date].filter(Boolean).join(" • ");
        return (
          <div className="space-y-0.5">
            <div className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
              {item.name || "Certification"}
            </div>
            {issuerDate && (
              <div className="text-xs italic text-slate-600 font-medium leading-snug">
                {issuerDate}
              </div>
            )}
          </div>
        );
      }}
    </Section>
  );
};

export default Certifications;
