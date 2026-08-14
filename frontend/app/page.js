'use client';

import { useEffect, useState } from 'react';
import { getSubmissions } from '@/lib/api';
import Link from 'next/link';

export default function Home() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubmissions()
      .then((data) => {
        setSubmissions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="max-w-4xl mx-auto w-full px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-zinc-900">Code Review Feed</h2>
        
        
        <Link href="/new">
          <button className="bg-lime-500 text-black font-bold px-4 py-2 rounded-lg hover:bg-lime-600 transition">
            + Post Request
          </button>
        </Link>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-10 text-zinc-500 font-medium">
          Loading submissions from backend...
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((item) => (
            <div key={item.id} className="border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold text-zinc-900">{item.title}</h3>
              <p className="text-zinc-600 text-sm mt-1">{item.description}</p>
              
              <div className="flex gap-2 my-4">
                <span className="bg-zinc-100 text-zinc-700 text-xs font-semibold px-2.5 py-1 rounded-md">
                  {item.language}
                </span>
                {item.author && (
                  <span className="bg-zinc-100 text-zinc-500 text-xs font-semibold px-2.5 py-1 rounded-md">
                    By {item.author}
                  </span>
                )}
              </div>

              <Link href={`/submission/${item.id}`} className="inline-flex items-center text-sm font-bold text-lime-600 hover:text-lime-700">
                View &amp; Review &rarr;
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}