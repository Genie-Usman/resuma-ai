// Imports for all section components
import Profiles from "../components/ResumeSections/Profiles";
import Summary from "../components/ResumeSections/Summary";
import Experience from "../components/ResumeSections/Experience";
import Education from "../components/ResumeSections/Education";
import Awards from "../components/ResumeSections/Awards";
import Certifications from "../components/ResumeSections/Certifications";
import Skills from "../components/ResumeSections/Skills";
import Interests from "../components/ResumeSections/Interests";
import Publications from "../components/ResumeSections/Publications";
import Volunteer from "../components/ResumeSections/Volunteer";
import Languages from "../components/ResumeSections/Languages";
import Projects from "../components/ResumeSections/Projects";
import References from "../components/ResumeSections/References";

export const mapSectionToComponent = (key, section, reactKey, themeColors) => {
  const sectionComponentMap = {
    profiles: <Profiles section={section} themeColors={themeColors} />,
    summary: <Summary section={section} themeColors={themeColors} />,
    experience: <Experience section={section} themeColors={themeColors} />,
    education: <Education section={section} themeColors={themeColors} />,
    awards: <Awards section={section} themeColors={themeColors} />,
    certifications: <Certifications section={section} themeColors={themeColors} />,
    skills: <Skills section={section} themeColors={themeColors} />,
    interests: <Interests section={section} themeColors={themeColors} />,
    publications: <Publications section={section} themeColors={themeColors} />,
    volunteer: <Volunteer section={section} themeColors={themeColors} />,
    languages: <Languages section={section} themeColors={themeColors} />,
    projects: <Projects section={section} themeColors={themeColors} />,
    references: <References section={section} themeColors={themeColors} />,
  };

  return sectionComponentMap[key]
    ? <div key={reactKey}>{sectionComponentMap[key]}</div>
    : null;
};
