import Section from "./Section";

const Languages = ({ section, themeColors = [] }) => {
  return (
    <Section
      section={section}
      levelKey="level"
      themeColors={themeColors}
      isLanguage={true}
    >
      {(item) => (
        <div className="text-xs sm:text-[13px] font-bold text-slate-800 leading-snug">
          {item.name || "Language"}
        </div>
      )}
    </Section>
  );
};

export default Languages;
