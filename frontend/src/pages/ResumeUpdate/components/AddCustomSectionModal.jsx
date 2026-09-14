import React, { useState } from "react";
import {
  LuPlus,
  LuClock,
  LuListChecks,
  LuBookOpen,
  LuLanguages,
  LuSparkles,
  LuCheck,
  LuColumns2,
  LuPanelLeft,
  LuX,
} from "react-icons/lu";
import Modal from "../../../components/shared/Modal";

const SECTION_ARCHETYPES = [
  {
    id: "timeline",
    title: "Standard Timeline",
    subtitle: "Organization, Role, Dates, Location, and Rich Bullets",
    tag: "Narrative",
    icon: LuClock,
    color: "blue",
    bestFor: "Volunteer Work, Teaching, Clinical Rotations, Freelance",
    defaultColumn: "main",
  },
  {
    id: "simple_list",
    title: "Simple List",
    subtitle: "Title, Issuing Authority, Date, and Credential Link",
    tag: "Structured",
    icon: LuListChecks,
    color: "amber",
    bestFor: "Patents, Licenses, Honors, Grants, Memberships",
    defaultColumn: "sidebar",
  },
  {
    id: "publications",
    title: "Publication List",
    subtitle: "Paper Title, Journal / Publisher, Year, and DOI / Link",
    tag: "Academic",
    icon: LuBookOpen,
    color: "indigo",
    bestFor: "Research Papers, Keynotes, Articles, Whitepapers",
    defaultColumn: "main",
  },
  {
    id: "language_matrix",
    title: "Language Matrix",
    subtitle: "Language Name + 5-tier Visual Proficiency Rating",
    tag: "Ratings",
    icon: LuLanguages,
    color: "emerald",
    bestFor: "Language Proficiencies, Specialized Skills Matrix",
    defaultColumn: "sidebar",
  },
];

const AddCustomSectionModal = ({
  isOpen,
  onClose,
  onAddSection,
  isTwoColumn = true,
}) => {
  const [sectionName, setSectionName] = useState("");
  const [selectedType, setSelectedType] = useState("timeline");
  const [columnPlacement, setColumnPlacement] = useState("main");
  const [nameError, setNameError] = useState("");

  if (!isOpen) return null;

  const handleSelectType = (typeId) => {
    setSelectedType(typeId);
    const archetype = SECTION_ARCHETYPES.find((a) => a.id === typeId);
    if (archetype) {
      setColumnPlacement(archetype.defaultColumn);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = sectionName.trim();
    if (!trimmed) {
      setNameError("Please enter a section title.");
      return;
    }

    onAddSection({
      name: trimmed,
      type: selectedType,
      column: columnPlacement,
    });

    // Reset & close
    setSectionName("");
    setSelectedType("timeline");
    setColumnPlacement("main");
    setNameError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideHeader={true}
      hideCloseBtn={true}
      noPadding={true}
      width="640px"
      maxWidth="94vw"
      maxHeight="86vh"
    >
      <div className="flex flex-col h-full max-h-[86vh] text-slate-800 bg-white overflow-hidden">
        {/* Fixed Top Header */}
        <div className="shrink-0 px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20 shrink-0">
              <LuSparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Create a Custom Section
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-tight">
                Extend your resume for specialized professions. Pick an archetype and title.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-xl cursor-pointer transition-colors"
            aria-label="Close dialog"
          >
            <LuX className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body (Single scroll container) */}
        <form
          id="create-custom-section-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5 space-y-5"
        >
          {/* 1. Section Title Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Section Title
              </label>
              <span className="text-[11px] font-normal text-slate-400">Can be renamed anytime</span>
            </div>
            <input
              type="text"
              value={sectionName}
              onChange={(e) => {
                setSectionName(e.target.value);
                if (nameError) setNameError("");
              }}
              placeholder="e.g. Volunteer Work, Teaching, Clinical Practice, Patents"
              className={`w-full text-sm font-semibold text-slate-900 px-3.5 py-2.5 bg-white border rounded-xl shadow-2xs focus:outline-none focus:ring-2 transition-all ${
                nameError
                  ? "border-rose-300 focus:ring-rose-500/20"
                  : "border-slate-200/90 focus:border-purple-400 focus:ring-purple-500/20"
              }`}
              autoFocus
            />
            {nameError && (
              <p className="text-xs font-medium text-rose-600 mt-1">{nameError}</p>
            )}
          </div>

          {/* 2. Section Archetype Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Choose Section Structure
              </label>
              <span className="text-[11px] font-medium text-slate-400">
                Determines formatting & template styling
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SECTION_ARCHETYPES.map((archetype) => {
                const Icon = archetype.icon;
                const isSelected = selectedType === archetype.id;

                return (
                  <div
                    key={archetype.id}
                    onClick={() => handleSelectType(archetype.id)}
                    className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                      isSelected
                        ? "bg-purple-50/70 border-purple-500 ring-2 ring-purple-500/20 shadow-xs"
                        : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-2 rounded-xl shrink-0 ${
                            isSelected
                              ? "bg-purple-600 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {archetype.title}
                          </div>
                          <span className="text-[10px] font-semibold text-slate-400">
                            {archetype.tag}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <LuCheck className="text-xs" />
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug line-clamp-2 mb-2">
                      {archetype.subtitle}
                    </p>

                    <div className="pt-2 border-t border-slate-100/80 text-[10px] text-slate-400 truncate">
                      <span className="font-semibold text-slate-500">Best for: </span>
                      {archetype.bestFor}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Column Placement (for 2-column templates) */}
          {isTwoColumn && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Layout Column Placement
                </label>
                <span className="text-[11px] font-normal text-slate-400">Can be dragged anytime</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setColumnPlacement("main")}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    columnPlacement === "main"
                      ? "bg-purple-50 text-purple-900 border-purple-400 ring-1 ring-purple-500/20"
                      : "bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50"
                  }`}
                >
                  <LuColumns2 className={`text-base ${columnPlacement === "main" ? "text-purple-600" : "text-slate-400"}`} />
                  <div className="text-left">
                    <div>Main Column</div>
                    <span className="text-[10px] font-normal text-slate-400 block">Wide content area</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setColumnPlacement("sidebar")}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    columnPlacement === "sidebar"
                      ? "bg-purple-50 text-purple-900 border-purple-400 ring-1 ring-purple-500/20"
                      : "bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50"
                  }`}
                >
                  <LuPanelLeft className={`text-base ${columnPlacement === "sidebar" ? "text-purple-600" : "text-slate-400"}`} />
                  <div className="text-left">
                    <div>Sidebar Column</div>
                    <span className="text-[10px] font-normal text-slate-400 block">Compact side rail</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Fixed Bottom Footer Action Bar */}
        <div className="shrink-0 px-6 py-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-2.5 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-custom-section-form"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-600/25 transition-all cursor-pointer active:scale-98"
          >
            <LuPlus className="text-sm" />
            <span>Add to Resume</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddCustomSectionModal;
