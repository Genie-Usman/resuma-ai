import { useMemo } from 'react';
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
    layout: normalizeLayout(metadata?.layout, sections),
  }), [metadata, sections]);

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

    return formatted;
  }, [sections, safeMetadata]);

  const sharedProps = {
    basics,
    sections: safeSections,
    metadata: safeMetadata,
    isFirstPage: true,
    containerWidth,
    colorPalette: themeColors
  };

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
    default: return <Azurill {...sharedProps} />;
  }
};

export default RenderResume;