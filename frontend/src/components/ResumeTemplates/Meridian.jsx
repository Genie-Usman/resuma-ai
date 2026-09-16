import { useEffect, useRef, useState } from "react";
import ResumeHeader from "../ResumeSections/Meridian/ResumeHeader.jsx";
import Profiles from "../ResumeSections/Meridian/Profiles.jsx";
import Summary from "../ResumeSections/Meridian/Summary.jsx";
import Experience from "../ResumeSections/Meridian/Experience.jsx";
import Education from "../ResumeSections/Meridian/Education.jsx";
import Skills from "../ResumeSections/Meridian/Skills.jsx";
import Projects from "../ResumeSections/Meridian/Projects.jsx";
import Languages from "../ResumeSections/Meridian/Languages.jsx";
import Interests from "../ResumeSections/Meridian/Interests.jsx";
import Certifications from "../ResumeSections/Meridian/Certifications.jsx";
import Awards from "../ResumeSections/Meridian/Awards.jsx";
import Publications from "../ResumeSections/Meridian/Publications.jsx";
import Volunteer from "../ResumeSections/Meridian/Volunteer.jsx";
import References from "../ResumeSections/Meridian/References.jsx";
import { extractLayoutColumns } from "../../utils/layoutUtils";

// Default Theme: [Background, Text, Accent / Sidebar]
const DEFAULT_THEME = ["#ffffff", "#1e293b", "#0d2f5a"];

const components = {
  profiles: Profiles,
  summary: Summary,
  experience: Experience,
  education: Education,
  skills: Skills,
  projects: Projects,
  languages: Languages,
  interests: Interests,
  certifications: Certifications,
  awards: Awards,
  publications: Publications,
  volunteer: Volunteer,
  references: References,
};

const mapSectionToComponent = (key, section, reactKey, themeColors, basics) => {
  if (!section?.visible) return null;

  const usesItems = [
    "experience",
    "education",
    "awards",
    "certifications",
    "skills",
    "interests",
    "publications",
    "volunteer",
    "languages",
    "projects",
    "references",
  ];

  if (usesItems.includes(key) && !section.items?.length) return null;

  let Component = components[key];

  if (!Component && (section?.isCustom || (key && key.startsWith("custom_")))) {
    if (!section?.items?.length) return null;
    const typeMap = {
      timeline: components.experience,
      simple_list: components.awards,
      publications: components.publications,
      language_matrix: components.languages,
    };
    Component = typeMap[section.type] || components.experience;
  }

  return Component ? (
    <div key={reactKey} className="w-full">
      <Component
        section={section}
        themeColors={themeColors}
        basics={basics}
      />
    </div>
  ) : null;
};

const Meridian = ({
  basics = {},
  sections = {},
  metadata = {},
  isFirstPage = false,
  containerWidth,
  colorPalette,
}) => {
  const themeColors = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME;
  const primaryColor = themeColors[2] || DEFAULT_THEME[2];

  const resumeRef = useRef();
  const [baseWidth, setBaseWidth] = useState(800);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (resumeRef.current) {
      const actualBaseWidth = resumeRef.current.offsetWidth;
      setBaseWidth(actualBaseWidth);
      if (containerWidth > 0) {
        setScale(containerWidth / actualBaseWidth);
      }
    }
  }, [containerWidth]);

  // Safely extract main and sidebar columns from metadata.layout
  const [mainKeys, sidebarKeys] = extractLayoutColumns(
    metadata?.layout,
    sections,
    "meridian"
  );

  // Combined continuous timeline sections (main history first, then skills/other sections)
  const combinedSections = [
    ...mainKeys.filter((k) => k !== "summary"),
    ...sidebarKeys.filter((k) => k !== "summary" && !mainKeys.includes(k)),
  ];

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : "100%",
      }}
      className="transition-transform duration-100 ease-out origin-top-left"
    >
      <div
        ref={resumeRef}
        className="relative w-full min-h-[1056px] flex flex-col overflow-hidden select-none shadow-sm pb-8 transition-colors"
        style={{
          backgroundColor: themeColors[0] || "#ffffff",
          color: themeColors[1] || "#1e293b",
          fontFamily: "inherit",
        }}
      >
        {/* Left Solid Dark Accent Spine across full page height */}
        <div
          className="absolute top-0 bottom-0 left-0 w-24 sm:w-32 pointer-events-none z-0 transition-colors"
          style={{ backgroundColor: primaryColor }}
        />

        {/* Top Header & Summary aligned to main content area */}
        <div className="relative z-10 pl-24 sm:pl-32">
          <ResumeHeader basics={basics} themeColors={themeColors} />

          {sections.summary?.visible && (
            <div className="px-6 pb-2">
              <Summary section={sections.summary} themeColors={themeColors} />
            </div>
          )}
        </div>

        {/* Continuous Timeline Sections */}
        <div className="relative z-10 flex-1 space-y-2 pt-2">
          {combinedSections.map((key, i) =>
            mapSectionToComponent(
              key,
              sections[key],
              `meridian-section-${key}-${i}`,
              themeColors,
              basics
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Meridian;
