import { useEffect, useRef, useState } from "react";
import ResumeHeader from "../ResumeSections/Cascade/ResumeHeader.jsx";
import Profiles from "../ResumeSections/Cascade/Profiles.jsx";
import Summary from "../ResumeSections/Cascade/Summary.jsx";
import Experience from "../ResumeSections/Cascade/Experience.jsx";
import Education from "../ResumeSections/Cascade/Education.jsx";
import Skills from "../ResumeSections/Cascade/Skills.jsx";
import Projects from "../ResumeSections/Cascade/Projects.jsx";
import Languages from "../ResumeSections/Cascade/Languages.jsx";
import Interests from "../ResumeSections/Cascade/Interests.jsx";
import Certifications from "../ResumeSections/Cascade/Certifications.jsx";
import Awards from "../ResumeSections/Cascade/Awards.jsx";
import Publications from "../ResumeSections/Cascade/Publications.jsx";
import Volunteer from "../ResumeSections/Cascade/Volunteer.jsx";
import References from "../ResumeSections/Cascade/References.jsx";

// Default Theme: [Background, Text, Primary/Sidebar Accent]
const DEFAULT_THEME = ["#ffffff", "#1e293b", "#1a365d"];

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

  // Roadmap 3.1: Custom Section Archetype Dispatcher
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

const Cascade = ({
  basics = {},
  sections = {},
  metadata = {},
  isFirstPage = false,
  containerWidth,
  colorPalette,
}) => {
  const themeColors =
    colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME;

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

  // Layout normalization: 2 columns [mainIds, sidebarIds]
  const [layout] = Array.isArray(metadata?.layout)
    ? metadata.layout
    : [[[], []]];
  const mainIds = Array.isArray(layout?.[0]) ? layout[0] : [];
  const sidebarIds = Array.isArray(layout?.[1]) ? layout[1] : [];

  const hasSidebar = sidebarIds.length > 0;

  return (
    <div
      ref={resumeRef}
      className="grid min-h-full print:min-h-0 grid-cols-12 text-left"
      style={{
        backgroundColor: themeColors[0],
        color: themeColors[1],
        transform: containerWidth > 0 ? `scale(${scale})` : "none",
        transformOrigin: "top left",
        width: containerWidth > 0 ? `${baseWidth}px` : "100%",
        height: "100%",
      }}
    >
      {/* Left Sidebar (Solid Accent Color) */}
      {hasSidebar && (
        <aside
          className="sidebar group col-span-4 flex flex-col min-h-full pb-6"
          style={{
            backgroundColor: themeColors[2] || "#1a365d",
            color: "#ffffff",
          }}
        >
          {isFirstPage && (
            <ResumeHeader basics={basics} themeColors={themeColors} />
          )}

          <div className="flex-1 space-y-3">
            {sidebarIds.map((key) =>
              mapSectionToComponent(
                key,
                sections[key],
                key,
                themeColors,
                basics
              )
            )}
          </div>
        </aside>
      )}

      {/* Right Main Column (White Clean Background) */}
      <main
        className={`main group py-6 px-6 sm:px-7 space-y-4 min-h-full ${
          hasSidebar ? "col-span-8" : "col-span-12"
        }`}
        style={{
          backgroundColor: themeColors[0],
          color: themeColors[1],
        }}
      >
        {mainIds.map((key) =>
          mapSectionToComponent(
            key,
            sections[key],
            key,
            themeColors,
            basics
          )
        )}
      </main>
    </div>
  );
};

export default Cascade;
