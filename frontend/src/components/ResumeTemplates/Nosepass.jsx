import { useEffect, useRef, useState } from "react";
import EUROPASS from '../../assets/europass.png'
import ResumeHeader from "../ResumeSections/Nosepass/ResumeHeader.jsx";
import Summary from "../ResumeSections/Nosepass/Summary";
import Profiles from "../ResumeSections/Nosepass/Profiles";
import Experience from "../ResumeSections/Nosepass/Experience";
import Education from "../ResumeSections/Nosepass/Education";
import Skills from "../ResumeSections/Nosepass/Skills";
import Projects from "../ResumeSections/Nosepass/Projects";
import Languages from "../ResumeSections/Nosepass/Languages";
import Interests from "../ResumeSections/Nosepass/Interests";
import Certifications from "../ResumeSections/Nosepass/Certifications";
import Awards from "../ResumeSections/Nosepass/Awards";
import Publications from "../ResumeSections/Nosepass/Publications";
import Volunteer from "../ResumeSections/Nosepass/Volunteer";
import References from "../ResumeSections/Nosepass/References";

const DEFAULT_THEME = ['#ffffff', '#000000', '#7B4F1A']

const components = {
    summary: Summary,
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

const Nosepass = ({ basics = {}, sections = {}, metadata = {}, isFirstPage = false, containerWidth, colorPalette }) => {

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
            className="p-5 space-y-6"
            style={{
                backgroundColor: themeColors[0],
                color: themeColors[1],
                transform: containerWidth > 0 ? `scale(${scale})` : "none",
                transformOrigin: "top left",
                width: containerWidth > 0 ? `${baseWidth}px` : "auto",
                height: "auto",
            }}
        >
            <div className="flex items-center justify-between">
                <img alt="Europass Logo" className="h-[42px]" src={EUROPASS} />
                <p className="font-medium" style={{ color: themeColors[2] }}>Curriculum Vitae</p>

                <p className="font-medium" style={{ color: themeColors[2] }}>{basics.name}</p>
            </div>

            {isFirstPage && (
                <ResumeHeader basics={basics} themeColors={themeColors} />
            )}

            <div className="space-y-4">
                {sidebarIds.map((key) =>
                    mapSectionToComponent(key, sections[key], key, themeColors)
                )}
                {mainIds.map((key) =>
                    mapSectionToComponent(key, sections[key], key, themeColors)
                )}
            </div>
        </div>
    );
};

export default Nosepass;