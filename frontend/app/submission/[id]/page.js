"use client";
import { useState } from "react";

export default function SubmissionDetail() {
  const [review, setReview] = useState({
    strengths: "",
    improvements: "",
    rating: 8,
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    alert("Review Submitted! (+2 Karma)");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h1 className="text-2xl font-bold mb-2">E-Commerce App Code Review</h1>
        <p className="text-gray-600 mb-4">Need feedback on my React & Node.js backend structure.</p>
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noreferrer"
          className="bg-black text-white px-3 py-1.5 rounded text-sm hover:bg-gray-800 inline-block"
        >
          View GitHub Repo ↗
        </a>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-bold mb-4">Submit Your Review</h2>
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">What was done well? (Strengths)</label>
            <textarea
              required
              rows="3"
              className="w-full border p-2 rounded focus:outline-lime-500"
              onChange={(e) => setReview({...review, strengths: e.target.value})}
            ></textarea>
          </div>

          <div>
            <label className="block font-medium mb-1">What needs improvement?</label>
            <textarea
              required
              rows="3"
              className="w-full border p-2 rounded focus:outline-lime-500"
              onChange={(e) => setReview({...review, improvements: e.target.value})}
            ></textarea>
          </div>

          <div>
            <label className="block font-medium mb-1">Rating (1 to 10): {review.rating}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={review.rating}
              className="w-full accent-lime-500"
              onChange={(e) => setReview({...review, rating: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className="bg-lime-500 text-black px-6 py-2 rounded-lg font-bold hover:bg-lime-600 transition"
          >
            Submit Review (+2 Karma)
          </button>
        </form>
      </div>
    </div>
  );
}