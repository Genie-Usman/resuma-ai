import { useEffect, useRef, useState } from "react";
import ResumeHeader from "../ResumeSections/Kakuna/ResumeHeader.jsx";
import Summary from "../ResumeSections/Kakuna/Summary";
import Experience from "../ResumeSections/Kakuna/Experience";
import Education from "../ResumeSections/Kakuna/Education";
import Skills from "../ResumeSections/Kakuna/Skills";
import Projects from "../ResumeSections/Kakuna/Projects";
import Languages from "../ResumeSections/Kakuna/Languages";
import Interests from "../ResumeSections/Kakuna/Interests";
import Certifications from "../ResumeSections/Kakuna/Certifications";
import Awards from "../ResumeSections/Kakuna/Awards";
import Publications from "../ResumeSections/Kakuna/Publications";
import Volunteer from "../ResumeSections/Kakuna/Volunteer";
import References from "../ResumeSections/Kakuna/References";

const DEFAULT_THEME = ['#ffffff', '#000000', '#57534E']

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

const Kakuna = ({ basics = {}, sections = {}, metadata = {}, isFirstPage = false, containerWidth, colorPalette }) => {

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
            className="p-4 space-y-4"
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
                <ResumeHeader basics={basics} themeColors={themeColors} sections={sections} />
            )}

            <div className="space-y-4">
                {mainIds.map((key) =>
                    mapSectionToComponent(key, sections[key], key, themeColors)
                )}
                {sidebarIds.map((key) =>
                    mapSectionToComponent(key, sections[key], key, themeColors)
                )}
            </div>
        </div>
    );
};

export default Kakuna;