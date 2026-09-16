import Section from "./Section";

const Profiles = ({ section, themeColors = [] }) => {
  return (
    <Section section={section} themeColors={themeColors}>
      {(item) => (
        <div className="text-xs sm:text-[13px] font-bold text-slate-800 leading-snug">
          {item.network || "Profile"}
          {item.username && (
            <span className="font-normal text-slate-500 ml-1 text-xs">
              ({item.username})
            </span>
          )}
        </div>
      )}
    </Section>
  );
};

export default Profiles;
