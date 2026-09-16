import Section from "./Section";

const References = ({ section, themeColors = [] }) => {
  return (
    <Section section={section} themeColors={themeColors}>
      {(item) => (
        <div className="space-y-0.5">
          <div className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
            {item.name || "Reference"}
          </div>
          {item.description && (
            <div className="text-xs italic text-slate-600 font-medium leading-snug">
              {item.description}
            </div>
          )}
        </div>
      )}
    </Section>
  );
};

export default References;
