require('dotenv').config();
const { prisma } = require('./lib/prisma');

const express = require('express');
const cors = require('cors');
const { verifyToken } = require('@clerk/backend');

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors({
  origin: [
    'https://code-critic-peer-code-review-platfo.vercel.app',
    'https://code-critic-peer-code-review-platfo-beta.vercel.app',
    'http://localhost:3000',
  ],
}));
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

// Get the signed-in user's karma
app.get('/api/user/karma', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.upsert({
      where: { clerkId: req.user.sub },
      update: {},
      create: {
        clerkId: req.user.sub,
        email: req.user.email || null,
        name: req.user.firstName || req.user.email || 'Anonymous',
      },
      select: { karma: true },
    });

    res.json(user);
  } catch (error) {
    console.error('Error fetching user karma:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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

// 1b. Get a single submission with its reviews
app.get('/api/submissions/:id', async (req, res) => {
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: req.params.id },
      include: {
        user: true,
        reviews: {
          include: { reviewer: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.json(submission);
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ error: 'Internal server error' });
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

// Delete a submission owned by the signed-in user
app.delete('/api/submissions/:id', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: req.user.sub },
    });

    const submission = await prisma.submission.findUnique({
      where: { id: req.params.id },
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    if (!user || submission.userId !== user.id) {
      return res.status(403).json({ error: 'You can only delete your own posts' });
    }

    await prisma.$transaction([
      prisma.review.deleteMany({
        where: { submissionId: submission.id },
      }),
      prisma.submission.delete({
        where: { id: submission.id },
      }),
    ]);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ error: 'Internal server error' });
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});