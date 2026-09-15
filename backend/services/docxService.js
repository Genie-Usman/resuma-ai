const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ExternalHyperlink,
} = require("docx");

/**
 * Strips HTML tags and splits rich text into structured runs and bullet paragraphs
 */
function parseHtmlToDocxElements(htmlString, font = "Calibri") {
  if (!htmlString || typeof htmlString !== "string") return [];

  // Normalize line breaks and list tags
  const normalized = htmlString
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<\/p>/gi, "\n")
    .replace(/<br\s*[\/]?>/gi, "\n")
    .replace(/<div[^>]*>/gi, "")
    .replace(/<\/div>/gi, "\n");

  const lines = normalized.split("\n").map((l) => l.trim()).filter(Boolean);
  const elements = [];

  for (const rawLine of lines) {
    const isBullet = rawLine.startsWith("•") || rawLine.startsWith("-") || rawLine.startsWith("*");
    const cleanLine = isBullet
      ? rawLine.replace(/^[•\-\*]\s*/, "").trim()
      : rawLine;

    // Parse inline bold/italic tags
    const runs = parseInlineFormatting(cleanLine, font);

    if (runs.length === 0) continue;

    if (isBullet) {
      elements.push(
        new Paragraph({
          children: runs,
          bullet: { level: 0 },
          spacing: { before: 40, after: 60, line: 240 },
        })
      );
    } else {
      elements.push(
        new Paragraph({
          children: runs,
          spacing: { before: 40, after: 80, line: 240 },
        })
      );
    }
  }

  return elements;
}

/**
 * Parses inline <strong>, <b>, <em>, <i> tags into Word TextRun objects
 */
function parseInlineFormatting(textWithTags, font) {
  // Regex tokenization for HTML tags
  const tokens = textWithTags.split(/(<\/?(?:strong|b|em|i)[^>]*>)/gi);
  const runs = [];
  let isBold = false;
  let isItalic = false;

  for (const token of tokens) {
    if (!token) continue;
    const lower = token.toLowerCase();

    if (lower === "<strong>" || lower === "<b>") {
      isBold = true;
    } else if (lower === "</strong>" || lower === "</b>") {
      isBold = false;
    } else if (lower === "<em>" || lower === "<i>") {
      isItalic = true;
    } else if (lower === "</em>" || lower === "</i>") {
      isItalic = false;
    } else {
      // Decode entities & strip any remaining unhandled HTML tags
      const text = token
        .replace(/<[^>]*>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ");

      if (text) {
        runs.push(
          new TextRun({
            text,
            bold: isBold,
            italics: isItalic,
            font,
            size: 20, // 10pt
            color: "111827",
          })
        );
      }
    }
  }

  return runs;
}

/**
 * Creates an ATS-standard section heading with an accent colored bottom border
 */
function createSectionHeader(title, accentHex, font) {
  return new Paragraph({
    text: title.toUpperCase(),
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    border: {
      bottom: {
        color: accentHex,
        space: 4,
        style: BorderStyle.SINGLE,
        size: 12, // 1.5pt
      },
    },
    run: {
      font,
      size: 23, // 11.5pt
      bold: true,
      color: accentHex,
    },
  });
}

/**
 * Creates a borderless 2-column table for aligned Role/Company and Date/Location
 */
function createItemHeaderTable({
  leftPrimary,
  leftSecondary,
  rightPrimary,
  rightSecondary,
  font,
}) {
  const leftChildren = [];
  if (leftPrimary) {
    leftChildren.push(
      new TextRun({ text: leftPrimary, bold: true, size: 21, font, color: "111827" })
    );
  }
  if (leftSecondary) {
    if (leftPrimary) leftChildren.push(new TextRun({ text: "  |  ", size: 19, font, color: "9CA3AF" }));
    leftChildren.push(
      new TextRun({ text: leftSecondary, italics: true, size: 20, font, color: "4B5563" })
    );
  }

  const rightChildren = [];
  if (rightPrimary) {
    rightChildren.push(
      new TextRun({ text: rightPrimary, bold: true, size: 20, font, color: "374151" })
    );
  }
  if (rightSecondary) {
    if (rightPrimary) rightChildren.push(new TextRun({ text: "  |  ", size: 18, font, color: "9CA3AF" }));
    rightChildren.push(
      new TextRun({ text: rightSecondary, italics: true, size: 19, font, color: "6B7280" })
    );
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 68, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                children: leftChildren,
                spacing: { before: 80, after: 30 },
              }),
            ],
          }),
          new TableCell({
            width: { size: 32, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: rightChildren,
                spacing: { before: 80, after: 30 },
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

/**
 * Generates a complete, ATS-compliant Microsoft Word (.docx) document
 * from the structured Resuma AI resume JSON schema.
 */
async function generateResumeDocx({ resumeData, themeColor = "2563EB" }) {
  const data = resumeData?.data || resumeData || {};
  const basics = data.basics || {};
  const sections = data.sections || {};
  const metadata = data.metadata || {};

  // Extract accent color (strip leading # for Word XML compatibility)
  const rawColor =
    metadata.theme?.primary ||
    (Array.isArray(metadata.theme?.colors) ? metadata.theme.colors[2] : null) ||
    themeColor ||
    "2563EB";
  const accentHex = rawColor.replace(/^#/, "").toUpperCase();

  // Document font: fallback to Calibri or Arial
  const rawFont =
    metadata.typography?.font?.family ||
    metadata.fontFamily ||
    "Calibri";
  const font = ["Arial", "Calibri", "Inter", "Roboto", "Times New Roman", "Georgia"].includes(rawFont)
    ? rawFont
    : "Calibri";

  const docChildren = [];

  // ==========================================
  // 1. Candidate Header
  // ==========================================
  if (basics.name) {
    docChildren.push(
      new Paragraph({
        text: basics.name,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 40 },
        run: {
          font,
          size: 42, // 21pt
          bold: true,
          color: accentHex,
        },
      })
    );
  }

  if (basics.headline) {
    docChildren.push(
      new Paragraph({
        text: basics.headline,
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60 },
        run: {
          font,
          size: 24, // 12pt
          italics: true,
          color: "374151",
        },
      })
    );
  }

  // Contact Row: location • email • phone • portfolio
  const contactParts = [];
  if (basics.location) contactParts.push(basics.location);
  if (basics.email) contactParts.push(basics.email);
  if (basics.phone) contactParts.push(basics.phone);
  if (basics.url?.label || basics.url?.href) {
    contactParts.push(basics.url.label || basics.url.href);
  }

  if (contactParts.length > 0) {
    const contactRuns = [];
    contactParts.forEach((part, idx) => {
      contactRuns.push(
        new TextRun({
          text: part,
          font,
          size: 19, // 9.5pt
          color: "4B5563",
        })
      );
      if (idx < contactParts.length - 1) {
        contactRuns.push(
          new TextRun({
            text: "   •   ",
            font,
            size: 18,
            color: "9CA3AF",
          })
        );
      }
    });

    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: contactRuns,
        spacing: { before: 0, after: 180 },
      })
    );
  }

  // ==========================================
  // 2. Summary
  // ==========================================
  const summarySection = sections.summary;
  if (summarySection && summarySection.visible !== false && summarySection.content) {
    docChildren.push(createSectionHeader(summarySection.name || "Professional Summary", accentHex, font));
    const summaryElements = parseHtmlToDocxElements(summarySection.content, font);
    docChildren.push(...summaryElements);
  }

  // ==========================================
  // 3. Work Experience
  // ==========================================
  const experienceSection = sections.experience;
  if (
    experienceSection &&
    experienceSection.visible !== false &&
    Array.isArray(experienceSection.items) &&
    experienceSection.items.length > 0
  ) {
    docChildren.push(createSectionHeader(experienceSection.name || "Work Experience", accentHex, font));

    experienceSection.items.forEach((item) => {
      if (item.visible === false) return;

      docChildren.push(
        createItemHeaderTable({
          leftPrimary: item.position || "",
          leftSecondary: item.company || "",
          rightPrimary: item.date || "",
          rightSecondary: item.location || "",
          font,
        })
      );

      if (item.summary) {
        const bullets = parseHtmlToDocxElements(item.summary, font);
        docChildren.push(...bullets);
      }
    });
  }

  // ==========================================
  // 4. Education
  // ==========================================
  const educationSection = sections.education;
  if (
    educationSection &&
    educationSection.visible !== false &&
    Array.isArray(educationSection.items) &&
    educationSection.items.length > 0
  ) {
    docChildren.push(createSectionHeader(educationSection.name || "Education", accentHex, font));

    educationSection.items.forEach((item) => {
      if (item.visible === false) return;

      const degree = [item.studyType, item.area].filter(Boolean).join(" in ");
      docChildren.push(
        createItemHeaderTable({
          leftPrimary: item.institution || "",
          leftSecondary: degree || "",
          rightPrimary: item.date || "",
          rightSecondary: item.score ? `GPA: ${item.score}` : "",
          font,
        })
      );

      if (item.summary) {
        const bullets = parseHtmlToDocxElements(item.summary, font);
        docChildren.push(...bullets);
      }
    });
  }

  // ==========================================
  // 5. Key Skills
  // ==========================================
  const skillsSection = sections.skills;
  if (
    skillsSection &&
    skillsSection.visible !== false &&
    Array.isArray(skillsSection.items) &&
    skillsSection.items.length > 0
  ) {
    docChildren.push(createSectionHeader(skillsSection.name || "Key Skills", accentHex, font));

    skillsSection.items.forEach((item) => {
      if (item.visible === false) return;

      const skillRuns = [];
      if (item.name) {
        skillRuns.push(
          new TextRun({
            text: `${item.name}: `,
            bold: true,
            size: 20,
            font,
            color: "111827",
          })
        );
      }

      let keywordsText = "";
      if (Array.isArray(item.keywords)) {
        keywordsText = item.keywords.join(", ");
      } else if (typeof item.keywords === "string") {
        keywordsText = item.keywords;
      }

      if (keywordsText) {
        skillRuns.push(
          new TextRun({
            text: keywordsText,
            size: 20,
            font,
            color: "374151",
          })
        );
      }

      if (skillRuns.length > 0) {
        docChildren.push(
          new Paragraph({
            children: skillRuns,
            bullet: { level: 0 },
            spacing: { before: 30, after: 50, line: 240 },
          })
        );
      }
    });
  }

  // ==========================================
  // 6. Featured Projects
  // ==========================================
  const projectsSection = sections.projects;
  if (
    projectsSection &&
    projectsSection.visible !== false &&
    Array.isArray(projectsSection.items) &&
    projectsSection.items.length > 0
  ) {
    docChildren.push(createSectionHeader(projectsSection.name || "Featured Projects", accentHex, font));

    projectsSection.items.forEach((item) => {
      if (item.visible === false) return;

      docChildren.push(
        createItemHeaderTable({
          leftPrimary: item.name || "",
          leftSecondary: item.description || "",
          rightPrimary: item.date || "",
          rightSecondary: item.url?.label || item.url?.href || "",
          font,
        })
      );

      if (item.summary) {
        const bullets = parseHtmlToDocxElements(item.summary, font);
        docChildren.push(...bullets);
      }
    });
  }

  // ==========================================
  // 7. Certifications
  // ==========================================
  const certsSection = sections.certifications;
  if (
    certsSection &&
    certsSection.visible !== false &&
    Array.isArray(certsSection.items) &&
    certsSection.items.length > 0
  ) {
    docChildren.push(createSectionHeader(certsSection.name || "Certifications", accentHex, font));

    certsSection.items.forEach((item) => {
      if (item.visible === false) return;

      docChildren.push(
        createItemHeaderTable({
          leftPrimary: item.name || "",
          leftSecondary: item.issuer || "",
          rightPrimary: item.date || "",
          rightSecondary: "",
          font,
        })
      );

      if (item.summary) {
        const bullets = parseHtmlToDocxElements(item.summary, font);
        docChildren.push(...bullets);
      }
    });
  }

  // ==========================================
  // 8. Awards
  // ==========================================
  const awardsSection = sections.awards;
  if (
    awardsSection &&
    awardsSection.visible !== false &&
    Array.isArray(awardsSection.items) &&
    awardsSection.items.length > 0
  ) {
    docChildren.push(createSectionHeader(awardsSection.name || "Awards & Honors", accentHex, font));

    awardsSection.items.forEach((item) => {
      if (item.visible === false) return;

      docChildren.push(
        createItemHeaderTable({
          leftPrimary: item.title || item.name || "",
          leftSecondary: item.awarder || "",
          rightPrimary: item.date || "",
          rightSecondary: "",
          font,
        })
      );

      if (item.summary) {
        const bullets = parseHtmlToDocxElements(item.summary, font);
        docChildren.push(...bullets);
      }
    });
  }

  // ==========================================
  // 9. Custom Sections (Roadmap 3.1)
  // ==========================================
  Object.keys(sections).forEach((key) => {
    if (key.startsWith("custom_") || sections[key]?.isCustom) {
      const customSec = sections[key];
      if (customSec && customSec.visible !== false && Array.isArray(customSec.items) && customSec.items.length > 0) {
        docChildren.push(createSectionHeader(customSec.name || "Additional Experience", accentHex, font));

        customSec.items.forEach((item) => {
          if (item.visible === false) return;

          docChildren.push(
            createItemHeaderTable({
              leftPrimary: item.title || item.name || item.position || "",
              leftSecondary: item.subtitle || item.company || item.organization || "",
              rightPrimary: item.date || "",
              rightSecondary: item.location || "",
              font,
            })
          );

          if (item.summary || item.description) {
            const bullets = parseHtmlToDocxElements(item.summary || item.description, font);
            docChildren.push(...bullets);
          }
        });
      }
    }
  });

  // ==========================================
  // Document Initialization
  // ==========================================
  const doc = new Document({
    creator: "Resuma AI",
    title: `${basics.name || "Candidate"} - Resume`,
    description: "ATS-Compliant Resume created with Resuma AI",
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1080, // 0.75 in (1080 dxa)
              bottom: 1080,
              left: 1080,
              right: 1080,
            },
          },
        },
        children: docChildren,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

module.exports = {
  generateResumeDocx,
};
