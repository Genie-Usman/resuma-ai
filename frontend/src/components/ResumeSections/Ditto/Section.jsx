import Rating from './Rating';

const Section = ({ section, children, className, urlKey, levelKey, summaryKey, keywordsKey, themeColors }) => {
    if (!section.visible || section.items.length === 0) return null;

    return (
        <section id={section.id} className="grid">
            <h4 className="mb-2 text-base font-bold" style={{ color: themeColors[1] }}>
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
                        const url = urlRaw && typeof urlRaw === 'object'
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
                                className={`relative space-y-2 pl-4 group-[.sidebar]:pl-0 ${className || ''}`}
                            >
                                {/* Left border dot/line */}
                                <div
                                    className="absolute inset-y-0 left-0 w-1 group-[.sidebar]:hidden"
                                    style={{ backgroundColor: themeColors[2] }}
                                />

                                {/* Main content */}
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

                                {summary?.trim() !== '' && (
                                    <div
                                        dangerouslySetInnerHTML={{ __html: summary }}
                                        className="wysiwyg"
                                    />
                                )}

                                {level !== undefined && !isNaN(level) && (
                                    <Rating level={level} themeColors={themeColors} />
                                )}

                                {keywords.length > 0 && (
                                    <p className="text-sm" style={{ color: themeColors[1] }}>
                                        {keywords.join(", ")}
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