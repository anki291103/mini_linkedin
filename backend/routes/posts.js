const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');
const verifyToken = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure 'uploads' directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Set up Multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Create post with optional image upload
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
    try {
        console.log('Received new post request.');
        console.log('Request Body:', req.body);
        console.log('Request File:', req.file);

        // Check if at least one field (content or image) is present
        if (!req.body.content && !req.file) {
            console.error("Error: Post is empty.");
            return res.status(400).json("Post cannot be empty.");
        }

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
        const newPost = new Post({
            userId: req.user.id,
            content: req.body.content,
            imageUrl: imageUrl
        });
        const savedPost = await newPost.save();
        console.log('Post created successfully:', savedPost);
        res.status(201).json(savedPost);
    } catch (err) {
        console.error("Post creation error:", err);
        res.status(500).json("Server error: " + err.message);
    }
});

// New route to edit a post
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json("Post not found.");
    }
    
    // Check if the user is the owner of the post
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json("You can only edit your own posts.");
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: { content: req.body.content } },
      { new: true, runValidators: true }
    );

    res.json(updatedPost);

  } catch (err) {
    console.error("Post update error:", err);
    res.status(500).json(err.message);
  }
});

// New route to delete a post
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json("Post not found.");
    }

    // Check if the user is the owner of the post
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json("You can only delete your own posts.");
    }

    await post.deleteOne();
    res.status(200).json("Post deleted successfully.");

  } catch (err) {
    console.error("Post deletion error:", err);
    res.status(500).json(err.message);
  }
});

// Get all posts with author info
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate('userId', 'name');
        const formatted = posts.map(p => ({
            _id: p._id,
            content: p.content,
            imageUrl: p.imageUrl,
            author: p.userId.name,
            userId: p.userId._id,
            timestamp: p.createdAt
        }));
        res.json(formatted);
    } catch (err) {
        console.error("Post fetch error:", err);
        res.status(500).json(err.message);
    }
});

module.exports = router;
