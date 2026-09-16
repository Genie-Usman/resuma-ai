import { useEffect, useRef, useState } from "react";
import ResumeHeader from "../ResumeSections/Vanguard/ResumeHeader.jsx";
import PersonalInfo from "../ResumeSections/Vanguard/PersonalInfo.jsx";
import Profiles from "../ResumeSections/Vanguard/Profiles.jsx";
import Summary from "../ResumeSections/Vanguard/Summary.jsx";
import Experience from "../ResumeSections/Vanguard/Experience.jsx";
import Education from "../ResumeSections/Vanguard/Education.jsx";
import Skills from "../ResumeSections/Vanguard/Skills.jsx";
import Projects from "../ResumeSections/Vanguard/Projects.jsx";
import Languages from "../ResumeSections/Vanguard/Languages.jsx";
import Interests from "../ResumeSections/Vanguard/Interests.jsx";
import Certifications from "../ResumeSections/Vanguard/Certifications.jsx";
import Awards from "../ResumeSections/Vanguard/Awards.jsx";
import Publications from "../ResumeSections/Vanguard/Publications.jsx";
import Volunteer from "../ResumeSections/Vanguard/Volunteer.jsx";
import References from "../ResumeSections/Vanguard/References.jsx";
import { extractLayoutColumns } from "../../utils/layoutUtils";

const DEFAULT_THEME = ["#ffffff", "#1e293b", "#2d3748"];

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

const Vanguard = ({
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
    "vanguard"
  );

  // Left column (main narrative history): Summary, Experience, Education, Projects, Certifications
  const leftColumnKeys = mainKeys.includes("summary")
    ? mainKeys
    : sections.summary?.visible
    ? ["summary", ...mainKeys]
    : mainKeys;

  // Right column (sidebar): Personal Info, Skills, Languages, Profiles, Interests, References, Awards
  const rightColumnKeys = sidebarKeys.filter(
    (k) => k !== "personal-info" && k !== "summary"
  );

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
        {/* Full-Width Dark Charcoal / Primary Accent Header Banner */}
        <ResumeHeader basics={basics} themeColors={themeColors} />

        {/* 2-Column Body Layout */}
        <div className="flex-1 flex flex-row">
          {/* Left Column: White Narrative History (~68% width) */}
          <div className="flex-1 min-w-0 p-8 space-y-4">
            {leftColumnKeys.map((key, i) =>
              mapSectionToComponent(
                key,
                sections[key],
                `vanguard-col0-${key}-${i}`,
                themeColors,
                basics
              )
            )}
          </div>

          {/* Right Column: Tinted Cool Gray Sidebar (~32% width) */}
          <div className="w-60 sm:w-72 shrink-0 bg-slate-50/70 border-l border-slate-200/80 p-6 space-y-4">
            {/* Personal Info with Address, Phone, Email, LinkedIn */}
            <PersonalInfo basics={basics} themeColors={themeColors} />

            {/* Right Column Sections */}
            {rightColumnKeys.map((key, i) =>
              mapSectionToComponent(
                key,
                sections[key],
                `vanguard-col1-${key}-${i}`,
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

export default Vanguard;
