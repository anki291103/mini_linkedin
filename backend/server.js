const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

// Middleware to serve static images from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Correct placement for CORS middleware to apply to all routes
app.use(cors());
app.use(express.json());

// ✅ Import route files
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');

// ✅ Use them correctly
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// DB Connect
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));
    
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

