import { useEffect, useRef, useState } from "react";
import { hexToRgba } from "../../utils/helper.jsx";
import ResumeHeader from "../ResumeSections/Glalie/ResumeHeader.jsx";
import Profiles from "../ResumeSections/Glalie/Profiles";
import Summary from "../ResumeSections/Glalie/Summary";
import Experience from "../ResumeSections/Glalie/Experience";
import Education from "../ResumeSections/Glalie/Education";
import Skills from "../ResumeSections/Glalie/Skills";
import Projects from "../ResumeSections/Glalie/Projects";
import Languages from "../ResumeSections/Glalie/Languages.jsx";
import Interests from "../ResumeSections/Glalie/Interests";
import Certifications from "../ResumeSections/Glalie/Certifications";
import Awards from "../ResumeSections/Glalie/Awards";
import Publications from "../ResumeSections/Glalie/Publications";
import Volunteer from "../ResumeSections/Glalie/Volunteer";
import References from "../ResumeSections/Glalie/References";

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
const DEFAULT_THEME = ['#ffffff', '#000000', '#0D9488']

const Glalie = ({ basics = {}, sections = {}, metadata = {}, isFirstPage = false, containerWidth, colorPalette }) => {

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
                className={`sidebar p-5 group space-y-4${sidebarIds.length === 0 ? " hidden" : ""}`}

                style={{ backgroundColor: hexToRgba(themeColors[2], 0.25) }}
            >
                {isFirstPage && (
                    <ResumeHeader basics={basics} themeColors={themeColors} />
                )}
                {sidebarIds.map((key) =>
                    mapSectionToComponent(key, sections[key], key, themeColors)
                )}

            </div>
            <div
                className={`main group px-3 py-4 space-y-4 ${sidebarIds.length > 0 ? "col-span-2" : "col-span-3"}`}
            >
                {mainIds.map((key) =>
                    mapSectionToComponent(key, sections[key], key, themeColors)
                )}
            </div>
        </div>
    );
};

export default Glalie;