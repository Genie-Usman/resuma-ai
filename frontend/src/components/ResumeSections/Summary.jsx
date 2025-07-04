const Summary = ({ section, themeColors }) => {
  if (!section || !section.visible || !section.content || section.content.trim() === "") {
    return null;
  }

  return (
    <section id={section.id}>
      {/* Section Header */}
      <div className="mb-2 font-bol" style={{ color: themeColors[2] }}>
        <h4>{section.name}</h4>
      </div>

      {/* Main Content */}
      <main className="relative space-y-2 border-l pl-4" style={{ color: themeColors[2] }}>
        {/* Decorative dot on left */}
        <div
          className="absolute left-[-4.5px] top-[8px] size-[8px] rounded-full"
          style={{ backgroundColor: themeColors[2] }} />

        {/* Summary content */}
        <div
          dangerouslySetInnerHTML={{ __html: section.content }}
          style={{ columns: section.columns || 1 }}
          className="wysiwyg"
        />
      </main>
    </section>
  );
};

export default Summary;