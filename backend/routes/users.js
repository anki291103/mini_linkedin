const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');
const verifyToken = require('../middleware/auth');

// Get user profile and posts
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        const posts = await Post.find({ userId: user._id }).sort({ createdAt: -1 });
        const postsWithAuthor = await Post.populate(posts, { path: 'userId', select: 'name' });
        const formattedPosts = postsWithAuthor.map(p => ({
            _id: p._id,
            content: p.content,
            imageUrl: p.imageUrl,
            author: p.userId.name,
            userId: p.userId._id,
            createdAt: p.createdAt
        }));
        res.json({ user, posts: formattedPosts });
    } catch (err) {
        res.status(500).json(err.message);
    }
});

// Update user profile
router.patch('/:id', verifyToken, async (req, res) => {
    try {
        if (req.user.id !== req.params.id) {
            return res.status(403).json("You can only update your own profile.");
        }
        
        const { name, bio } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { name, bio } },
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json("User not found.");
        }

        res.json(user);
    } catch (err) {
        res.status(500).json(err.message);
    }
});

module.exports = router;
