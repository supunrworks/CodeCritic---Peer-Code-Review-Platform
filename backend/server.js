require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { verifyToken } = require('@clerk/backend');

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Clerk Token Verification Middleware
const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Missing authorization token' });
  }

  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    req.user = payload;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Dummy Data Store 
let submissions = [
  {
    id: "1",
    title: "Refactoring React Custom Hook for Auth",
    language: "JavaScript",
    code: "https://github.com/example/react-auth-hook",
    description: "Looking for code review on performance and readability.",
    author: "Gagana",
    avatar: "https://github.com/shadcn.png",
    createdAt: new Date().toISOString()
  }
];

let reviews = [];

// 1. Get all submissions FOR FEED API
app.get('/api/submissions', (req, res) => {
  res.json(submissions);
});

// 2. Add a new submission (Protected)
app.post('/api/submissions', requireAuth, (req, res) => {
  const newSubmission = {
    id: Date.now().toString(),
    ...req.body,
    userId: req.user.sub, // Store Clerk user ID
    avatar: req.body.avatar || '',
    author: req.body.author || req.user.firstName || req.user.email || 'Anonymous',
    createdAt: new Date().toISOString()
  };
  submissions.unshift(newSubmission);
  res.status(201).json(newSubmission);
});

// 3. Get submission by ID (Fixed String matching)
app.get('/api/submissions/:id', (req, res) => {
  const { id } = req.params;
  const submission = submissions.find((s) => String(s.id) === String(id));
  
  if (!submission) {
    return res.status(404).json({ message: 'Submission not found' });
  }
  
  res.json(submission);
});

// 4. Get all reviews for a submission
app.get('/api/submissions/:id/reviews', (req, res) => {
  const { id } = req.params;
  const submissionReviews = reviews.filter((r) => String(r.submissionId) === String(id));
  res.json(submissionReviews);
});

// 5. Submit a review for a submission (Protected)
app.post('/api/submissions/:id/reviews', requireAuth, (req, res) => {
  const { id } = req.params;
  
  // Check if submission exists
  const submission = submissions.find((s) => String(s.id) === String(id));
  if (!submission) {
    return res.status(404).json({ message: 'Submission not found' });
  }

  const newReview = {
    id: Date.now().toString(),
    submissionId: id,
    userId: req.user.sub,
    reviewer: req.user.firstName || req.user.email || 'Anonymous',
    strengths: req.body.strengths || '',
    improvements: req.body.improvements || '',
    resourceUrls: req.body.resourceUrls || [],
    ratings: req.body.ratings || [],
    createdAt: new Date().toISOString()
  };

  reviews.push(newReview);
  res.status(201).json(newReview);
});

// Server run
app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});