const Resume = require('../models/Resume');
const { uploadMedia } = require('../config/cloudinary');

const uploadResumeImages = async (req, res) => {
  try {
    const resumeId = req.params.id;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found or unauthorized' });
    }

    const newThumbnail = req.files?.thumbnail?.[0];
    const newProfileImage = req.files?.profileImage?.[0];

    if (newThumbnail) {
      const thumbnailUrl = await uploadMedia(
        newThumbnail.buffer,
        newThumbnail.originalname || `thumbnail-${resumeId}.png`,
        req,
        { folder: "resuma_ai/thumbnails" }
      );
      resume.thumbnailLink = thumbnailUrl;
    }

    if (newProfileImage) {
      const profileUrl = await uploadMedia(
        newProfileImage.buffer,
        newProfileImage.originalname || `profile-${resumeId}.png`,
        req,
        { folder: "resuma_ai/profiles" }
      );

      resume.data = resume.data || {};
      resume.data.basics = resume.data.basics || {};
      resume.data.basics.picture = resume.data.basics.picture || {};
      resume.data.basics.picture.url = profileUrl;
    }

    await resume.save();

    res.status(200).json({
      message: 'Images uploaded successfully',
      thumbnailLink: resume.thumbnailLink,
      profileImageUrl: resume.data?.basics?.picture?.url || null,
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload images', error: error.message });
  }
};

module.exports = { uploadResumeImages };