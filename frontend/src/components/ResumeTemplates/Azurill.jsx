import { mapSectionToComponent } from "../../utils/sectionMapper";

// Components
import ResumeHeader from "../ResumeSections/ResumeHeader.jsx";

const Azurill = ({ basics = {}, sections = {}, metadata = {}, isFirstPage = false }) => {

    const [layout] = Array.isArray(metadata.layout) ? metadata.layout : [[]];
    const mainIds = Array.isArray(layout[0]) ? layout[0] : [];
    const sidebarIds = Array.isArray(layout[1]) ? layout[1] : [];

    return (
        <div className="py-5 space-y-3 bg-white min-h-[800px]">

            {isFirstPage && <ResumeHeader basics={basics} />}

            <div className="grid grid-cols-3 gap-x-4">
                <aside className="sidebar group space-y-4">
                    {sidebarIds.map((key) =>
                        mapSectionToComponent(key, sections[key], key)
                    )}
                </aside>

                <main
                    className={`main group space-y-4 ${sidebarIds.length > 0 ? "col-span-2" : "col-span-3"}`}
                >
                    {mainIds.map((key) =>
                        mapSectionToComponent(key, sections[key], key)
                    )}
                </main>
            </div>
        </div>
    );
};

export default Azurill;