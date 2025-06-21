const fs = require('fs');
const path = require('path');
const Resume = require('../models/Resume');
const upload = require('../middlewares/uploadMiddleware');

const uploadResumeImages = async (req, res) => {
    try {
        upload.fields([{ name: 'thumbnail' }, { name: 'profileImage' }])(req, res, async (error) => {
            if (error) {
                return res.status(400).json({ message: 'File upload failed', error: error.message });
            }

            const resumeId = req.params.id;
            const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });

            if (!resume) {
                return res.status(404).json({ message: 'Resume not found or unauthorized' });
            }

            const uploadsFolder = path.join(__dirname, '..', 'uploads');
            const baseUrl = `${req.protocol}://${req.get('host')}`;

            const newThumbnail = req.files.thumbnail?.[0];
            const newProfileImage = req.files.profileImage?.[0];

            if (newThumbnail) {
                if (resume.thumbnailLink) {
                    const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
                    if (fs.existsSync(oldThumbnail)) fs.unlinkSync(oldThumbnail);
                }
                resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`;
            }

            if (newProfileImage) {
                // Clean up previous image if exists
                const oldUrl = resume.data?.basics?.picture?.url;
                if (oldUrl) {
                    const oldProfile = path.join(uploadsFolder, path.basename(oldUrl));
                    if (fs.existsSync(oldProfile)) fs.unlinkSync(oldProfile);
                }

                // Set the new profile image URL safely
                resume.data = resume.data || {};
                resume.data.basics = resume.data.basics || {};
                resume.data.basics.picture = resume.data.basics.picture || {};
                resume.data.basics.picture.url = `${baseUrl}/uploads/${newProfileImage.filename}`;
            }

            await resume.save();

            res.status(200).json({
                message: 'Images uploaded successfully',
                thumbnailLink: resume.thumbnailLink,
                profileImageUrl: resume.data?.basics?.picture?.url || null,
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to upload images', error: error.message });
    }
};

module.exports = { uploadResumeImages };
