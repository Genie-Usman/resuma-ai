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
      {(item) => (
        <div className="space-y-0.5">
          {item.date && (
            <div className="group-[.sidebar]:block hidden text-[10px] font-semibold uppercase tracking-wider text-slate-300">
              {item.date}
            </div>
          )}

          <div className="text-xs sm:text-[13px] font-bold group-[.sidebar]:text-white group-[.main]:text-slate-900 leading-snug">
            {item.name}
            {item.issuer && ` - ${item.issuer}`}
          </div>
        </div>
      )}
    </Section>
  );
};

export default Certifications;
