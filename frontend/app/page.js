'use client';

import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Trash2 } from 'lucide-react';
import { deleteSubmission, getSubmissions } from '@/lib/api';

const DEFAULT_AVATAR = 'https://github.com/shadcn.png';

const DUMMY_SUBMISSIONS = [
  {
    id: 'api-errors',
    title: 'Improve API error handling',
    language: 'JavaScript',
    code: 'https://github.com/example/api-error-demo',
    description: 'Looking for feedback on error handling and response validation.',
    author: 'Alex Morgan',
    avatar: DEFAULT_AVATAR,
    createdAt: '2026-09-04T10:00:00.000Z',
  },
  {
    id: 'dashboard',
    title: 'React dashboard performance',
    language: 'React',
    code: 'https://github.com/example/react-dashboard-demo',
    description: 'Please review component structure and rendering performance.',
    author: 'Jamie Lee',
    avatar: DEFAULT_AVATAR,
    createdAt: '2026-09-03T10:00:00.000Z',
  },
];

export default function Home() {
  const [submissions, setSubmissions] = useState(DUMMY_SUBMISSIONS);
  const { getToken, userId } = useAuth();

  useEffect(() => {
    getSubmissions()
      .then((data) => setSubmissions([...data, ...DUMMY_SUBMISSIONS]))
      .catch((error) => console.error('Fetch error:', error));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;

    try {
      const token = await getToken();
      await deleteSubmission(id, token);
      setSubmissions((current) => current.filter((submission) => submission.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <main className="max-w-4xl mx-auto w-full px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold">Code Review Feed</h2>


        <Link href="/new">
          <button className="bg-lime-300 text-black font-bold px-4 py-2 rounded-lg hover:bg-lime-600 transition">
            + Post Request
          </button>
        </Link>
      </div>

      <div className="space-y-4">
        {submissions.map((item) => (
            <div key={item.id} className="border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10 border border-zinc-200">
                  <AvatarImage src={item.avatar || DEFAULT_AVATAR} alt={item.author || 'User avatar'} />
                  <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                  <AvatarFallback>
                    {(item.author || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-semibold text-sm">{item.author || 'Unknown author'}</p>
                  <p className="text-xs text-zinc-500">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                      : 'Just now'}
                  </p>
                </div>
              </div>

              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-bold">{item.title}</h3>
                {item.user?.clerkId === userId && (
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 transition hover:text-red-800"
                    title="Delete post"
                    aria-label={`Delete ${item.title}`}
                  >
                    <Trash2 size={17} />
                  </button>
                )}
              </div>
              <p className="text-zinc-300 text-sm mt-1">{item.description}</p>

              <div className="flex gap-2 my-4">
                <span className="bg-zinc-100 text-zinc-700 text-xs font-semibold px-2.5 py-1 rounded-md">
                  {item.language}
                </span>
              </div>

              <a
                href={item.code}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-lime-600 underline hover:text-lime-700"
              >
                Open GitHub repository
              </a>
              <br></br>

              <Link href={`/submission/${item.id}`} className="inline-flex items-center text-sm font-bold text-lime-600 hover:text-lime-700">
                View &amp; Review &rarr;
              </Link>
            </div>
        ))}
      </div>
    </main>
  );
}