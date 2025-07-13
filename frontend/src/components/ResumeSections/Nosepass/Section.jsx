const Section = ({ section, children, urlKey, dateKey, summaryKey, keywordsKey, themeColors }) => {
    if (!section.visible || section.items.length === 0) return null;

    const renderExtras = (item, summary, url, keywords) => (
        <>
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
            {summary && summary.trim() !== '' && (
                <div
                    dangerouslySetInnerHTML={{ __html: summary }}
                    className="wysiwyg"
                    style={{ color: themeColors[1] }}
                />
            )}
            {keywords.length > 0 && (
                <p className="text-sm" style={{ color: themeColors[1] }}>
                    {keywords.join(", ")}
                </p>
            )}
        </>
    );

    return (
        <section id={section.id} className={`grid${dateKey ? " gap-y-6" : ""}`}>
            {/* Section Title Row */}
            <div className="grid grid-cols-4 gap-x-6 items-start">
                <div className="text-right pt-1">
                    <h4 className="font-medium" style={{ color: themeColors[2] }}>
                        {section.name}
                    </h4>
                </div>
                <div className="col-span-3 relative">
                    <hr className="mt-3 border-t-2" style={{ borderColor: themeColors[2] }} />
                    <div
                        className="absolute bottom-0 right-0 w-3 h-3 border"
                        style={{
                            borderColor: themeColors[2],
                            backgroundColor: themeColors[2],
                            borderWidth: '2px'
                        }}
                    />
                </div>
            </div>

            {/* Section Content */}
            {dateKey ? (
                <div className="grid grid-cols-4 gap-x-6 gap-y-6">
                    {section.items
                        .filter(item => item.visible !== false)
                        .map((item, index) => {
                            const urlRaw = urlKey ? item[urlKey] : undefined;
                            const url = urlRaw && typeof urlRaw === 'object' ? urlRaw : undefined;
                            const date = item[dateKey] || '';
                            const summary = summaryKey ? item[summaryKey] || '' : '';

                            let keywords = [];
                            const rawKeywords = item[keywordsKey];
                            if (Array.isArray(rawKeywords)) keywords = rawKeywords;
                            else if (typeof rawKeywords === "string" && rawKeywords.trim() !== "")
                                keywords = rawKeywords.split(/,\s*/);

                            return (
                                <div
                                    key={item.id || `${section.id}-${index}`}
                                    className="col-span-4 grid grid-cols-4 gap-x-6"
                                    style={{ color: themeColors[1] }}
                                >
                                    <div className="text-right font-medium" style={{ color: themeColors[2] }}>
                                        {date}
                                    </div>
                                    <div className="col-span-3 space-y-1">
                                        {children?.(item)}
                                        {renderExtras(item, summary, url, keywords)}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-x-6 mt-2">
                    <div
                        className="col-span-3 col-start-2 grid gap-x-6 gap-y-3"
                        style={{ gridTemplateColumns: `repeat(${section.columns}, 1fr)` }}
                    >
                        {section.items
                            .filter(item => item.visible !== false)
                            .map((item, index) => {
                                const urlRaw = urlKey ? item[urlKey] : undefined;
                                const url = urlRaw && typeof urlRaw === 'object' ? urlRaw : undefined;
                                const summary = summaryKey ? item[summaryKey] || '' : '';

                                let keywords = [];
                                const rawKeywords = item[keywordsKey];
                                if (Array.isArray(rawKeywords)) keywords = rawKeywords;
                                else if (typeof rawKeywords === "string" && rawKeywords.trim() !== "")
                                    keywords = rawKeywords.split(/,\s*/);

                                return (
                                    <div
                                        key={item.id || `${section.id}-${index}`}
                                        className="space-y-1"
                                        style={{ color: themeColors[1] }}
                                    >
                                        {children?.(item)}
                                        {renderExtras(item, summary, url, keywords)}
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}
        </section>
    );
};

export default Section;