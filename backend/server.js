const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Dummy Data Store 
let submissions = [
  {
    id: "1",
    title: "Refactoring React Custom Hook for Auth",
    language: "JavaScript",
    code: "https://github.com/example/react-auth-hook",
    description: "Looking for code review on performance and readability.",
    author: "Gagana",
    createdAt: new Date().toISOString()
  }
];

// 1. Get all submissions FOR FEED API
app.get('/api/submissions', (req, res) => {
  res.json(submissions);
});

// 2. Add a new submission
app.post('/api/submissions', (req, res) => {
  const newSubmission = {
    id: Date.now().toString(),
    ...req.body,
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

// Server run
app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});