import { useEffect, useRef, useState } from "react";
import ResumeHeader from "../ResumeSections/Chikorita/ResumeHeader.jsx";
import Profiles from "../ResumeSections/Chikorita/Profiles";
import Summary from "../ResumeSections/Chikorita/Summary";
import Experience from "../ResumeSections/Chikorita/Experience";
import Education from "../ResumeSections/Chikorita/Education";
import Skills from "../ResumeSections/Chikorita/Skills";
import Projects from "../ResumeSections/Chikorita/Projects";
import Languages from "../ResumeSections/Chikorita/Languages";
import Interests from "../ResumeSections/Chikorita/Interests";
import Certifications from "../ResumeSections/Chikorita/Certifications";
import Awards from "../ResumeSections/Chikorita/Awards";
import Publications from "../ResumeSections/Chikorita/Publications";
import Volunteer from "../ResumeSections/Chikorita/Volunteer";
import References from "../ResumeSections/Chikorita/References";

// [Background, Text, Accent]
const DEFAULT_THEME = ['#ffffff', '#000000', '#059669']

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


const Chikorita = ({ basics = {}, sections = {}, metadata = {}, isFirstPage = false, containerWidth, colorPalette }) => {

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
                className={`main px-5 py-4 group space-y-4 ${sidebarIds.length > 0 ? "col-span-2" : "col-span-3"
                    }`}
            >
                {isFirstPage && (
                    <ResumeHeader basics={basics} themeColors={themeColors} />
                )}

                {mainIds.map((key) =>
                    mapSectionToComponent(key, sections[key], key, themeColors)
                )}
            </div>

            {sidebarIds.length > 0 && (
                <div 
                className="sidebar pl-3 py-5 group h-full space-y-4"
                style={{
                color: themeColors[1],
                backgroundColor: themeColors[2]
                }}
                >
                    {sidebarIds.map((key) =>
                        mapSectionToComponent(key, sections[key], key, themeColors)
                    )}
                </div>
            )}
        </div>
    );

};

export default Chikorita;