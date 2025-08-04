const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String }, // Make content optional since we can have image-only posts
    imageUrl: { type: String } // New field for the image URL
}, { timestamps: true });

module.exports = mongoose.model("Post", PostSchema);
