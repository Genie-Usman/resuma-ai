import { useEffect, useRef, useState } from "react";
import ResumeHeader from "../ResumeSections/Onyx/ResumeHeader.jsx";
import Summary from "../ResumeSections/Onyx/Summary";
import Experience from "../ResumeSections/Onyx/Experience";
import Education from "../ResumeSections/Onyx/Education";
import Skills from "../ResumeSections/Onyx/Skills";
import Projects from "../ResumeSections/Onyx/Projects";
import Languages from "../ResumeSections/Onyx/Languages";
import Interests from "../ResumeSections/Onyx/Interests";
import Certifications from "../ResumeSections/Onyx/Certifications";
import Awards from "../ResumeSections/Onyx/Awards";
import Publications from "../ResumeSections/Onyx/Publications";
import Volunteer from "../ResumeSections/Onyx/Volunteer";
import References from "../ResumeSections/Onyx/References";

const DEFAULT_THEME = ['#ffffff', '#000000', '#7B4F1A']

const components = {
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

    const Component = components[key];
    return Component ? (
        <div key={reactKey}>
            <Component section={section} themeColors={themeColors} />
        </div>
    ) : null;
};

const Onyx = ({ basics = {}, sections = {}, metadata = {}, isFirstPage = false, containerWidth, colorPalette }) => {

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
            className="p-5 space-y-4"
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
                <ResumeHeader basics={basics} themeColors={themeColors} sections={sections}/>
            )}

            {sidebarIds.map((key) =>
                mapSectionToComponent(key, sections[key], key, themeColors)
            )}

            {mainIds.map((key) =>
                mapSectionToComponent(key, sections[key], key, themeColors)
            )}
        </div>
    );
};

export default Onyx;