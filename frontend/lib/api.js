const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : '/api';

// Helper to get Clerk token (for use in client components)
export async function getClerkToken() {
  const { getToken } = await import('@clerk/nextjs');
  return await getToken();
}

// 1. All Submissions
export async function fetchSubmissions() {
  try {
    const res = await fetch(`${API_BASE_URL}/submissions`, { cache: 'no-store' });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`HTTP ${res.status}: ${error || 'Failed to fetch submissions'}`);
    }
    return res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export const getSubmissions = fetchSubmissions;

// 2. Submission by ID
export async function getSubmissionById(id) {
  const res = await fetch(`${API_BASE_URL}/submissions/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch submission details');
  return res.json();
}

export const fetchSubmissionById = getSubmissionById;

// 3. Create Submission (Protected - requires auth token)
export async function createSubmission(data, token) {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  const res = await fetch(`${API_BASE_URL}/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'Failed to create submission');
  }
  return res.json();
}

// 4. Submit a review for a submission (Protected - requires auth token)
export const api = {
  getSubmission: async function (id, token) {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE_URL}/submissions/${id}`, {
      headers,
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch submission');
    return res.json();
  },
  submitReview: async function (submissionId, reviewData, token) {
    if (!token) {
      throw new Error('Authentication token is required to submit a review');
    }

    const res = await fetch(`${API_BASE_URL}/submissions/${submissionId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Failed to submit review');
    }

    return res.json();
  },
};