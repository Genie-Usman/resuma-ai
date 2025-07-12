import Rating from './Rating';

const Section = ({
  section,
  children,
  className,
  urlKey,
  levelKey,
  summaryKey,
  keywordsKey,
  themeColors,
  isSidebar = false // ✅ NEW: flag passed from parent
}) => {
  if (!section.visible || section.items.length === 0) return null;

  return (
    <section id={section.id} className="grid">
      <h4
        className="mb-2 border-b pb-0.5 text-sm font-bold"
        style={{ color: isSidebar ? themeColors[0] : themeColors[1] }}
      >
        {section.name}
      </h4>

      <div
        className="grid gap-x-6 gap-y-3"
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
              } else if (typeof value === 'string' && value.trim() !== '') {
                keywords = value.split(/,\s*/);
              }
            }

            return (
              <div
                key={item.id || `${section.id}-${index}`}
                className={`space-y-2 ${className || ''}`}
                style={{ color: themeColors[1] }}
              >
                <div>
                  {children?.(item)}
                  {url && section.separateLinks && (
                    <a
                      href={url.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline"
                      style={{ color: themeColors[1] }}
                    >
                      {url.label || url.href}
                    </a>
                  )}
                </div>

                {summary && summary.trim() !== '' && (
                  <div
                    dangerouslySetInnerHTML={{ __html: summary }}
                    className="wysiwyg"
                    style={{ color: isSidebar ? themeColors[0] : undefined }}
                  />
                )}

                {level !== undefined &&
                  level !== null &&
                  !isNaN(level) && (
                    <Rating level={level} themeColors={themeColors} />
                  )}

                {keywords.length > 0 && (
                  <p className="text-sm" style={{ color: isSidebar ? themeColors[0] : themeColors[1] }}>
                    {keywords.join(', ')}
                  </p>
                )}
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default Section;
