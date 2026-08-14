const API_BASE_URL = 'http://localhost:5000/api';

// 1. All Submissions 
export async function fetchSubmissions() {
  const res = await fetch(`${API_BASE_URL}/submissions`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch submissions');
  return res.json();
}

export const getSubmissions = fetchSubmissions;

// 2. Submission by ID 
export async function getSubmissionById(id) {
  const res = await fetch(`${API_BASE_URL}/submissions/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch submission details');
  return res.json();
}

export const fetchSubmissionById = getSubmissionById;

// 3. Create Submission
export async function createSubmission(data) {
  const res = await fetch(`${API_BASE_URL}/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Failed to create submission');
  return res.json();
}