import { useEffect, useRef, useState } from "react";
import { DUMMY_RESUME_DATA, RESUME_TEMPLATES, THEME_COLOR_PALETTE } from "../../utils/data";
import { LuCircleCheckBig } from "react-icons/lu";
import Tabs from "../../components/shared/Tabs";
import TemplateCard from "../../components/Cards/TemplateCard";
import ColorPaletteCard from "../../components/Cards/ColorPaletteCard";
import RenderResume from "../../components/ResumeTemplates/RenderResume";

const TAB_DATA = [{ label: "Templates" }, { label: "Color Palettes" }];

const ThemeSelector = ({ selectedTheme, setSelectedTheme, setResumeData, resumeData, onClose }) => {
  const resumeRef = useRef();
  const [baseWidth, setBaseWidth] = useState(800);
  const [tabValue, setTabValue] = useState("Templates");

  const currentTemplate = resumeData?.metadata?.template || RESUME_TEMPLATES[0].id;
  const currentTheme = resumeData?.metadata?.theme || {};
  const currentColors = [currentTheme.background, currentTheme.text, currentTheme.primary];

  const [selectedTemplate, setSelectedTemplate] = useState({
    template: currentTemplate,
    index: RESUME_TEMPLATES.findIndex(t => t.id === currentTemplate)
  });

  const [selectedColorPalette, setSelectedColorPalette] = useState(() => {
    const defaultName = Object.keys(THEME_COLOR_PALETTE)[0];
    const foundEntry = Object.entries(THEME_COLOR_PALETTE).find(
      ([, colors]) => JSON.stringify(colors) === JSON.stringify(currentColors)
    );

    const name = foundEntry?.[0] || defaultName;
    const colors = foundEntry?.[1] || THEME_COLOR_PALETTE[defaultName];
    const index = Object.keys(THEME_COLOR_PALETTE).indexOf(name);

    return { name, colors, index };
  });

  const handleThemeSelection = () => {
    const [background, text, primary] = selectedColorPalette.colors;

    // 1. Update resumeData
    setResumeData((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        metadata: {
          ...prev.data.metadata,
          template: selectedTemplate.template,
          theme: { background, text, primary }
        }
      }
    }));

    // 2. Update selectedTheme (if needed elsewhere)
    setSelectedTheme({
      template: selectedTemplate.template,
      colorPalette: {
        name: selectedColorPalette.name,
        colors: selectedColorPalette.colors
      }
    });

    onClose();
  };

  const updateBaseWidth = () => {
    if (resumeRef.current) {
      setBaseWidth(resumeRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    updateBaseWidth();
    window.addEventListener("resize", updateBaseWidth);
    return () => window.removeEventListener("resize", updateBaseWidth);
  }, []);

  return (
    <div className="container mx-auto px-2 md:px-0">
      <div className="flex items-center justify-between mb-5 mt-2">
        <Tabs tabs={TAB_DATA} activeTab={tabValue} setActiveTab={setTabValue} />

        <button className="btn-small-light" onClick={handleThemeSelection}>
          <LuCircleCheckBig className="text-base" />
          Done
        </button>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-5 bg-white">
          <div className="grid grid-cols-2 gap-5 max-h-[80vh] overflow-y-scroll custom-scrollbar md:pr-5">
            {tabValue === "Templates" &&
              RESUME_TEMPLATES.map((template, index) => (
                <TemplateCard
                  key={`template_${index}`}
                  thumbnail={template.thumbnail}
                  name={template.id}
                  isSelected={selectedTemplate.template === template.id}
                  onSelect={() => setSelectedTemplate({ template: template.id, index })}
                />
              ))}

            {tabValue === "Color Palettes" &&
              Object.entries(THEME_COLOR_PALETTE).map(([name, colors], index) => (
                <ColorPaletteCard
                  key={`palette_${index}`}
                  name={name}
                  colors={colors}
                  isSelected={selectedColorPalette.index === index}
                  onSelect={() => setSelectedColorPalette({ name, colors, index })}
                />
              ))}
          </div>
        </div>

        <div className="col-span-12 md:col-span-7 bg-white -mt-3" ref={resumeRef}>
          <RenderResume
            templateId={selectedTemplate.template}
            resumeData={resumeData || DUMMY_RESUME_DATA}
            containerWidth={baseWidth}
            colorPalette={selectedColorPalette.colors}
          />
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
