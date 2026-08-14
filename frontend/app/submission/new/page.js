"use client";
import { useState } from "react";

export default function CreateSubmission() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    githubUrl: "",
    techStack: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6 border">
      <h1 className="text-2xl font-bold mb-6">Request a Code Review</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Project Title</label>
          <input
            type="text"
            required
            className="w-full border p-2 rounded focus:outline-lime-500"
            placeholder="e.g. Next.js Auth System"
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">GitHub Repository Link</label>
          <input
            type="url"
            required
            className="w-full border p-2 rounded focus:outline-lime-500"
            placeholder="https://github.com/user/repo"
            onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description & What to Review</label>
          <textarea
            required
            rows="4"
            className="w-full border p-2 rounded focus:outline-lime-500"
            placeholder="Describe what areas you need feedback on..."
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          ></textarea>
        </div>

        <div>
          <label className="block font-medium mb-1">Tech Stack (Comma separated)</label>
          <input
            type="text"
            required
            className="w-full border p-2 rounded focus:outline-lime-500"
            placeholder="React, Express, PostgreSQL"
            onChange={(e) => setFormData({...formData, techStack: e.target.value})}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-lime-500 text-black py-2 rounded-lg font-bold hover:bg-lime-600 transition"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}