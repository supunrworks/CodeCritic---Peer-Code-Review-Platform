import { auth } from "@clerk/nextjs/server";
import { api } from "@/lib/api";

export default async function SubmissionPage({ params }) {
  const { id } = await params;
  const { userId, getToken } = await auth();
  const token = userId ? await getToken({ forceRefresh: true }) : null;

  let submission = null;

  try {
    submission = await api.getSubmission(id, token);
  } catch (err) {
    return <div>Failed to load submission</div>;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-lime-600">{submission.language}</p>
            <h2 className="mt-2 text-3xl font-bold text-zinc-900">{submission.title}</h2>
          </div>

          {userId && (
            <a
              href={`/submission/${id}/review`}
              className="inline-flex items-center rounded-lg bg-lime-500 px-4 py-2 font-semibold text-black transition hover:bg-lime-600"
            >
              Write a Review
            </a>
          )}
        </div>

        <div className="space-y-4 text-sm text-zinc-700">
          <p>{submission.description}</p>
          <div>
            <strong className="mr-2 text-zinc-900">Author:</strong>
            {submission.author || "Anonymous"}
          </div>
          <div>
            <strong className="mr-2 text-zinc-900">Code:</strong>
            <a href={submission.code} target="_blank" rel="noreferrer" className="text-lime-700 underline">
              {submission.code}
            </a>
          </div>
          <div>
            <strong className="mr-2 text-zinc-900">Reviews:</strong>
            {submission.reviews?.length || 0}
          </div>
        </div>
      </div>

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-xl font-bold text-zinc-900">Reviews</h3>

        {submission.reviews && submission.reviews.length > 0 ? (
          <div className="space-y-4">
            {submission.reviews.map((review) => (
              <div key={review.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <strong className="text-zinc-900">{review.reviewer?.name || "Anonymous reviewer"}</strong>
                  <span className="text-xs text-zinc-500">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-zinc-700">
                  <p>
                    <strong className="mr-2 text-zinc-900">Strengths:</strong>
                    {review.strengths || "No strengths noted."}
                  </p>
                  <p>
                    <strong className="mr-2 text-zinc-900">Improvements:</strong>
                    {review.improvements || "No improvements noted."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-500">No reviews yet. Be the first to review this post.</p>
        )}
      </section>
    </main>
  );
}