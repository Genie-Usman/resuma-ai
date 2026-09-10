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
 * Extracts the main column (col 0) and sidebar column (col 1) as string arrays
 *
 * @param {Array} rawLayout
 * @param {Object} sections
 * @returns {[string[], string[]]} [col0, col1]
 */
export const extractLayoutColumns = (rawLayout, sections = {}) => {
  // Case 1: Standard 3D matrix -> [ [ col0, col1 ] ]
  if (
    Array.isArray(rawLayout) &&
    rawLayout.length > 0 &&
    Array.isArray(rawLayout[0]) &&
    rawLayout[0].length > 0 &&
    Array.isArray(rawLayout[0][0])
  ) {
    const page0 = rawLayout[0];
    const c0 = Array.isArray(page0[0]) ? page0[0].filter((k) => typeof k === "string") : [];
    const c1 = Array.isArray(page0[1]) ? page0[1].filter((k) => typeof k === "string") : [];
    return balanceColumns(c0, c1);
  }

  // Case 2: 2D matrix -> [ col0, col1 ]
  if (
    Array.isArray(rawLayout) &&
    rawLayout.length > 0 &&
    Array.isArray(rawLayout[0]) &&
    (rawLayout[0].length === 0 || typeof rawLayout[0][0] === "string")
  ) {
    const c0 = Array.isArray(rawLayout[0]) ? rawLayout[0].filter((k) => typeof k === "string") : [];
    const c1 = Array.isArray(rawLayout[1]) ? rawLayout[1].filter((k) => typeof k === "string") : [];
    return balanceColumns(c0, c1);
  }

  // Case 3: 1D flat array of strings -> [ 'experience', 'profiles', ... ]
  if (Array.isArray(rawLayout) && rawLayout.length > 0 && typeof rawLayout[0] === "string") {
    const stringKeys = rawLayout.filter((k) => typeof k === "string");
    const c0 = stringKeys.filter((k) => !DEFAULT_SIDEBAR_SECTIONS.has(k));
    const c1 = stringKeys.filter((k) => DEFAULT_SIDEBAR_SECTIONS.has(k));
    return balanceColumns(c0, c1);
  }

  // Fallback: derive from sections object
  const validKeys = Object.keys(sections || {}).filter((k) => k !== "personal-info");
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
 * @returns {Array} normalized 3D layout
 */
export const normalizeLayout = (rawLayout, sections = {}) => {
  const [col0, col1] = extractLayoutColumns(rawLayout, sections);
  return [[col0, col1]];
};

/**
 * Reorders columns based on a new flat section ordering from drag-and-drop
 * Preserves the column partitioning while updating relative sequence
 *
 * @param {Array} currentLayout
 * @param {string[]} newSectionOrder
 * @param {Object} sections
 * @returns {Array} new 3D layout [ [ newCol0, newCol1 ] ]
 */
export const reorderLayoutColumns = (currentLayout, newSectionOrder, sections = {}) => {
  const [oldCol0, oldCol1] = extractLayoutColumns(currentLayout, sections);

  const col0Set = new Set(oldCol0);
  const col1Set = new Set(oldCol1);

  const newCol0 = [];
  const newCol1 = [];

  newSectionOrder.forEach((key) => {
    if (typeof key !== "string" || key === "personal-info") return;

    if (DEFAULT_MAIN_SECTIONS.has(key)) {
      newCol0.push(key);
    } else if (DEFAULT_SIDEBAR_SECTIONS.has(key)) {
      newCol1.push(key);
    } else if (col1Set.has(key)) {
      newCol1.push(key);
    } else if (col0Set.has(key)) {
      newCol0.push(key);
    } else {
      newCol0.push(key);
    }
  });

  // Ensure any section present in sections that was missing from newSectionOrder is retained
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
};
