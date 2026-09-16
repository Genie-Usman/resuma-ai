import Section from "./Section";

const Interests = ({ section, themeColors = [] }) => {
  return (
    <Section section={section} keywordsKey="keywords" themeColors={themeColors} hasDivider={true}>
      {(item) => (
        <div className="text-xs sm:text-[13px] font-bold text-slate-800 leading-snug">
          {item.name || "Interest"}
        </div>
      )}
    </Section>
  );
};

export default Interests;
