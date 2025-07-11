const mongoose = require("mongoose")

const ResumeSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        slug: { type: String, required: true },
        thumbnailLink: { type: String },
        data: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    { timestamps: true }
);

// Unique slug per user
ResumeSchema.index({ userId: 1, slug: 1 }, { unique: true });
// Speed up user-based queries
ResumeSchema.index({ userId: 1 });

module.exports = mongoose.model('Resume', ResumeSchema);
