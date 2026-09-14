/**
 * Flexible Date Formatter Utility (Roadmap Item 3.3)
 * Formats dates according to user preference:
 * - "short": "Jan 2024"
 * - "full": "January 2024"
 * - "year": "2024"
 * - "numeric": "01/2024"
 * Handles ISO strings, YYYY-MM, full dates, and passes freeform unparseable strings through untouched.
 */

const MONTH_NAMES_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const MONTH_NAMES_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

/**
 * Format a single date string
 * @param {string|Date} dateVal - Input date string or Date object
 * @param {string} format - "short" | "full" | "year" | "numeric"
 * @returns {string} Formatted date
 */
export const formatResumeDate = (dateVal, format = "short") => {
  if (!dateVal) return "";
  if (typeof dateVal !== "string" && !(dateVal instanceof Date)) return String(dateVal);

  const str = typeof dateVal === "string" ? dateVal.trim() : dateVal.toISOString();
  if (!str) return "";

  // Common special tokens
  const lower = str.toLowerCase();
  if (lower === "present" || lower === "current" || lower === "now") {
    return "Present";
  }

  // Check if it's a standard YYYY-MM or YYYY-MM-DD
  const isoMatch = str.match(/^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = isoMatch[2] ? parseInt(isoMatch[2], 10) - 1 : null;

    if (month === null || isNaN(month)) {
      return String(year);
    }

    switch (format) {
      case "full":
        return `${MONTH_NAMES_FULL[month] || ""} ${year}`.trim();
      case "year":
        return String(year);
      case "numeric": {
        const mm = String(month + 1).padStart(2, "0");
        return `${mm}/${year}`;
      }
      case "short":
      default:
        return `${MONTH_NAMES_SHORT[month] || ""} ${year}`.trim();
    }
  }

  // Try parsing Date object
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = parsed.getMonth();

    switch (format) {
      case "full":
        return `${MONTH_NAMES_FULL[month]} ${year}`;
      case "year":
        return String(year);
      case "numeric": {
        const mm = String(month + 1).padStart(2, "0");
        return `${mm}/${year}`;
      }
      case "short":
      default:
        return `${MONTH_NAMES_SHORT[month]} ${year}`;
    }
  }

  // Freeform fallback: user entered custom free text, return as-is
  return str;
};

/**
 * Format date range (start - end)
 */
export const formatResumeDateRange = (startDate, endDate, format = "short") => {
  const start = formatResumeDate(startDate, format);
  const end = endDate ? formatResumeDate(endDate, format) : "Present";

  if (!start && !end) return "";
  if (!start) return end;
  if (!end || end.toLowerCase() === "present") return `${start} – Present`;
  return `${start} – ${end}`;
};
