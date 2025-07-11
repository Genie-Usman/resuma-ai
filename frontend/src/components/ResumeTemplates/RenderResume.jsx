import Azurill from './Azurill'
import Bronzor from './Bronzor';
// import Chikorita from './Chikorita';
// import Ditto from './Ditto';
// import Gengar from './Gengar';
// import Glalie from './Glalie';
// import Kakuna from './Kakuna';
// import Leafish from './Leafish';
// import Nosepass from './Nosepass';
// import Onyx from './Onyx';
// import Pikachu from './Pikachu';
// import Rhyhorn from './Rhyhorn';

const RenderResume = ({ templateId, resumeData, colorPalette, containerWidth }) => {
  const data = resumeData?.data || resumeData || {}; // fallback if resumeData.data doesn't exist
  const { basics, sections, metadata } = data;

  if (!basics || !sections || !metadata) {
    return <div>No resume data found</div>;
  }

  const themeColors = colorPalette?.length
    ? colorPalette
    : [metadata.theme?.background, metadata.theme?.text, metadata.theme?.primary];

  const sharedProps = {
    basics,
    sections,
    metadata,
    isFirstPage: true,
    containerWidth,
    colorPalette: themeColors
  };

  switch (templateId) {
    case 'azurill': return <Azurill {...sharedProps} />;
    case 'bronzor': return <Bronzor {...sharedProps} />;
    // case 'chikorita': return <Chikorita {...sharedProps} />;
    // case 'ditto': return <Ditto {...sharedProps} />;
    // case 'gengar': return <Gengar {...sharedProps} />;
    // case 'glalie': return <Glalie {...sharedProps} />;
    // case 'kakuna': return <Kakuna {...sharedProps} />;
    // case 'leafish': return <Leafish {...sharedProps} />;
    // case 'nosepass': return <Nosepass {...sharedProps} />;
    // case 'onyx': return <Onyx {...sharedProps} />;
    // case 'pikachu': return <Pikachu {...sharedProps} />;
    // case 'rhyhorn': return <Rhyhorn {...sharedProps} />;
    default: return <Bronzor {...sharedProps} />;
  }
};

export default RenderResume;