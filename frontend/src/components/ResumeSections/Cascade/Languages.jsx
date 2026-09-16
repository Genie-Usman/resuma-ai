import Section from "./Section";

const Languages = ({ section, themeColors = [] }) => {
  return (
    <Section section={section} levelKey="level" themeColors={themeColors}>
      {(item) => (
        <div className="space-y-0.5">
          <div className="text-xs font-semibold group-[.sidebar]:text-white group-[.main]:text-slate-900 leading-snug">
            {item.name}
          </div>
          {item.description && (
            <div className="text-[11px] group-[.sidebar]:text-slate-300 group-[.main]:text-slate-500 leading-tight">
              {item.description}
            </div>
          )}
        </div>
      )}
    </Section>
  );
};

export default Languages;
