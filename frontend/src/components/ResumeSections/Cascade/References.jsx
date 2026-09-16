import { LinkedEntity } from "../../../utils/helper";
import Section from "./Section";

const References = ({ section, themeColors = [] }) => {
  return (
    <Section
      section={section}
      urlKey="url"
      summaryKey="summary"
      themeColors={themeColors}
    >
      {(item) => (
        <div className="space-y-0.5">
          <div className="text-xs sm:text-[13px] font-bold group-[.sidebar]:text-white group-[.main]:text-slate-900 leading-snug">
            <LinkedEntity
              name={item.name}
              url={item.url}
              separateLinks={section.separateLinks}
              themeColors={themeColors}
              className="font-bold hover:underline"
            />
          </div>
          {item.description && (
            <div className="text-xs group-[.sidebar]:text-slate-300 group-[.main]:text-slate-500 font-medium leading-snug">
              {item.description}
            </div>
          )}
        </div>
      )}
    </Section>
  );
};

export default References;
