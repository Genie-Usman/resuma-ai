const Summary = ({ section, themeColors = [] }) => {
  if (!section?.visible || !section?.content?.trim()) return null;

  return (
    <div className="w-full px-8 pb-3 select-none">
      <div
        dangerouslySetInnerHTML={{ __html: section.content }}
        style={{ color: themeColors[1] || "inherit" }}
        className="wysiwyg text-xs sm:text-[13px] leading-relaxed font-normal text-slate-700 [&>p]:mb-1.5 last:[&>p]:mb-0"
      />
    </div>
  );
};

export default Summary;
