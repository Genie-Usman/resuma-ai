import Section from "./Section";

const Awards = ({ section, themeColors = [] }) => {
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
            {item.title || item.name}
            {item.awarder && ` - ${item.awarder}`}
          </div>
        </div>
      )}
    </Section>
  );
};

export default Awards;
