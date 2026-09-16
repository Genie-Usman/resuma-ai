import { useMemo } from "react";
import { LuMapPin, LuPhone, LuLink } from "react-icons/lu";
import { MdAlternateEmail } from "react-icons/md";
import Picture from "./Picture";
import { formatResumeDate } from "../../utils/dateFormatter";
import { DEFAULT_FONT } from "../../utils/googleFonts";

/**
 * MatchedCoverLetter Component (Roadmap Item 4.4)
 * Renders a synchronized 1-page cover letter matching the candidate's active resume:
 * - Same header typography & Google Font
 * - Same accent color palette (`themeColors[2]`)
 * - Same margin padding & paper format
 * - Tailored narrative directly aligned to the target job description & company
 */
const MatchedCoverLetter = ({
  basics = {},
  metadata = {},
  coverLetter = {},
  themeColors = [],
  containerWidth,
}) => {
  const activeFont =
    metadata?.typography?.font?.family || metadata?.fontFamily || DEFAULT_FONT;
  const activeDateFormat =
    metadata?.date?.format || metadata?.dateFormat || "short";
  const activeHeaderStyle =
    metadata?.typography?.headerStyle || metadata?.headerStyle || "default";

  // Palette fallback
  const colors = useMemo(() => {
    return themeColors?.length === 3
      ? themeColors
      : [
          metadata.theme?.background || "#ffffff",
          metadata.theme?.text || "#111827",
          metadata.theme?.primary || "#7c3aed",
        ];
  }, [themeColors, metadata.theme]);

  // Dynamic page margins (aligns with Resume Design Drawer: narrow: 12mm, standard: 18mm, wide: 24mm)
  const activeMargin =
    metadata?.page?.marginPreset ||
    (metadata?.page?.margin === 12
      ? "narrow"
      : metadata?.page?.margin === 24
      ? "wide"
      : "standard");

  const paddingStyle = useMemo(() => {
    if (activeMargin === "narrow") {
      return { padding: "38px 46px" }; // ~10mm top/bottom, 12mm left/right
    }
    if (activeMargin === "wide") {
      return { padding: "58px 68px" }; // ~15mm top/bottom, 18mm left/right
    }
    return { padding: "48px 56px" }; // Standard: ~13mm top/bottom, ~15mm left/right
  }, [activeMargin]);

  // Today's formatted date
  const formattedToday = useMemo(() => {
    const today = new Date();
    const isoMonth = today.toISOString().slice(0, 7); // e.g. "2026-09"
    return formatResumeDate(isoMonth, activeDateFormat);
  }, [activeDateFormat]);

  const recipient = coverLetter.recipient || {};
  const companyName = coverLetter.companyName || recipient.company || "";
  const salutation =
    coverLetter.salutation ||
    (companyName ? `Dear Hiring Team at ${companyName},` : "Dear Hiring Team,");
  const signOff = coverLetter.signOff || "Sincerely,";
  const candidateName = coverLetter.signature || basics.name || "Candidate";

  // Body content extraction
  const paragraphs = useMemo(() => {
    if (Array.isArray(coverLetter.bodyParagraphs) && coverLetter.bodyParagraphs.length > 0) {
      const all = [];
      if (coverLetter.opening) all.push(coverLetter.opening);
      all.push(...coverLetter.bodyParagraphs);
      if (coverLetter.callToAction) all.push(coverLetter.callToAction);
      return all;
    }
    return [];
  }, [coverLetter]);

  // Check if active template is Cascade
  const isCascade =
    (metadata?.template && String(metadata.template).toLowerCase() === "cascade") ||
    (coverLetter?.template && String(coverLetter.template).toLowerCase() === "cascade");

  if (isCascade) {
    const formattedDateLocation = basics.location
      ? `${basics.location.split(",")[0].trim()}, ${formattedToday}`
      : formattedToday;

    return (
      <div
        className="matched-cover-letter w-full box-border grid grid-cols-12 text-left min-h-full print:min-h-0"
        style={{
          fontFamily: activeFont,
          backgroundColor: colors[0],
          width: containerWidth ? `${containerWidth}px` : "100%",
          minHeight: "100%",
        }}
      >
        {/* Left Sidebar (Solid Accent Color matching Cascade Resume) */}
        <aside
          className="col-span-4 flex flex-col min-h-full pb-8 select-none"
          style={{
            backgroundColor: colors[2] || "#1a365d",
            color: "#ffffff",
          }}
        >
          {/* Optional Profile Picture */}
          {basics.picture?.url && !basics.picture?.effects?.hidden && (
            <div className="px-6 pt-6 pb-2">
              <div className="rounded-xl overflow-hidden shadow-md ring-2 ring-white/20 bg-white/10 w-fit">
                <Picture picture={basics.picture} size={88} />
              </div>
            </div>
          )}

          {/* Name & Title */}
          <div className="px-6 pt-6 pb-4 space-y-1">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight break-words">
              {candidateName}
            </h1>
            {basics.headline && (
              <p className="text-xs sm:text-[13px] font-semibold text-slate-300 leading-snug break-words">
                {basics.headline}
              </p>
            )}
          </div>

          {/* Personal Info Banner */}
          <div className="w-full bg-black/25 px-6 py-2 mb-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-white">
              Personal Info
            </h4>
          </div>

          {/* Contact Items */}
          <div className="px-6 space-y-3.5 text-left text-xs">
            {basics.phone && (
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
                  Phone
                </span>
                <a
                  href={`tel:${basics.phone}`}
                  className="font-medium text-white hover:underline leading-snug block"
                >
                  {basics.phone}
                </a>
              </div>
            )}

            {basics.email && (
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
                  E-mail
                </span>
                <a
                  href={`mailto:${basics.email}`}
                  className="font-medium text-white hover:underline leading-snug block break-all"
                >
                  {basics.email}
                </a>
              </div>
            )}

            {basics.location && (
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
                  Address
                </span>
                <span className="font-medium text-white leading-snug block break-words">
                  {basics.location}
                </span>
              </div>
            )}

            {basics.url?.label && (
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
                  Portfolio
                </span>
                <a
                  href={basics.url?.href || basics.url?.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-200 hover:underline leading-snug block break-all"
                >
                  {basics.url.label}
                </a>
              </div>
            )}
          </div>
        </aside>

        {/* Right Letter Body */}
        <main
          className="col-span-8 flex flex-col justify-start p-8 sm:p-10 text-left min-h-full"
          style={{
            backgroundColor: colors[0],
            color: colors[1],
          }}
        >
          {/* Top Date */}
          <div className="text-xs font-semibold text-slate-500 mb-6">
            {formattedDateLocation}
          </div>

          {/* Recipient Block */}
          <div className="space-y-0.5 mb-6 text-xs sm:text-[13px]">
            <div className="font-bold text-slate-900">
              {recipient.name || "Ms. Katherine Bloomstein"}
            </div>
            {recipient.title && (
              <div className="italic text-slate-600">{recipient.title}</div>
            )}
            {companyName && (
              <div className="text-slate-800 font-medium">{companyName}</div>
            )}
            {recipient.address && (
              <div className="text-slate-500">{recipient.address}</div>
            )}
          </div>

          {/* Salutation */}
          <div className="font-bold text-slate-900 text-xs sm:text-[13.5px] mb-4">
            {salutation}
          </div>

          {/* Letter Body Paragraphs */}
          {coverLetter.bodyHtml ? (
            <div
              className="cover-letter-body max-w-none text-slate-800 text-[13px] sm:text-[13.5px] leading-[1.65] text-justify sm:text-left [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:my-2 [&>ul]:pl-5 [&>ol]:my-2 [&>ol]:pl-5 [&>li]:my-0.5"
              dangerouslySetInnerHTML={{ __html: coverLetter.bodyHtml }}
            />
          ) : paragraphs.length > 0 ? (
            <div className="space-y-3 text-slate-800 text-[13px] sm:text-[13.5px] leading-[1.65] text-justify sm:text-left">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-purple-200 rounded-2xl bg-purple-50/50 text-center space-y-3 my-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto text-lg font-bold">
                ✉️
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  No Cover Letter Generated Yet
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Open the <strong>Cover Letter</strong> drawer on the left, paste the job description, and click <strong>Generate Cover Letter</strong> to create a personalized letter that matches your resume.
                </p>
              </div>
            </div>
          )}

          {/* Formal Sign-off */}
          <footer className="mt-8 space-y-1.5 text-xs sm:text-[13px]">
            <div className="text-slate-700">{signOff}</div>
            <div className="font-bold text-slate-900 text-sm sm:text-base pt-1">
              {candidateName}
            </div>
          </footer>
        </main>
      </div>
    );
  }

  return (
    <div
      className="matched-cover-letter w-full box-border flex flex-col justify-start text-left"
      style={{
        fontFamily: activeFont,
        color: colors[1],
        backgroundColor: colors[0],
        width: containerWidth ? `${containerWidth}px` : "100%",
        ...paddingStyle,
      }}
    >
      {/* 1. Synchronized Header (Matches Candidate Resume Aesthetic) */}
      <header className="pb-3.5 border-b border-slate-200/80 mb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5 min-w-0">
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{
                color: activeHeaderStyle === "pill" ? "#ffffff" : colors[1],
                backgroundColor:
                  activeHeaderStyle === "pill" ? colors[2] : "transparent",
                padding: activeHeaderStyle === "pill" ? "4px 12px" : "0",
                borderRadius: activeHeaderStyle === "pill" ? "8px" : "0",
                display: activeHeaderStyle === "pill" ? "inline-block" : "block",
              }}
            >
              {basics.name || "Candidate Name"}
            </h1>

            {basics.headline && (
              <p
                className="text-xs sm:text-sm font-semibold tracking-normal"
                style={{ color: colors[2] }}
              >
                {basics.headline}
              </p>
            )}

            {/* Contact Chips */}
            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[11px] sm:text-xs text-slate-500 pt-0.5">
              {basics.location && (
                <span className="inline-flex items-center gap-1">
                  <LuMapPin style={{ color: colors[2] }} className="shrink-0 size-3" />
                  {basics.location}
                </span>
              )}

              {basics.email && (
                <span className="inline-flex items-center gap-1">
                  <MdAlternateEmail style={{ color: colors[2] }} className="shrink-0 size-3" />
                  {basics.email}
                </span>
              )}

              {basics.phone && (
                <span className="inline-flex items-center gap-1">
                  <LuPhone style={{ color: colors[2] }} className="shrink-0 size-3" />
                  {basics.phone}
                </span>
              )}

              {basics.url?.label && (
                <span className="inline-flex items-center gap-1">
                  <LuLink style={{ color: colors[2] }} className="shrink-0 size-3" />
                  {basics.url.label}
                </span>
              )}
            </div>
          </div>

          {/* Optional Picture */}
          {basics.picture?.url && !basics.picture?.effects?.hidden && (
            <div className="shrink-0 hidden sm:block">
              <Picture picture={basics.picture} size={76} />
            </div>
          )}
        </div>

        {/* Accent Underline Bar */}
        {activeHeaderStyle === "underline" && (
          <div
            className="w-full h-1 mt-2.5 rounded-full"
            style={{ backgroundColor: colors[2] }}
          />
        )}
      </header>

      {/* 2. Letter Meta Block: Date & Recipient */}
      <div className="space-y-1.5 mb-3.5 text-xs sm:text-[13px]">
        {/* Date */}
        <div className="font-semibold text-slate-500 tracking-wide">
          {formattedToday}
        </div>

        {/* Recipient Info */}
        <div className="space-y-0.5 font-medium text-slate-700">
          <div className="font-bold text-slate-900">
            {recipient.name || "Hiring Team"}
          </div>
          {recipient.title && <div className="text-slate-600">{recipient.title}</div>}
          {companyName && <div className="font-semibold text-slate-800">{companyName}</div>}
          {recipient.address && <div className="text-slate-500">{recipient.address}</div>}
        </div>
      </div>

      {/* 3. Salutation & Letter Body */}
      <main className="text-xs sm:text-[13.5px] leading-[1.62]">
        {/* Salutation */}
        <div className="font-bold text-slate-900 mb-2.5">{salutation}</div>

        {/* Letter Body Paragraphs */}
        {coverLetter.bodyHtml ? (
          <div
            className="cover-letter-body max-w-none text-slate-800 text-[13px] sm:text-[13.5px] leading-[1.62] text-justify sm:text-left [&>p]:mb-2.5 [&>p]:mt-0 [&>p:last-child]:mb-0 [&>ul]:my-2 [&>ul]:pl-5 [&>ol]:my-2 [&>ol]:pl-5 [&>li]:my-0.5"
            dangerouslySetInnerHTML={{ __html: coverLetter.bodyHtml }}
          />
        ) : paragraphs.length > 0 ? (
          <div className="space-y-2.5 text-slate-800 text-[13px] sm:text-[13.5px] leading-[1.62] text-justify sm:text-left">
            {paragraphs.map((p, idx) => (
              <p key={idx}>
                {p}
              </p>
            ))}
          </div>
        ) : (
          <div className="p-8 border-2 border-dashed border-purple-200 rounded-2xl bg-purple-50/50 text-center space-y-3 my-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto text-lg font-bold">
              ✉️
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                No Cover Letter Generated Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Open the <strong>Cover Letter</strong> drawer on the left, paste the job description, and click <strong>Generate Cover Letter</strong> to create a personalized letter that matches your resume.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* 4. Formal Sign-off & Signature Block */}
      <footer className="pt-3 mt-3 border-t border-slate-200/80 text-xs sm:text-[13px] space-y-1.5">
        <div className="text-slate-700">{signOff}</div>
        <div className="space-y-0.5">
          <div
            className="text-base sm:text-lg font-bold tracking-tight"
            style={{ color: colors[2] }}
          >
            {candidateName}
          </div>
          {basics.headline && (
            <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
              {basics.headline}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default MatchedCoverLetter;
