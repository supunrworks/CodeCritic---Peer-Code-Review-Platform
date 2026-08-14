const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request(path, options = {}, token = null) {
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed: ${res.status}`);
    }

    return res.json();
}

export const api = {
    getFeed: (params = {}, token) =>
        request("/api/submissions", { method: "GET" }, token),

    createSubmission: (data, token) =>
        request(
            "/api/submissions",
            {
                method: "POST",
                body: JSON.stringify(data),
            },
            token
        ),

    submitReview: (submissionId, data, token) =>
        request(
            `/api/submissions/${submissionId}/reviews`,
            {
                method: "POST",
                body: JSON.stringify(data),
            },
            token
        ),

    getProfile: (username) =>
        request(`/api/users/${username}`),
};