const fs = require("node:fs");
const path = require("node:path");
const Resume = require('../models/Resume.js');
const User = require('../models/User.js');
const { getDefaultResumeData } = require('../utils/DefaultResume.js');
const { slugify } = require('../utils/helper.js');
const { generateVectorPdf } = require('../services/pdfService');

const mongoose = require("mongoose");

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

// @desc    Get public Resume by slug or ID & track recruiter views
// @route   GET /api/resume/public/:slug
// @access  Public
const getPublicResume = async (req, res) => {
  try {
    const { slug } = req.params;

    // Check if query is valid MongoDB ObjectId or text slug
    const query = mongoose.Types.ObjectId.isValid(slug)
      ? { $or: [{ _id: slug }, { slug }] }
      : { slug };

    // Find resume and increment view count atomically
    const resume = await Resume.findOneAndUpdate(
      { ...query, isPublic: { $ne: false } },
      {
        $inc: { viewsCount: 1 },
        $set: { lastViewedAt: new Date() },
      },
      { new: true }
    ).populate("userId", "name email profileImageURL");

    if (!resume) {
      return res.status(404).json({ message: "Resume not found or is set to private." });
    }

    res.json({
      _id: resume._id,
      title: resume.title,
      slug: resume.slug,
      thumbnailLink: resume.thumbnailLink,
      data: resume.data,
      viewsCount: resume.viewsCount,
      lastViewedAt: resume.lastViewedAt,
      author: {
        name: resume.userId?.name || "Author",
        email: resume.userId?.email || "",
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

    const token = req.headers.authorization?.split(" ")[1] || "";

    const pdfBuffer = await generateVectorPdf({
      resumeId: resume._id.toString(),
      token,
      slug: resume.slug,
      isPublic: false,
    });

    const safeTitle = (resume.title || "Resume").replace(/[^a-zA-Z0-9-_ ]/g, "").trim() || "Resume";
    const filename = `${safeTitle}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    res.send(pdfBuffer);
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

    const pdfBuffer = await generateVectorPdf({
      resumeId: resume._id.toString(),
      slug: resume.slug,
      isPublic: true,
    });

    const safeTitle = (resume.title || "Resume").replace(/[^a-zA-Z0-9-_ ]/g, "").trim() || "Resume";
    const filename = `${safeTitle}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Export public PDF error:", error);
    res.status(500).json({ message: "Failed to generate vector PDF", error: error.message });
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
  exportResumePdf,
  exportPublicResumePdf,
};