const fs = require("node:fs");
const path = require("node:path");
const Resume = require('../models/Resume.js');
const User = require('../models/User.js');
const { getDefaultResumeData } = require('../utils/DefaultResume.js');
const { slugify } = require('../utils/helper.js');
const { generateVectorPdf } = require('../services/pdfService');
const { generateResumeDocx } = require('../services/docxService');
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { parseReferrer, parseCountry, parseDevice, parseBrowser } = require('../utils/analyticsHelper.js');

// @desc    Create a new Resume
// @route   POST /api/resumes
// @access  Private
const createResume = async (req, res) => {
  try {
    const { title, data } = req.body;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const user = await User.findById(req.user.id).select('name email profileImageURL');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const baseSlug = slugify(title);
    let slug = baseSlug;
    let count = 1;
    // Globally unique slug for clean public sharing (/view/:slug)
    while (await Resume.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    let resumeData;
    if (data && typeof data === 'object' && data.basics && data.sections) {
      resumeData = data;
    } else {
      resumeData = getDefaultResumeData(user);
      const chosenTemplate = req.body.template || data?.metadata?.template;
      if (chosenTemplate) {
        resumeData.metadata.template = chosenTemplate;
      }
    }

    const newResume = await Resume.create({
      userId: user._id,
      title,
      slug,
      data: resumeData,
      isPublic: true,
      viewsCount: 0,
      lastViewedAt: null,
    });

    res.status(201).json(newResume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create resume', error: error.message });
  }
};

// @desc    Get all Resumes for logged-in Users
// @route   GET /api/resumes
// @access  Private
const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch resumes", error: error.message });
  }
};

// @desc    Get single Resume by ID
// @route   GET /api/resumes/:id
// @access  Private
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({_id: req.params.id, userId: req.user._id});

    if(!resume){
      return res.status(404).json({message: 'Resume not found'});
    }

    // Auto-heal incomplete or missing data schema
    if (!resume.data || !resume.data.basics || !resume.data.sections) {
      const user = await User.findById(req.user._id).select('name email profileImageURL');
      const defaultData = getDefaultResumeData(user || {});
      const currentTemplate = resume.data?.metadata?.template || 'azurill';
      defaultData.metadata.template = currentTemplate;

      resume.data = {
        ...defaultData,
        ...(resume.data || {}),
        basics: {
          ...defaultData.basics,
          ...(resume.data?.basics || {}),
        },
        sections: {
          ...defaultData.sections,
          ...(resume.data?.sections || {}),
        },
        metadata: {
          ...defaultData.metadata,
          ...(resume.data?.metadata || {}),
          template: currentTemplate,
        },
      };

      resume.markModified('data');
      await resume.save();
    }

    res.json(resume);

  } catch (error) {
    res.status(404).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a Resume
// @route   PUT /api/resumes/:id
// @access  Private
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    // If title is being updated, regenerate slug
    if (req.body.title && req.body.title !== resume.title) {
      resume.slug = slugify(req.body.title, { lower: true, strict: true });
    }

    // Merge the rest of the updates
    Object.assign(resume, req.body);

    const updatedResume = await resume.save();
    res.json(updatedResume);
    
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Delete a Resume
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    // Delete thumbnail file from uploads folder (if it exists)
    if (resume.thumbnailLink) {
      const uploadsFolder = path.join(__dirname, '..', 'uploads');
      const thumbnailPath = path.join(uploadsFolder, path.basename(resume.thumbnailLink));

      if (fs.existsSync(thumbnailPath)) {
        try {
          fs.unlinkSync(thumbnailPath);
        } catch (e) {
          console.warn("Could not delete local thumbnail:", e.message);
        }
      }
    }

    await resume.deleteOne();

    res.json({ message: "Resume deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

// @desc    Duplicate an existing Resume
// @route   POST /api/resumes/:id/duplicate
// @access  Private
const duplicateResume = async (req, res) => {
  try {
    const originalResume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!originalResume) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    const newTitle = `${originalResume.title} (Copy)`;
    const baseSlug = slugify(newTitle);
    let slug = baseSlug;
    let count = 1;
    while (await Resume.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    // Deep clone data
    const clonedData = JSON.parse(JSON.stringify(originalResume.data || {}));

    const duplicatedResume = await Resume.create({
      userId: req.user._id,
      title: newTitle,
      slug,
      thumbnailLink: originalResume.thumbnailLink,
      data: clonedData,
      isPublic: true,
      viewsCount: 0,
      lastViewedAt: null,
    });

    res.status(201).json(duplicatedResume);
  } catch (error) {
    console.error("Duplicate resume error:", error);
    res.status(500).json({ message: "Failed to duplicate resume", error: error.message });
  }
};

// @desc    Get public Resume by slug or ID & track recruiter views & analytics
// @route   GET /api/resume/public/:slug
// @access  Public
const getPublicResume = async (req, res) => {
  try {
    const { slug } = req.params;

    // Check if query is valid MongoDB ObjectId or text slug
    const query = mongoose.Types.ObjectId.isValid(slug)
      ? { $or: [{ _id: slug }, { slug }] }
      : { slug };

    const resume = await Resume.findOne({
      ...query,
      isPublic: { $ne: false },
    }).populate("userId", "name email profileImageURL");

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or is set to private." });
    }

    // Parse visitor analytics
    const referrer = parseReferrer(req.query.ref || req.headers.referer || req.headers.referrer);
    const countryInfo = parseCountry(req);
    const userAgent = req.headers["user-agent"] || "";
    const device = parseDevice(userAgent);
    const browser = parseBrowser(userAgent);

    // Atomically increment views and update timestamps
    resume.viewsCount = (resume.viewsCount || 0) + 1;
    resume.lastViewedAt = new Date();

    // Ensure analytics container exists
    if (!resume.analytics) {
      resume.analytics = { countries: [], referrers: [], recentViews: [] };
    }
    if (!Array.isArray(resume.analytics.countries)) resume.analytics.countries = [];
    if (!Array.isArray(resume.analytics.referrers)) resume.analytics.referrers = [];
    if (!Array.isArray(resume.analytics.recentViews)) resume.analytics.recentViews = [];

    // Update country stats
    const cIndex = resume.analytics.countries.findIndex(
      (c) => c.code === countryInfo.code || c.country === countryInfo.country
    );
    if (cIndex >= 0) {
      resume.analytics.countries[cIndex].count = (resume.analytics.countries[cIndex].count || 0) + 1;
    } else {
      resume.analytics.countries.push({
        country: countryInfo.country,
        code: countryInfo.code,
        count: 1,
      });
    }

    // Update referrer stats
    const rIndex = resume.analytics.referrers.findIndex((r) => r.source === referrer);
    if (rIndex >= 0) {
      resume.analytics.referrers[rIndex].count = (resume.analytics.referrers[rIndex].count || 0) + 1;
    } else {
      resume.analytics.referrers.push({ source: referrer, count: 1 });
    }

    // Record recent view log
    resume.analytics.recentViews.push({
      viewedAt: new Date(),
      country: countryInfo.country,
      countryCode: countryInfo.code,
      referrer,
      device,
      browser,
    });
    if (resume.analytics.recentViews.length > 50) {
      resume.analytics.recentViews = resume.analytics.recentViews.slice(-50);
    }

    await resume.save();

    // Check unlock state if protected
    const isProtected = Boolean(resume.protection?.isProtected);
    const protectType = resume.protection?.protectType || "contact_only";
    let isUnlocked = false;

    const unlockToken = req.headers["x-unlock-token"] || req.query.unlockToken;
    if (unlockToken && isProtected) {
      try {
        const decoded = jwt.verify(
          unlockToken,
          process.env.JWT_SECRET || "resuma_secret_token"
        );
        if (decoded.resumeId === resume._id.toString() && decoded.unlocked) {
          isUnlocked = true;
        }
      } catch {}
    }

    let responseData = JSON.parse(JSON.stringify(resume.data || {}));

    if (isProtected && !isUnlocked) {
      if (protectType === "contact_only") {
        if (responseData.basics) {
          responseData.basics.email = "••••••••••••••";
          responseData.basics.phone = "••••••••••••••";
          if (responseData.basics.location) {
            responseData.basics.location = "Protected Location (PIN required)";
          }
          if (responseData.basics.url?.href) {
            responseData.basics.url.href = "#";
          }
        }
        if (responseData.sections?.profiles?.items) {
          responseData.sections.profiles.items = responseData.sections.profiles.items.map((p) => ({
            ...p,
            url: { label: p.network || "Profile Link", href: "#" },
          }));
        }
      } else if (protectType === "full") {
        responseData = {
          basics: {
            name: responseData.basics?.name || "Candidate",
            headline: "Protected Profile - Password Required to View",
          },
          sections: {},
          metadata: responseData.metadata || {},
        };
      }
    }

    res.json({
      _id: resume._id,
      title: resume.title,
      slug: resume.slug,
      thumbnailLink: resume.thumbnailLink,
      data: responseData,
      viewsCount: resume.viewsCount,
      lastViewedAt: resume.lastViewedAt,
      isProtected,
      isUnlocked,
      protectType,
      author: {
        name: resume.userId?.name || "Author",
        email: isProtected && !isUnlocked ? "" : (resume.userId?.email || ""),
        avatar: resume.userId?.profileImageURL || "",
      },
      updatedAt: resume.updatedAt,
    });
  } catch (error) {
    console.error("Get public resume error:", error);
    res.status(500).json({ message: "Failed to load public resume", error: error.message });
  }
};

// @desc    Export Resume as Vector PDF via Headless Chromium
// @route   GET /api/resume/:id/export-pdf
// @access  Private
const exportResumePdf = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    const token =
      req.headers.authorization?.split(" ")[1] ||
      req.cookies?.token ||
      (process.env.JWT_SECRET && req.user?._id
        ? jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })
        : "");

    let detectedOrigin = req.headers.origin;
    if (!detectedOrigin && req.headers.referer) {
      try {
        detectedOrigin = new URL(req.headers.referer).origin;
      } catch {}
    }
    const frontendUrl = (process.env.FRONTEND_URL || detectedOrigin || "http://localhost:5173").replace(/\/+$/, "");
    const paperFormat = resume.data?.metadata?.page?.format || req.query?.format || "a4";
    const mode = req.query?.mode || "resume";

    const pdfBuffer = await generateVectorPdf({
      resumeId: resume._id.toString(),
      token,
      slug: resume.slug,
      isPublic: false,
      frontendUrl,
      format: paperFormat,
      mode,
    });

    const baseTitle = (resume.title || "Resume").replace(/[^a-zA-Z0-9-_ ]/g, "").trim() || "Resume";
    let filename = `${baseTitle}.pdf`;
    if (mode === "cover-letter") {
      filename = `${baseTitle} - Cover Letter.pdf`;
    } else if (mode === "package") {
      filename = `${baseTitle} - Application Package.pdf`;
    }

    const binaryBuffer = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader("Content-Length", binaryBuffer.length);
    res.end(binaryBuffer);
  } catch (error) {
    console.error("Export PDF error:", error);
    res.status(500).json({ message: "Failed to generate vector PDF", error: error.message });
  }
};

// @desc    Export Public Resume as Vector PDF via Headless Chromium
// @route   GET /api/resume/public/:slug/export-pdf
// @access  Public
const exportPublicResumePdf = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      slug: req.params.slug,
      isPublic: { $ne: false },
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or is set to private." });
    }

    let detectedOrigin = req.headers.origin;
    if (!detectedOrigin && req.headers.referer) {
      try {
        detectedOrigin = new URL(req.headers.referer).origin;
      } catch {}
    }
    const frontendUrl = (process.env.FRONTEND_URL || detectedOrigin || "http://localhost:5173").replace(/\/+$/, "");
    const paperFormat = resume.data?.metadata?.page?.format || req.query?.format || "a4";

    const unlockToken = req.query.unlockToken || req.headers["x-unlock-token"] || "";

    const pdfBuffer = await generateVectorPdf({
      resumeId: resume._id.toString(),
      token: unlockToken,
      slug: resume.slug,
      isPublic: true,
      frontendUrl,
      format: paperFormat,
    });

    const safeTitle = (resume.title || "Resume").replace(/[^a-zA-Z0-9-_ ]/g, "").trim() || "Resume";
    const filename = `${safeTitle}.pdf`;
    const binaryBuffer = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader("Content-Length", binaryBuffer.length);
    res.end(binaryBuffer);
  } catch (error) {
    console.error("Export public PDF error:", error);
    res.status(500).json({ message: "Failed to generate vector PDF", error: error.message });
  }
};

// @desc    Export Resume as Editable Microsoft Word Document (.docx)
// @route   GET /api/resume/:id/export-docx
// @access  Private
const exportResumeDocx = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    const docxBuffer = await generateResumeDocx({
      resumeData: resume.data || {},
    });

    const safeTitle = (resume.title || "Resume").replace(/[^a-zA-Z0-9-_ ]/g, "").trim() || "Resume";
    const filename = `${safeTitle}.docx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(filename)}"`
    );
    res.setHeader("Content-Length", docxBuffer.length);
    res.end(docxBuffer);
  } catch (error) {
    console.error("Export DOCX error:", error);
    res.status(500).json({ message: "Failed to generate Word document", error: error.message });
  }
};

// @desc    Export Public Resume as Editable Microsoft Word Document (.docx)
// @route   GET /api/resume/public/:slug/export-docx
// @access  Public
const exportPublicResumeDocx = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      slug: req.params.slug,
      isPublic: { $ne: false },
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or is set to private." });
    }

    // Check unlock state if protected
    let isUnlocked = false;
    const unlockToken = req.query.unlockToken || req.headers["x-unlock-token"];
    if (unlockToken && resume.protection?.isProtected) {
      try {
        const decoded = jwt.verify(
          unlockToken,
          process.env.JWT_SECRET || "resuma_secret_token"
        );
        if (decoded.resumeId === resume._id.toString() && decoded.unlocked) {
          isUnlocked = true;
        }
      } catch {}
    }

    let resumeData = JSON.parse(JSON.stringify(resume.data || {}));
    if (resume.protection?.isProtected && !isUnlocked) {
      if (resume.protection?.protectType === "full") {
        return res.status(403).json({ message: "This resume is password protected. Please unlock before exporting." });
      }
      if (resumeData.basics) {
        resumeData.basics.email = "••••••••••••••";
        resumeData.basics.phone = "••••••••••••••";
        if (resumeData.basics.location) resumeData.basics.location = "Protected Location (PIN required)";
      }
    }

    const docxBuffer = await generateResumeDocx({
      resumeData,
    });

    const safeTitle = (resume.title || "Resume").replace(/[^a-zA-Z0-9-_ ]/g, "").trim() || "Resume";
    const filename = `${safeTitle}.docx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(filename)}"`
    );
    res.setHeader("Content-Length", docxBuffer.length);
    res.end(docxBuffer);
  } catch (error) {
    console.error("Export public DOCX error:", error);
    res.status(500).json({ message: "Failed to generate Word document", error: error.message });
  }
};

// @desc    Unlock a password-protected public resume
// @route   POST /api/resume/public/:slug/unlock
// @access  Public
const unlockPublicResume = async (req, res) => {
  try {
    const { slug } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password or PIN is required." });
    }

    const query = mongoose.Types.ObjectId.isValid(slug)
      ? { $or: [{ _id: slug }, { slug }] }
      : { slug };

    const resume = await Resume.findOne({ ...query, isPublic: { $ne: false } });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found." });
    }

    if (!resume.protection?.isProtected || !resume.protection?.passwordHash) {
      return res.json({
        success: true,
        message: "Resume is not password protected.",
        basics: resume.data?.basics,
        sections: resume.data?.sections,
        data: resume.data,
      });
    }

    const isMatch = await bcrypt.compare(String(password).trim(), resume.protection.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password or PIN. Please try again." });
    }

    const unlockToken = jwt.sign(
      { resumeId: resume._id.toString(), unlocked: true },
      process.env.JWT_SECRET || "resuma_secret_token",
      { expiresIn: "12h" }
    );

    res.json({
      success: true,
      message: "Contact info unlocked successfully.",
      unlockToken,
      basics: resume.data?.basics,
      sections: resume.data?.sections,
      data: resume.data,
    });
  } catch (error) {
    console.error("Unlock public resume error:", error);
    res.status(500).json({ message: "Failed to unlock resume", error: error.message });
  }
};

// @desc    Update custom public URL slug for a resume
// @route   PUT /api/resume/:id/slug
// @access  Private
const updateResumeSlug = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    const rawSlug = req.body.slug;
    if (!rawSlug || typeof rawSlug !== "string") {
      return res.status(400).json({ message: "Valid slug string is required." });
    }

    const cleanSlug = slugify(rawSlug, { lower: true, strict: true });
    if (cleanSlug.length < 3 || cleanSlug.length > 60) {
      return res.status(400).json({ message: "Slug must be between 3 and 60 characters." });
    }

    // Check collision across other resumes
    const collision = await Resume.findOne({
      slug: cleanSlug,
      _id: { $ne: resume._id },
    });

    if (collision) {
      return res.status(400).json({
        message: `The custom URL 'resuma.ai/p/${cleanSlug}' is already taken. Please choose another unique handle.`,
      });
    }

    resume.slug = cleanSlug;
    await resume.save();

    res.json({
      success: true,
      message: "Custom URL slug updated successfully.",
      slug: resume.slug,
    });
  } catch (error) {
    console.error("Update slug error:", error);
    res.status(500).json({ message: "Failed to update custom slug", error: error.message });
  }
};

// @desc    Update password protection settings for a resume
// @route   PUT /api/resume/:id/protection
// @access  Private
const updateResumeProtection = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    const { isProtected, password, protectType = "contact_only" } = req.body;

    if (!resume.protection) {
      resume.protection = {};
    }

    if (isProtected) {
      if (password && typeof password === "string" && password.trim().length > 0) {
        resume.protection.passwordHash = await bcrypt.hash(password.trim(), 10);
      } else if (!resume.protection.passwordHash) {
        return res.status(400).json({ message: "Please provide a password or PIN to enable protection." });
      }
      resume.protection.isProtected = true;
      resume.protection.protectType = protectType === "full" ? "full" : "contact_only";
    } else {
      resume.protection.isProtected = false;
      resume.protection.passwordHash = null;
    }

    resume.markModified('protection');
    await resume.save();

    res.json({
      success: true,
      message: isProtected ? "Password protection enabled successfully." : "Password protection disabled.",
      protection: {
        isProtected: resume.protection.isProtected,
        protectType: resume.protection.protectType,
        hasPassword: Boolean(resume.protection.passwordHash),
      },
    });
  } catch (error) {
    console.error("Update protection error:", error);
    res.status(500).json({ message: "Failed to update protection", error: error.message });
  }
};

// @desc    Get detailed recruiter analytics for resume owner
// @route   GET /api/resume/:id/analytics
// @access  Private
const getResumeAnalytics = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or unauthorized" });
    }

    const analytics = resume.analytics || { countries: [], referrers: [], recentViews: [] };

    // Sort countries & referrers by count descending
    const sortedCountries = [...(analytics.countries || [])].sort((a, b) => b.count - a.count);
    const sortedReferrers = [...(analytics.referrers || [])].sort((a, b) => b.count - a.count);
    const recentViews = [...(analytics.recentViews || [])].slice(-25).reverse();

    res.json({
      resumeId: resume._id,
      title: resume.title,
      slug: resume.slug,
      viewsCount: resume.viewsCount || 0,
      lastViewedAt: resume.lastViewedAt,
      protection: {
        isProtected: Boolean(resume.protection?.isProtected),
        protectType: resume.protection?.protectType || "contact_only",
        hasPassword: Boolean(resume.protection?.passwordHash),
      },
      countries: sortedCountries,
      referrers: sortedReferrers,
      recentViews,
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({ message: "Failed to load analytics", error: error.message });
  }
};

module.exports = {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
  duplicateResume,
  getPublicResume,
  unlockPublicResume,
  updateResumeSlug,
  updateResumeProtection,
  getResumeAnalytics,
  exportResumePdf,
  exportPublicResumePdf,
  exportResumeDocx,
  exportPublicResumeDocx,
};