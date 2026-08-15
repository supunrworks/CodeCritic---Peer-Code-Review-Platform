import { auth } from "@clerk/nextjs/server";
import { api } from "@/lib/api";

export default async function SubmissionPage({ params }) {
  const { getToken, userId } = auth();
  const token = userId ? await getToken() : null;

  let submission = null;

  try {
    const data = await api.getSubmission(params.id, token);
    submission = data;
  } catch (err) {
    return <div>Failed to load submission</div>;
  }

  return (
    <div>
      <h2>{submission.title}</h2>
      <p>{submission.description}</p>

      <div>
        <strong>GitHub:</strong>{" "}
        <a href={submission.githubUrl}>{submission.githubUrl}</a>
      </div>

      <div>
        <strong>Tech Stack:</strong>{" "}
        {submission.techStack.join(", ")}
      </div>

      <div>
        <strong>Status:</strong> {submission.status}
      </div>

      <h3>Criteria to Review</h3>
      <ul>
        {submission.criteria.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>

      {userId && (
        <a
          href={`/submission/${params.id}/review`}
          style={{
            marginTop: "1rem",
            display: "inline-block",
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "white",
            borderRadius: "4px",
            textDecoration: "none",
          }}
        >
          Write a Review
        </a>
      )}
    </div>
  );
}