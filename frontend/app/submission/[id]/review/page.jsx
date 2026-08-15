"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api";

export default function ReviewPage() {
  const router = useRouter();
  const params = useParams();
  const submissionId = params.id;
  const { getToken, isSignedIn } = useAuth();

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
      if (!isSignedIn) {
        throw new Error("Not signed in");
      }

      const token = await getToken({ forceRefresh: true });

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

      router.push(`/submission/${submissionId}`);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center px-2 py-3">
      <div className="w-full max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Write a Review
        </h2>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="strengths"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Feedback
            </label>

            <textarea
              id="strengths"
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              required
              rows={8}
              className="min-h-[180px] w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="What did they do well?"
            />
          </div>

          <div>
            <label
              htmlFor="improvements"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Areas for Improvement
            </label>

            <textarea
              id="improvements"
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              required
              rows={8}
              className="min-h-[180px] w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="What could be improved?"
            />
          </div>

          <div>
            <label
              htmlFor="resourceUrls"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Resource URLs
            </label>

            <input
              id="resourceUrls"
              type="text"
              value={resourceUrls}
              onChange={(e) => setResourceUrls(e.target.value)}
              placeholder="https://example.com, https://docs.com"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

            <p className="mt-2 text-xs text-gray-500">
              Enter multiple URLs separated by commas.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-green-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}