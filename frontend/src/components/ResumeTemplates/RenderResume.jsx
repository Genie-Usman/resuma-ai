import { useMemo, useEffect } from 'react';
import { loadGoogleFont, getFontFallback, DEFAULT_FONT } from '../../utils/googleFonts';
import Azurill from './Azurill';
import Bronzor from './Bronzor';
import Chikorita from './Chikorita';
import Ditto from './Ditto';
import Gengar from './Gengar';
import Glalie from './Glalie';
import Kakuna from './Kakuna';
import Leafish from './Leafish';
import Nosepass from './Nosepass';
import Onyx from './Onyx';
import Pikachu from './Pikachu';
import Rhyhorn from './Rhyhorn';
import Cascade from './Cascade';
import { normalizeLayout } from '../../utils/layoutUtils';

const RenderResume = ({ templateId, resumeData, colorPalette, containerWidth }) => {
  const data = resumeData?.data || resumeData || {};
  const { basics, sections, metadata } = data;

  if (!basics || !sections || !metadata) {
    return <div>No resume data found</div>;
  }

  const themeColors = useMemo(() => {
    return colorPalette?.length
      ? colorPalette
      : [metadata.theme?.background, metadata.theme?.text, metadata.theme?.primary];
  }, [colorPalette, metadata.theme?.background, metadata.theme?.text, metadata.theme?.primary]);

  // Self-healing layout normalization: guarantees [ [ col0, col1 ] ] for all templates
  const safeMetadata = useMemo(() => ({
    ...metadata,
    layout: normalizeLayout(metadata?.layout, sections, templateId),
  }), [metadata, sections, templateId]);

  // Sanitize dates (prevent duplicate - Present), bullets, and enforce single-column in sidebars
  const safeSections = useMemo(() => {
    if (!sections) return {};
    const formatted = { ...sections };

    // Enforce: Any section placed in the sidebar MUST be single-column ("one in a line").
    // Narrow sidebars (~250px) cannot fit 2 columns without broken text-wrapping and layout collapse.
    const [layout] = Array.isArray(safeMetadata?.layout) ? safeMetadata.layout : [[]];
    const sidebarIds = Array.isArray(layout?.[1]) ? layout[1] : [];

    sidebarIds.forEach((key) => {
      if (formatted[key]) {
        formatted[key] = {
          ...formatted[key],
          columns: 1,
        };
      }
    });

    if (formatted.experience?.items) {
      formatted.experience = {
        ...formatted.experience,
        items: formatted.experience.items.map((item) => {
          if (!item) return item;
          return {
            ...item,
            date: (item.date || "").replace(/(\s*[-–—]\s*Present)+/gi, " - Present"),
            summary: (item.summary || "").replace(/([^\n>])\s*•/g, "$1<br>• "),
          };
        }),
      };
    }

    if (formatted.education?.items) {
      formatted.education = {
        ...formatted.education,
        items: formatted.education.items.map((item) => {
          if (!item) return item;
          return {
            ...item,
            date: (item.date || "").replace(/(\s*[-–—]\s*Present)+/gi, " - Present"),
            summary: (item.summary || "").replace(/([^\n>])\s*•/g, "$1<br>• "),
          };
        }),
      };
    }

    if (formatted.projects?.items) {
      formatted.projects = {
        ...formatted.projects,
        items: formatted.projects.items.map((item) => {
          if (!item) return item;
          return {
            ...item,
            summary: (item.summary || item.description || "").replace(/([^\n>])\s*•/g, "$1<br>• "),
          };
        }),
      };
    }

    // Sanitize custom sections (Roadmap 3.1)
    Object.keys(formatted).forEach((k) => {
      const sec = formatted[k];
      if (sec && (sec.isCustom || k.startsWith("custom_")) && Array.isArray(sec.items)) {
        if (sec.type === "timeline") {
          formatted[k] = {
            ...sec,
            items: sec.items.map((item) => {
              if (!item) return item;
              return {
                ...item,
                company: item.company || item.organization || item.subtitle || "",
                position: item.position || item.title || item.role || "",
                date: (item.date || "").replace(/(\s*[-–—]\s*Present)+/gi, " - Present"),
                summary: (item.summary || "").replace(/([^\n>])\s*•/g, "$1<br>• "),
              };
            }),
          };
        } else if (sec.type === "simple_list") {
          formatted[k] = {
            ...sec,
            items: sec.items.map((item) => {
              if (!item) return item;
              return {
                ...item,
                name: item.name || item.title || "",
                awarder: item.awarder || item.issuer || item.subtitle || "",
              };
            }),
          };
        } else if (sec.type === "publications") {
          formatted[k] = {
            ...sec,
            items: sec.items.map((item) => {
              if (!item) return item;
              return {
                ...item,
                name: item.name || item.title || "",
                publisher: item.publisher || item.journal || item.organization || "",
              };
            }),
          };
        }
      }
    });

    return formatted;
  }, [sections, safeMetadata]);

  const activeFont = safeMetadata?.typography?.font?.family || safeMetadata?.fontFamily || DEFAULT_FONT;

  useEffect(() => {
    if (activeFont) {
      loadGoogleFont(activeFont);
    }
  }, [activeFont]);

  const sharedProps = {
    basics,
    sections: safeSections,
    metadata: safeMetadata,
    isFirstPage: true,
    containerWidth,
    colorPalette: themeColors
  };

  const renderTemplateComponent = () => {
    switch (templateId) {
      case 'azurill': return <Azurill {...sharedProps} />;
      case 'bronzor': return <Bronzor {...sharedProps} />;
      case 'chikorita': return <Chikorita {...sharedProps} />;
      case 'ditto': return <Ditto {...sharedProps} />;
      case 'gengar': return <Gengar {...sharedProps} />;
      case 'glalie': return <Glalie {...sharedProps} />;
      case 'kakuna': return <Kakuna {...sharedProps} />;
      case 'leafish': return <Leafish {...sharedProps} />;
      case 'nosepass': return <Nosepass {...sharedProps} />;
      case 'onyx': return <Onyx {...sharedProps} />;
      case 'pikachu': return <Pikachu {...sharedProps} />;
      case 'rhyhorn': return <Rhyhorn {...sharedProps} />;
      case 'cascade': return <Cascade {...sharedProps} />;
      default: return <Azurill {...sharedProps} />;
    }
  };

  const activeDensity =
    safeMetadata?.typography?.density ||
    safeMetadata?.density ||
    "normal";

  const densityClass =
    activeDensity === "compact"
      ? "resume-density-compact"
      : activeDensity === "spacious"
      ? "resume-density-spacious"
      : "resume-density-normal";

  const activeMargin =
    safeMetadata?.page?.marginPreset ||
    (safeMetadata?.page?.margin === 12
      ? "narrow"
      : safeMetadata?.page?.margin === 24
      ? "wide"
      : "standard");

  const marginClass =
    activeMargin === "narrow"
      ? "resume-margin-narrow"
      : activeMargin === "wide"
      ? "resume-margin-wide"
      : "resume-margin-standard";

  const activeHeaderStyle =
    safeMetadata?.typography?.headerStyle ||
    safeMetadata?.headerStyle ||
    "default";

  const headerStyleClass =
    activeHeaderStyle === "underline"
      ? "resume-header-underline"
      : activeHeaderStyle === "left-bar"
      ? "resume-header-left-bar"
      : activeHeaderStyle === "pill"
      ? "resume-header-pill"
      : activeHeaderStyle === "minimal"
      ? "resume-header-minimal"
      : "resume-header-default";

  const fontScale = safeMetadata?.typography?.fontScale;

  return (
    <div
      className={`w-full h-full resume-font-root ${densityClass} ${marginClass} ${headerStyleClass}`}
      style={{
        fontFamily: `"${activeFont}", ${getFontFallback(safeMetadata?.typography?.font?.category)}`,
        "--resume-color-bg": themeColors[0] || "#ffffff",
        "--resume-color-text": themeColors[1] || "#000000",
        "--resume-color-primary": themeColors[2] || "#ca8a04",
        ...(fontScale && fontScale !== 1
          ? { "--resume-font-scale": `${(fontScale * 100).toFixed(1)}%` }
          : {}),
      }}
    >
      {renderTemplateComponent()}
    </div>
  );
};

export default RenderResume;