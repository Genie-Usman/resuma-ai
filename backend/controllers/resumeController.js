const fs = require("node:fs");
const path = require("node:path");
const Resume = require('../models/Resume.js');
const User = require('../models/User.js');
const { getDefaultResumeData } = require('../utils/DefaultResume.js');
const { slugify } = require('../utils/helper.js');

// @desc    Create a new Resume
// @route   POST /api/resumes
// @access  Private
const createResume = async (req, res) => {
  try {
    const { title } = req.body;

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
    while (await Resume.findOne({ userId: user._id, slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const resumeData = getDefaultResumeData(user);

    const newResume = await Resume.create({
      userId: user._id,
      title,
      slug,
      data: resumeData
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

    res.json(resume);

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
        fs.unlinkSync(thumbnailPath);
      }
    }

    await resume.deleteOne();

    res.json({ message: "Resume deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

module.exports = { createResume, getUserResumes, getResumeById, updateResume, deleteResume };
