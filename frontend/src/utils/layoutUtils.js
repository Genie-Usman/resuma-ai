export const TWO_COLUMN_TEMPLATES = new Set([
  "azurill",
  "chikorita",
  "ditto",
  "gengar",
  "glalie",
  "leafish",
  "pikachu",
]);

export const isTwoColumnTemplate = (templateId) => {
  if (!templateId) return true;
  return TWO_COLUMN_TEMPLATES.has(String(templateId).toLowerCase());
};

/**
 * layoutUtils.js
 * Utilities for manipulating and normalizing the 3-tier layout matrix:
 * layout[pageIndex][columnIndex] = [sectionKey1, sectionKey2, ...]
 *
 * Prevents layout corruption during drag-and-drop and guarantees all 12 templates
 * receive a valid [ [ col0, col1 ] ] structure.
 */

export const DEFAULT_SIDEBAR_SECTIONS = new Set([
  "profiles",
  "skills",
  "certifications",
  "awards",
  "languages",
  "interests",
  "references",
]);

export const DEFAULT_MAIN_SECTIONS = new Set([
  "summary",
  "experience",
  "education",
  "projects",
  "volunteer",
  "publications",
]);

/**
 * Helper to auto-balance columns so heavyweight narrative sections like education
 * sit in the wide main column instead of elongating the narrow sidebar.
 */
const balanceColumns = (col0, col1) => {
  let c0 = [...col0];
  let c1 = [...col1];

  // If education is in col1 while col1 is heavy, migrate to col0
  if (c1.includes("education") && !c0.includes("education") && c1.length >= 3) {
    c1 = c1.filter((k) => k !== "education");
    const expIdx = c0.indexOf("experience");
    if (expIdx !== -1) {
      c0.splice(expIdx + 1, 0, "education");
    } else {
      c0.push("education");
    }
  }

  return [c0, c1];
};

/**
 * Extracts the main column (col 0) and sidebar column (col 1) as string arrays.
 * Respects 1-column vs 2-column templates.
 *
 * @param {Array} rawLayout
 * @param {Object} sections
 * @param {string} templateId
 * @returns {[string[], string[]]} [col0, col1]
 */
export const extractLayoutColumns = (rawLayout, sections = {}, templateId = null) => {
  const isTwoCol = templateId ? isTwoColumnTemplate(templateId) : true;

  // Case 1: Standard 3D matrix -> [ [ col0, col1 ] ]
  if (
    Array.isArray(rawLayout) &&
    rawLayout.length > 0 &&
    Array.isArray(rawLayout[0]) &&
    rawLayout[0].length > 0 &&
    Array.isArray(rawLayout[0][0])
  ) {
    const page0 = rawLayout[0];
    let c0 = Array.isArray(page0[0]) ? page0[0].filter((k) => typeof k === "string" && k !== "personal-info") : [];
    let c1 = Array.isArray(page0[1]) ? page0[1].filter((k) => typeof k === "string" && k !== "personal-info") : [];

    // Auto-include any sections from the sections object missing from layout
    Object.keys(sections || {}).forEach((key) => {
      if (key === "personal-info" || key === "custom") return;
      if (!c0.includes(key) && !c1.includes(key)) {
        const sec = sections[key];
        const isSidebar = sec?.column === "sidebar" || DEFAULT_SIDEBAR_SECTIONS.has(key);
        if (isTwoCol && isSidebar) {
          c1.push(key);
        } else {
          c0.push(key);
        }
      }
    });

    // For 1-column templates: combine sequentially into col0, col1 is empty
    if (!isTwoCol) {
      let combined = [];
      if (c1.length > 0 && (templateId === "nosepass" || templateId === "onyx")) {
        combined = [...c1, ...c0];
      } else {
        combined = [...c0, ...c1];
      }
      return [combined, []];
    }

    // For 2-column templates: Self-healing if all sections were dumped into a single column
    if (c1.length === 0 && c0.length > 1) {
      const allItems = [...c0];
      c0 = allItems.filter((k) => !DEFAULT_SIDEBAR_SECTIONS.has(k));
      c1 = allItems.filter((k) => DEFAULT_SIDEBAR_SECTIONS.has(k));
    } else if (c0.length === 0 && c1.length > 1) {
      const allItems = [...c1];
      c0 = allItems.filter((k) => !DEFAULT_SIDEBAR_SECTIONS.has(k));
      c1 = allItems.filter((k) => DEFAULT_SIDEBAR_SECTIONS.has(k));
    }

    return [c0, c1];
  }

  // Case 2: 2D matrix -> [ col0, col1 ]
  if (
    Array.isArray(rawLayout) &&
    rawLayout.length > 0 &&
    Array.isArray(rawLayout[0]) &&
    (rawLayout[0].length === 0 || typeof rawLayout[0][0] === "string")
  ) {
    let c0 = Array.isArray(rawLayout[0]) ? rawLayout[0].filter((k) => typeof k === "string" && k !== "personal-info") : [];
    let c1 = Array.isArray(rawLayout[1]) ? rawLayout[1].filter((k) => typeof k === "string" && k !== "personal-info") : [];

    // Auto-include any sections from the sections object missing from layout
    Object.keys(sections || {}).forEach((key) => {
      if (key === "personal-info" || key === "custom") return;
      if (!c0.includes(key) && !c1.includes(key)) {
        const sec = sections[key];
        const isSidebar = sec?.column === "sidebar" || DEFAULT_SIDEBAR_SECTIONS.has(key);
        if (isTwoCol && isSidebar) {
          c1.push(key);
        } else {
          c0.push(key);
        }
      }
    });

    if (!isTwoCol) {
      let combined = [];
      if (c1.length > 0 && (templateId === "nosepass" || templateId === "onyx")) {
        combined = [...c1, ...c0];
      } else {
        combined = [...c0, ...c1];
      }
      return [combined, []];
    }

    if (c1.length === 0 && c0.length > 1) {
      const allItems = [...c0];
      c0 = allItems.filter((k) => !DEFAULT_SIDEBAR_SECTIONS.has(k));
      c1 = allItems.filter((k) => DEFAULT_SIDEBAR_SECTIONS.has(k));
    }

    return [c0, c1];
  }

  // Case 3: 1D flat array of strings -> [ 'experience', 'profiles', ... ]
  if (Array.isArray(rawLayout) && rawLayout.length > 0 && typeof rawLayout[0] === "string") {
    const stringKeys = rawLayout.filter((k) => typeof k === "string" && k !== "personal-info");
    if (!isTwoCol) {
      return [stringKeys, []];
    }
    const c0 = stringKeys.filter((k) => !DEFAULT_SIDEBAR_SECTIONS.has(k));
    const c1 = stringKeys.filter((k) => DEFAULT_SIDEBAR_SECTIONS.has(k));
    return balanceColumns(c0, c1);
  }

  // Fallback: derive from sections object
  const validKeys = Object.keys(sections || {}).filter((k) => k !== "personal-info");
  if (!isTwoCol) {
    return [validKeys, []];
  }
  const c0 = validKeys.filter((k) => !DEFAULT_SIDEBAR_SECTIONS.has(k));
  const c1 = validKeys.filter((k) => DEFAULT_SIDEBAR_SECTIONS.has(k));
  return balanceColumns(c0, c1);
};

/**
 * Normalizes any layout structure into the exact 3D shape expected by all 12 templates:
 * [ [ col0_ids, col1_ids ] ]
 *
 * @param {Array} rawLayout
 * @param {Object} sections
 * @param {string} templateId
 * @returns {Array} normalized 3D layout
 */
export const normalizeLayout = (rawLayout, sections = {}, templateId = null) => {
  const [col0, col1] = extractLayoutColumns(rawLayout, sections, templateId);
  return [[col0, col1]];
};

/**
 * Reorders columns based on explicit two-column ordering or flat section ordering.
 * Preserves user's explicit column assignments while updating relative sequence.
 *
 * @param {Array} currentLayout
 * @param {Array|Object} newSectionOrder - Can be [newCol0, newCol1], { col0, col1 }, or flat string[]
 * @param {Object} sections
 * @param {string} templateId
 * @returns {Array} new 3D layout [ [ newCol0, newCol1 ] ]
 */
export const reorderLayoutColumns = (currentLayout, newSectionOrder, sections = {}, templateId = null) => {
  const isTwoCol = templateId ? isTwoColumnTemplate(templateId) : true;

  // Case 1: 1-column template receiving a single flat array of section keys
  if (!isTwoCol && Array.isArray(newSectionOrder) && (newSectionOrder.length === 0 || typeof newSectionOrder[0] === "string")) {
    const validFlat = newSectionOrder.filter((k) => typeof k === "string" && k !== "personal-info");
    return [[validFlat, []]];
  }

  // Case A: Explicit 2-column object { col0: [...], col1: [...] }
  if (
    newSectionOrder &&
    typeof newSectionOrder === "object" &&
    !Array.isArray(newSectionOrder) &&
    (Array.isArray(newSectionOrder.col0) || Array.isArray(newSectionOrder.col1))
  ) {
    const c0 = (newSectionOrder.col0 || []).filter((k) => typeof k === "string" && k !== "personal-info");
    const c1 = (newSectionOrder.col1 || []).filter((k) => typeof k === "string" && k !== "personal-info");
    return [[c0, c1]];
  }

  // Case B: Explicit 2D array [ newCol0, newCol1 ]
  if (
    Array.isArray(newSectionOrder) &&
    newSectionOrder.length >= 2 &&
    Array.isArray(newSectionOrder[0]) &&
    Array.isArray(newSectionOrder[1])
  ) {
    const c0 = newSectionOrder[0].filter((k) => typeof k === "string" && k !== "personal-info");
    const c1 = newSectionOrder[1].filter((k) => typeof k === "string" && k !== "personal-info");
    return [[c0, c1]];
  }

  // Case C: Flat array fallback for 2-column templates
  if (Array.isArray(newSectionOrder) && (newSectionOrder.length === 0 || typeof newSectionOrder[0] === "string")) {
    if (!isTwoCol) {
      const validFlat = newSectionOrder.filter((k) => typeof k === "string" && k !== "personal-info");
      return [[validFlat, []]];
    }

    const [oldCol0, oldCol1] = extractLayoutColumns(currentLayout, sections, templateId);
    const col0Set = new Set(oldCol0);
    const col1Set = new Set(oldCol1);

    const newCol0 = [];
    const newCol1 = [];

    newSectionOrder.forEach((key) => {
      if (typeof key !== "string" || key === "personal-info") return;

      if (col1Set.has(key)) {
        newCol1.push(key);
      } else if (col0Set.has(key)) {
        newCol0.push(key);
      } else if (DEFAULT_SIDEBAR_SECTIONS.has(key)) {
        newCol1.push(key);
      } else {
        newCol0.push(key);
      }
    });

    // Ensure any section present in sections that was missing is retained
    Object.keys(sections || {}).forEach((key) => {
      if (key === "personal-info") return;
      if (!newCol0.includes(key) && !newCol1.includes(key)) {
        if (DEFAULT_SIDEBAR_SECTIONS.has(key)) {
          newCol1.push(key);
        } else {
          newCol0.push(key);
        }
      }
    });

    return [[newCol0, newCol1]];
  }

  return normalizeLayout(currentLayout, sections, templateId);
};
