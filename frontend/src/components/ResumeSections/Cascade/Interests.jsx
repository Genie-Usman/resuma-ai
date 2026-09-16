import Section from "./Section";

const Interests = ({ section, themeColors = [] }) => {
  return (
    <Section
      section={section}
      keywordsKey="keywords"
      themeColors={themeColors}
    >
      {(item) => (
        <div className="text-xs font-semibold group-[.sidebar]:text-white group-[.main]:text-slate-800 leading-snug">
          {item.name}
        </div>
      )}
    </Section>
  );
};

export default Interests;
