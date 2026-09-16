import { useEffect, useRef, useState } from "react";
import ResumeHeader from "../ResumeSections/Clarity/ResumeHeader.jsx";
import PersonalInfo from "../ResumeSections/Clarity/PersonalInfo.jsx";
import Profiles from "../ResumeSections/Clarity/Profiles.jsx";
import Summary from "../ResumeSections/Clarity/Summary.jsx";
import Experience from "../ResumeSections/Clarity/Experience.jsx";
import Education from "../ResumeSections/Clarity/Education.jsx";
import Skills from "../ResumeSections/Clarity/Skills.jsx";
import Projects from "../ResumeSections/Clarity/Projects.jsx";
import Languages from "../ResumeSections/Clarity/Languages.jsx";
import Interests from "../ResumeSections/Clarity/Interests.jsx";
import Certifications from "../ResumeSections/Clarity/Certifications.jsx";
import Awards from "../ResumeSections/Clarity/Awards.jsx";
import Publications from "../ResumeSections/Clarity/Publications.jsx";
import Volunteer from "../ResumeSections/Clarity/Volunteer.jsx";
import References from "../ResumeSections/Clarity/References.jsx";
import { extractLayoutColumns } from "../../utils/layoutUtils";

const DEFAULT_THEME = ["#ffffff", "#1e293b", "#1e293b"];

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

const Clarity = ({
  basics = {},
  sections = {},
  metadata = {},
  isFirstPage = false,
  containerWidth,
  colorPalette,
}) => {
  const themeColors = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME;

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
    "clarity"
  );

  const leftSidebarKeys = sidebarKeys.filter(
    (k) => k !== "personal-info" && k !== "summary"
  );
  const rightMainKeys = mainKeys.filter((k) => k !== "summary");

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
        className="w-full min-h-[1056px] flex flex-col overflow-hidden select-none shadow-sm transition-colors"
        style={{
          backgroundColor: themeColors[0] || "#ffffff",
          color: themeColors[1] || "#1e293b",
          fontFamily: "inherit",
        }}
      >
        {/* Full-Width Top Header with Integrated Summary & Profile Picture */}
        <ResumeHeader
          basics={basics}
          themeColors={themeColors}
          summarySection={sections.summary}
        />

        {/* 2-Column Body Layout below Header/Summary */}
        <div className="flex-1 flex flex-row px-8 pb-8 gap-8">
          {/* Left Column (~33% width) */}
          <div className="w-56 sm:w-64 shrink-0 space-y-4">
            {/* Personal Info Stack (Address, Phone, Email, LinkedIn) */}
            <PersonalInfo basics={basics} themeColors={themeColors} />

            {/* Left Column Sections (Skills, Software, Languages) */}
            {leftSidebarKeys.map((key, i) =>
              mapSectionToComponent(
                key,
                sections[key],
                `clarity-col0-${key}-${i}`,
                themeColors,
                basics
              )
            )}
          </div>

          {/* Right Column (~67% width) with Horizontal Header Lines */}
          <div className="flex-1 min-w-0 space-y-4">
            {rightMainKeys.map((key, i) =>
              mapSectionToComponent(
                key,
                sections[key],
                `clarity-col1-${key}-${i}`,
                themeColors,
                basics
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clarity;
