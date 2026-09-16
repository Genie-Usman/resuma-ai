const Summary = ({ section, themeColors = [] }) => {
  if (!section?.visible || !section?.content?.trim()) return null;

  return (
    <div className="w-full mb-5 select-none">
      <div
        dangerouslySetInnerHTML={{ __html: section.content }}
        style={{ color: themeColors[1] || "inherit" }}
        className="wysiwyg text-xs sm:text-[13px] leading-relaxed font-normal [&>p]:mb-2"
      />
    </div>
  );
};

export default Summary;
