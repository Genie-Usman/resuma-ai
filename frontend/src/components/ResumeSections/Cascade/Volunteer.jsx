import { LinkedEntity } from "../../../utils/helper";
import Section from "./Section";

const Volunteer = ({ section, themeColors = [] }) => {
  return (
    <Section
      section={section}
      urlKey="url"
      summaryKey="summary"
      themeColors={themeColors}
      isTimeline={true}
    >
      {(item) => (
        <div className="space-y-0.5">
          {item.date && (
            <div className="group-[.sidebar]:block hidden text-[10px] font-semibold uppercase tracking-wider text-slate-300">
              {item.date}
            </div>
          )}

          <div className="text-xs sm:text-[13px] font-bold group-[.sidebar]:text-white group-[.main]:text-slate-900 leading-snug">
            <LinkedEntity
              name={item.organization}
              url={item.url}
              separateLinks={section.separateLinks}
              themeColors={themeColors}
              className="font-bold hover:underline"
            />
          </div>

          <div className="text-xs group-[.sidebar]:text-slate-300 group-[.main]:text-slate-500 font-medium leading-snug">
            {[item.position, item.location].filter(Boolean).join(" • ")}
          </div>
        </div>
      )}
    </Section>
  );
};

export default Volunteer;
