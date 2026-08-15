const { prisma } = require('./lib/prisma');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { verifyToken } = require('@clerk/backend');

const app = express();
const PORT = 5000;

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

// 1. Get all submissions
app.get('/api/submissions', async (req, res) => {
  try {
    const submissions = await prisma.submission.findMany({
      orderBy: { createdAt: 'desc' },
      include: { reviews: true, user: true }
    });
    res.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 2. Create a submission
app.post('/api/submissions', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.upsert({
      where: { clerkId: req.user.sub },
      update: {},
      create: {
        clerkId: req.user.sub,
        email: req.user.email || null,
        name: req.user.firstName || req.user.email || 'Anonymous',
      }
    });

    const submission = await prisma.submission.create({
      data: {
        title: req.body.title,
        language: req.body.language,
        code: req.body.code,
        description: req.body.description,
        author: req.body.author || user.name || 'Anonymous',
        avatar: req.body.avatar || '',
        userId: user.id,
      }
    });

    res.status(201).json(submission);
  } catch (error) {
    console.error("Error creating submission:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 3. Submit a review and add +2 Karma points
app.post('/api/submissions/:id/reviews', requireAuth, async (req, res) => {
  try {
    const reviewUser = await prisma.user.upsert({
      where: { clerkId: req.user.sub },
      update: {},
      create: {
        clerkId: req.user.sub,
        email: req.user.email || null,
        name: req.user.firstName || 'Anonymous',
      }
    });

    const review = await prisma.review.create({
      data: {
        submissionId: req.params.id,
        reviewerId: reviewUser.id,
        strengths: req.body.strengths || '',
        improvements: req.body.improvements || '',
      }
    });

    // Reviewer karma+2 add
    await prisma.user.update({
      where: { id: reviewUser.id },
      data: {
        karma: {
          increment: 2
        }
      }
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});