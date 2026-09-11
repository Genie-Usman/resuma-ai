import { Link } from '../../../utils/helper';
import BrandIcon from '../../shared/BrandIcon';

const Profiles = ({ section, themeColors }) => {
  if (!section?.visible || !section.items?.length) return null;

  const validItems = section.items.filter((item) => item.visible !== false);
  if (validItems.length === 0) return null;

  return (
    <section id={section.id} className="grid min-w-0 break-words">
      {/* Main Section Header */}
      <div className="mb-2 hidden font-bold group-[.main]:block" style={{ color: themeColors[2] }}>
        <h4>{section.name}</h4>
      </div>

      {/* Sidebar Section Header */}
      <div
        className="mx-auto mb-2.5 hidden items-center justify-center gap-x-2 text-center font-bold group-[.sidebar]:flex"
        style={{ color: themeColors[2] }}
      >
        <span className="heading-dot size-1.5 rounded-full border shrink-0 inline-block align-middle" style={{ borderColor: themeColors[2] }} />
        <h4 className="leading-tight">{section.name}</h4>
        <span className="heading-dot size-1.5 rounded-full border shrink-0 inline-block align-middle" style={{ borderColor: themeColors[2] }} />
      </div>

      {/* Profiles List - Icons left-aligned to each other, entire block centered in sidebar */}
      <div className="flex flex-col group-[.sidebar]:items-center group-[.main]:items-start w-full">
        <div className="flex flex-col items-start gap-y-2.5 max-w-full">
          {validItems.map((item, index) => (
            <div
              key={item.id || index}
              className="flex items-center gap-x-2 text-sm leading-normal max-w-full min-w-0"
            >
              <BrandIcon
                slug={item.icon}
                className="size-4 shrink-0 inline-block align-middle"
              />
              {item.url?.href ? (
                <Link url={item.url} label={item.username} themeColors={themeColors} showIcon={false} />
              ) : (
                <span style={{ color: themeColors[1] }}>{item.username}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Profiles;
