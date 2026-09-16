const Summary = ({ section, themeColors = [] }) => {
  if (!section?.visible || !section?.content?.trim()) return null;

  return (
    <div className="w-full pb-4 pt-1 select-none">
      <div
        dangerouslySetInnerHTML={{ __html: section.content }}
        className="wysiwyg text-xs sm:text-[13px] leading-relaxed text-slate-700 font-normal [&>p]:mb-2"
      />
    </div>
  );
};

export default Summary;
