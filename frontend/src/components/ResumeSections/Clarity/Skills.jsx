import Section from "./Section";

const Skills = ({ section, themeColors = [] }) => {
  return (
    <Section
      section={section}
      levelKey="level"
      keywordsKey="keywords"
      themeColors={themeColors}
    >
      {(item) => (
        <div className="space-y-0.5">
          <div className="text-xs sm:text-[13px] font-bold text-slate-800 leading-snug">
            {item.name || "Skill Category"}
            {item.description && (
              <span className="font-normal text-slate-500 ml-1 text-xs">
                — {item.description}
              </span>
            )}
          </div>
        </div>
      )}
    </Section>
  );
};

export default Skills;
