import Rating from './Rating';

const Section = ({ section, children, className, urlKey, levelKey, summaryKey, keywordsKey, themeColors }) => {

  if (!section.visible || section.items.length === 0) return null;

  return (
    <section id={section.id} className="grid">

      {/* Main Name */}
      <div className="mb-2 hidden font-bold group-[.main]:block" style={{ color: themeColors[2] }}>
        <h4>{section.name}</h4>
      </div>

      {/* Sidebar Name */}
      <div
        className="mx-auto mb-2 hidden items-center gap-x-2 text-center font-bold group-[.sidebar]:flex"
        style={{ color: themeColors[2] }}
      >
        <div className="size-1.5 rounded-full border " style={{ color: themeColors[2] }} />
        <h4>{section.name}</h4>
        <div className="size-1.5 rounded-full border " style={{ color: themeColors[2] }} />
      </div>

      {/* Sidebar & Main Section */}
      <div
        className="grid gap-x-6 gap-y-3 group-[.sidebar]:mx-auto group-[.sidebar]:text-center"
        style={{ gridTemplateColumns: `repeat(${section.columns}, 1fr)` }}
      >
        {section.items
          .filter((item) => item.visible !== false)
          .map((item, index) => {

            const urlRaw = urlKey ? item[urlKey] : undefined;
            const url =
              urlRaw && typeof urlRaw === 'object'
                ? { label: urlRaw.label, href: urlRaw.href }
                : undefined;

            const level = levelKey ? item[levelKey] || 0 : undefined;
            const summary = summaryKey ? item[summaryKey] || '' : undefined;

            let keywords = [];

            if (keywordsKey) {
              const value = item[keywordsKey];
              if (Array.isArray(value)) {
                keywords = value;
              } else if (typeof value === "string" && value.trim() !== "") {
                keywords = value.split(/,\s*/);
              }
            }

            return (
              <div
                key={item.id || `${section.id}-${index}`}
                className={`relative space-y-2 group-[.main]:border-l group-[.main]:pl-4 ${className || ''}`}
                style={{ color: themeColors[2] }}
              >
                <div>{children?.(item)}</div>

                {/* Summary */}
                {summary && summary.trim() !== '' && (
                  <div
                    dangerouslySetInnerHTML={{ __html: summary }}
                    style={{ color: themeColors[1] }}
                    className="wysiwyg"
                  />
                )}

                {/* Level */}
                {level !== undefined && level !== null && !isNaN(level) &&
                  <Rating level={level} themeColors={themeColors} />}

                {/* Keywords */}
                {keywords.length > 0 && (
                  <p className="text-sm" style={{ color: themeColors[1] }}>{keywords.join(", ")}</p>
                )}

                {/* URL */}
                {url && section.separateLinks && (
                  <a
                    href={url.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline"
                    style={{ color: themeColors[2] }}
                  >
                    {url.label || url.href}
                  </a>
                )}

                <div className="absolute left-[-4.5px] top-px hidden size-[8px] rounded-full group-[.main]:block" style={{ backgroundColor: themeColors[2] }} />
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default Section;
