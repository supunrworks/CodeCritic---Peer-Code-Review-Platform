"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api";

export default function ReviewPage() {
  const router = useRouter();
  const params = useParams();
  const submissionId = params.id;
  const { getToken } = useAuth();

  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [resourceUrls, setResourceUrls] = useState("");
  const [scores, setScores] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = await getToken();

      if (!token) {
        throw new Error("Not signed in");
      }

      const urls = resourceUrls
        .split(",")
        .map((u) => u.trim())
        .filter(Boolean);

      const ratings = Object.entries(scores).map(
        ([criterionId, score]) => ({
          criterionId,
          score,
        })
      );

      await api.submitReview(
        submissionId,
        {
          strengths,
          improvements,
          resourceUrls: urls,
          ratings,
        },
        token
      );

      router.push(`/submissions/${submissionId}`);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "600px" }}>
      <h2>Write a Review</h2>

      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Strengths</label>
          <textarea
            value={strengths}
            onChange={(e) => setStrengths(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
            required
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Areas for Improvement</label>
          <textarea
            value={improvements}
            onChange={(e) => setImprovements(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
            required
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Resource URLs (comma-separated)</label>
          <input
            type="text"
            value={resourceUrls}
            onChange={(e) => setResourceUrls(e.target.value)}
            placeholder="https://example.com, https://docs.com"
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: loading ? "#ccc" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}