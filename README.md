Mini-LinkedIn Community Platform
This project is a full-stack web application built as a challenge for the Full Stack Development Internship at CIAAN Cyber Tech. It mimics core features of a professional social networking platform, allowing users to authenticate, create posts, and manage their profiles.

Table of Contents
Features

Tech Stack

Extra Features

Setup Instructions

Live Demo

Features
User Authentication: Secure registration and login using email and password.

User Profile: A dedicated page for each user displaying their name, email, bio, and all their posts.

Public Post Feed: A dynamic home feed that displays all posts from all users in descending chronological order (newest first).

Post Management: Users can create new posts from the home page.

Tech Stack
Frontend: React.js

Backend: Node.js with Express.js

Database: MongoDB (via Mongoose ODM)

Styling: Custom CSS, following a consistent design system.

Middleware: jsonwebtoken for authentication, bcryptjs for password hashing, cors for cross-origin resource sharing, and multer for image uploads.

Extra Features
This application goes beyond the basic requirements to include:

Image Uploads: Users can create posts with images, making the feed more engaging.

Edit & Delete Posts: Users can edit and delete their own posts directly from their profile page.

Polished UI/UX: The entire application features a clean, professional, and responsive design with a consistent color palette, typography, and interactive elements.

Timestamp Formatting: Posts are displayed with a "time ago" format (e.g., "5m ago"), providing a better user experience.

Setup Instructions
Prerequisites
Node.js installed on your machine

MongoDB Atlas account or a local MongoDB instance

Backend Setup
Navigate to the backend directory: cd backend

Install dependencies: npm install

Create a .env file in the backend directory and add the following:

PORT=5000
MONGO_URI=<Your MongoDB Connection String>
JWT_SECRET=<A long, random secret string>

Start the backend server: npm start (or node index.js)

Frontend Setup
Navigate to the frontend directory: cd frontend

Install dependencies: npm install

Start the React development server: npm start

The application will be available at http://localhost:3000 (or another port if specified).

Live Demo
(Replace this with your live demo URL after deployment)

Admin/Demo User Logins
Email: demo@example.com

Password: password123

Bio: Full Stack Developer with a passion for building beautiful and functional web applications.
