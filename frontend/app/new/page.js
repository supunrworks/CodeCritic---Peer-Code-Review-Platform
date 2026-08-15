'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@clerk/nextjs';
import { createSubmission } from '@/lib/api';

const DEFAULT_AVATAR = 'https://github.com/shadcn.png';

export default function NewSubmissionPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { getToken, isSignedIn } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    language: '',
    code: '',
    description: '',
    author: '',
    avatar: DEFAULT_AVATAR
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || 'Anonymous';
    const avatarUrl = user.imageUrl || DEFAULT_AVATAR;

    setFormData((prev) => ({
      ...prev,
      author: prev.author || fullName,
      avatar: avatarUrl
    }));
  }, [isLoaded, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!isLoaded || !isSignedIn) {
        throw new Error('Authentication required. Please sign in again.');
      }

      const token = await getToken({ forceRefresh: true });
      if (!token) {
        throw new Error('Authentication required. Please sign in again.');
      }

      const submission = {
        title: formData.title,
        language: formData.language,
        code: formData.code,
        description: formData.description,
        author: formData.author || 'Anonymous',
        avatar: formData.avatar || DEFAULT_AVATAR,
      };

      await createSubmission(submission, token);
      router.push('/');
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button onClick={() => router.push('/')} className="mb-6 text-sm text-lime-300 hover:text-lime-600 transition">
        ← Back to Feed
      </button>
      <div className="bg-white text-black border rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Create Code Review Request</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              required
              className=" w-full border rounded-lg border-mauve-500 p-2.5 text-sm "
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <input
                type="text"
                required
                className="w-full border rounded-lg p-2.5 text-sm border-mauve-500"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Your Name</label>
              <input
                type="text"
                required
                className="w-full border rounded-lg p-2.5 text-sm border-mauve-500"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Repository / Code Link</label>
            <input
              type="url"
              required
              className="w-full border rounded-lg p-2.5 text-sm border-mauve-500"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              rows={4}
              required
              className="w-full border rounded-lg p-2.5 text-sm border-mauve-500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-lime-500 text-black font-semibold py-2.5 rounded-lg hover:bg-lime-600 transition"
          >
            {loading ? 'Submitting...' : 'Post Request'}
          </button>
        </form>
      </div>
    </div>
  );
}