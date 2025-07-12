import { useEffect, useRef, useState } from "react";
import ResumeHeader from "../ResumeSections/Gengar/ResumeHeader.jsx";
import { hexToRgba } from "../../utils/helper.jsx";
import Profiles from "../ResumeSections/Gengar/Profiles";
import Summary from "../ResumeSections/Gengar/Summary";
import Experience from "../ResumeSections/Gengar/Experience";
import Education from "../ResumeSections/Gengar/Education";
import Skills from "../ResumeSections/Gengar/Skills";
import Projects from "../ResumeSections/Gengar/Projects";
import Languages from "../ResumeSections/Gengar/Languages";
import Interests from "../ResumeSections/Gengar/Interests";
import Certifications from "../ResumeSections/Gengar/Certifications";
import Awards from "../ResumeSections/Gengar/Awards";
import Publications from "../ResumeSections/Gengar/Publications";
import Volunteer from "../ResumeSections/Gengar/Volunteer";
import References from "../ResumeSections/Gengar/References";

const components = {
    profiles: Profiles,
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

// [Background, Text, Accent]

const mapSectionToComponent = (key, section, reactKey, themeColors) => {
    if (!section?.visible) return null;

    const usesItems = ['profiles', 'experience', 'education', 'awards', 'certifications', 'skills', 'interests', 'publications', 'volunteer', 'languages', 'projects', 'references'];

    if (usesItems.includes(key) && !section.items?.length) return null;

    const Component = components[key];
    return Component ? (
        <div key={reactKey}>
            <Component section={section} themeColors={themeColors} />
        </div>
    ) : null;
};

// [Background, Text, Accent]
const DEFAULT_THEME = ['#ffffff', '#000000', '#0891B2']

const Gengar = ({ basics = {}, sections = {}, metadata = {}, isFirstPage = false, containerWidth, colorPalette }) => {

    const themeColors = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME;

    const resumeRef = useRef();
    const [baseWidth, setBaseWidth] = useState(800);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const actualBaseWidth = resumeRef.current.offsetWidth;
        setBaseWidth(actualBaseWidth);
        setScale(containerWidth / actualBaseWidth);
    }, [containerWidth]);

    const [layout] = Array.isArray(metadata.layout) ? metadata.layout : [[]];
    const mainIds = Array.isArray(layout[0]) ? layout[0] : [];
    const sidebarIds = Array.isArray(layout[1]) ? layout[1] : [];

    return (
        <div
            ref={resumeRef}
            className="grid min-h-[inherit] grid-cols-3"
            style={{
                backgroundColor: themeColors[0],
                color: themeColors[1],
                transform: containerWidth > 0 ? `scale(${scale})` : "none",
                transformOrigin: "top left",
                width: containerWidth > 0 ? `${baseWidth}px` : "auto",
                height: "auto",
            }}
        >
            <div
                className={
                    "sidebar group flex flex-col" +
                    (!(isFirstPage || sidebarIds.length > 0) ? " hidden" : "")
                }
            >
                {isFirstPage && (
                    <ResumeHeader basics={basics} themeColors={themeColors} />
                )}
                <div
                    className="p-5 flex-1 space-y-4"
                    style={{ backgroundColor: hexToRgba(themeColors[2], 0.25) }}
                >
                    {sidebarIds.map((key) =>
                        mapSectionToComponent(key, sections[key], key, themeColors)
                    )}
                </div>
            </div>

            <div className={`main group ${sidebarIds.length > 0 ? "col-span-2" : "col-span-3"}`}>
                {isFirstPage && sections.summary?.visible && (
                    <Summary section={sections.summary} themeColors={themeColors} />
                )}
                <div className="py-4 px-4 space-y-4">
                    {mainIds.map((key) =>
                        mapSectionToComponent(key, sections[key], key, themeColors)
                    )}
                </div>
            </div>
        </div>
    );
};

export default Gengar;