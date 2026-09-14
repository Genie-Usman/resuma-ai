import { useEffect, useRef, useState } from "react";
import ResumeHeader from "../ResumeSections/Bronzor/ResumeHeader.jsx";
import Profiles from "../ResumeSections/Bronzor/Profiles";
import Summary from "../ResumeSections/Bronzor/Summary";
import Experience from "../ResumeSections/Bronzor/Experience";
import Education from "../ResumeSections/Bronzor/Education";
import Skills from "../ResumeSections/Bronzor/Skills";
import Projects from "../ResumeSections/Bronzor/Projects";
import Languages from "../ResumeSections/Bronzor/Languages";
import Interests from "../ResumeSections/Bronzor/Interests";
import Certifications from "../ResumeSections/Bronzor/Certifications";
import Awards from "../ResumeSections/Bronzor/Awards";
import Publications from "../ResumeSections/Bronzor/Publications";
import Volunteer from "../ResumeSections/Bronzor/Volunteer";
import References from "../ResumeSections/Bronzor/References";

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

const mapSectionToComponent = (key, section, reactKey, themeColors) => {
    if (!section?.visible) return null;

    const usesItems = ['profiles', 'experience', 'education', 'awards', 'certifications', 'skills', 'interests', 'publications', 'volunteer', 'languages', 'projects', 'references'];

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
        <div key={reactKey}>
            <Component section={section} themeColors={themeColors} />
        </div>
    ) : null;
};

const Bronzor = ({ basics = {}, sections = {}, metadata = {}, isFirstPage = false, containerWidth, colorPalette }) => {

    const themeColors = colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME;

    const resumeRef = useRef();
    const [baseWidth, setBaseWidth] = useState(800);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        if (resumeRef.current) {
            const actualBaseWidth = resumeRef.current.offsetWidth;
            setBaseWidth(actualBaseWidth);
            setScale(containerWidth / actualBaseWidth);
        }
    }, [containerWidth]);

    const [layout] = Array.isArray(metadata.layout) ? metadata.layout : [[]];
    const mainIds = Array.isArray(layout[0]) ? layout[0] : [];
    const sidebarIds = Array.isArray(layout[1]) ? layout[1] : [];
    const sectionIds = sidebarIds.length === 0 ? mainIds : [...mainIds, ...sidebarIds];

    return (
        <div
            ref={resumeRef}
            className="py-5 px-1 space-y-3 min-h-0 print:min-h-0"
            style={{
                backgroundColor: themeColors[0],
                color: themeColors[1],
                transform: containerWidth > 0 ? `scale(${scale})` : "none",
                transformOrigin: "top left",
                width: containerWidth > 0 ? `${baseWidth}px` : "auto",
                height: "auto",
            }}
        >
            {isFirstPage && (
                <ResumeHeader basics={basics} themeColors={themeColors} profiles={sections?.profiles?.items} sections={sections} />
            )}

            <div className='space-y-4 px-3'>
                {sectionIds.map((key) =>
                    mapSectionToComponent(key, sections[key], key, themeColors)
                )}
            </div>
        </div>
    );
};

export default Bronzor;