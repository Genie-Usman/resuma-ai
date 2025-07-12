import Section from './Section';

const Experience = ({ section, themeColors }) => {

    return (
    <Section section={section} urlKey="url" summaryKey="summary" themeColors={themeColors}>
      {(item) => (
        <div className="flex items-start justify-between group-[.sidebar]:flex-col group-[.sidebar]:items-start">
          <div className="text-left">
            <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.company}</div>
            <div style={{ color: themeColors[1] }}>{item.position}</div>
          </div>

          <div className="shrink-0 text-right">
            <div style={{ fontWeight: 'bold', color: themeColors[1] }}>{item.date}</div>
            <div style={{ color: themeColors[1] }}>{item.location}</div>
          </div>
        </div>
      )}
    </Section>
  );
};

export default Experience
