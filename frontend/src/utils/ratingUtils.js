/**
 * ratingUtils.js
 * Centralized helpers for normalizing, formatting, and conditionally displaying
 * proficiency ratings across all 13 resume templates and form editors.
 */

export const LEVEL_LABELS = {
  5: "Excellent",
  4: "Very Good",
  3: "Good",
  2: "Intermediate",
  1: "Basic",
};

export const LANGUAGE_LEVEL_LABELS = {
  5: "Native / Bilingual",
  4: "Fluent / Full Professional",
  3: "Professional Working",
  2: "Intermediate",
  1: "Elementary / Basic",
};

/**
 * Normalizes any level representation (1-5 integer scale or 0-100 percentage scale)
 * to a consistent integer between 0 and 5.
 * Returns 0 if level is missing, empty, or 0.
 */
export const normalizeRatingLevel = (level) => {
  if (
    level === undefined ||
    level === null ||
    level === "" ||
    isNaN(Number(level))
  ) {
    return 0;
  }

  const num = Number(level);
  if (num <= 0) return 0;

  // If already on a 1-5 scale:
  if (num <= 5) {
    return Math.min(5, Math.max(1, Math.round(num)));
  }

  // If on a 0-100 percentage scale (e.g. 20, 40, 60, 80, 100):
  return Math.min(5, Math.max(1, Math.round((num / 100) * 5)));
};

/**
 * Converts a 1-5 or 0-100 level into a percentage between 0 and 100.
 */
export const levelToPercentage = (level) => {
  const normalized = normalizeRatingLevel(level);
  return (normalized / 5) * 100;
};

/**
 * Determines whether a rating should be displayed for a given item in a section.
 * Returns false if:
 * 1. The section explicitly disables ratings (section.showRatings === false)
 * 2. The item explicitly disables its rating (item.showRating === false)
 * 3. The level is 0, empty, or undefined.
 */
export const shouldShowRating = (section, item, levelKey = "level") => {
  if (!section || !item) return false;

  // 1. Section master toggle: if explicitly set to false, hide ratings
  if (section.showRatings === false) return false;

  // 2. Item toggle: if explicitly set to false, hide this item's rating
  if (item.showRating === false) return false;

  // 3. Level value: must be greater than 0
  const rawLevel = item[levelKey];
  const normalized = normalizeRatingLevel(rawLevel);
  return normalized > 0;
};
