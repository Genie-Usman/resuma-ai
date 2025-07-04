import Azurill from './Azurill'

const RenderResume = ({ templateId, resumeData, colorPalette, containerWidth }) => {

     if (!resumeData || !resumeData.basics) {
    return null; // or a loading skeleton/spinner
  }

    switch (templateId) {
        case 'azurill':
            return (
                <Azurill
                    basics={resumeData.data.basics}
                    sections={resumeData.data.sections}
                    metadata={resumeData.data.metadata}
                    isFirstPage={true}
                />
            )

        default:
            return (
                <Azurill
                    basics={resumeData.data.basics}
                    sections={resumeData.data.sections}
                    metadata={resumeData.data.metadata}
                    isFirstPage={true}
                />
            )
    }
}

export default RenderResume
