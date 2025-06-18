import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true, },
        slug: { type: String, required: true },
        thumbnailLink: { type: String},
        template: { theme: String, colorPalette: [String] },
        data: { type: mongoose.Schema.Types.Mixed, default: {} },
        visibility: { type: String, enum: ['public', 'private', 'unlisted'], default: 'private' },
        locked: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Index to ensure slug is unique per user
ResumeSchema.index({ userId: 1, slug: 1 }, { unique: true });

// Index to speed up user-based queries
ResumeSchema.index({ userId: 1 });

module.exports = mongoose.model('Resume', ResumeSchema);
