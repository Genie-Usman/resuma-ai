import Section from "./Section";

const Publications = ({ section, themeColors = [] }) => {
  return (
    <Section
      section={section}
      urlKey="url"
      summaryKey="summary"
      themeColors={themeColors}
    >
      {(item) => {
        const publisherDate = [item.publisher, item.date].filter(Boolean).join(" • ");
        return (
          <div className="space-y-0.5">
            <div className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
              {item.name || "Publication Title"}
            </div>
            {publisherDate && (
              <div className="text-xs italic text-slate-600 font-medium leading-snug">
                {publisherDate}
              </div>
            )}
          </div>
        );
      }}
    </Section>
  );
};

export default Publications;
