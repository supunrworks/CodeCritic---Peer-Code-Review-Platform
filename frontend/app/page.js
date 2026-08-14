import Link from "next/link";

export default function HomePage() {
  const sampleSubmissions = [
    {
      id: "1",
      title: "E-Commerce App Code Review",
      description: "Need feedback on my React & Node.js backend structure.",
      techStack: ["Next.js", "Node.js", "Express"],
      status: "Pending",
    },
    {
      id: "2",
      title: "Portfolio Website Review",
      description: "Looking for UI/UX and code quality improvements.",
      techStack: ["React", "Tailwind CSS"],
      status: "Reviewed",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Code Review Feed</h1>
        <Link 
          href="/submissions/new" 
          className="bg-lime-500 text-black font-semibold px-4 py-2 rounded-lg hover:bg-lime-600 transition"
        >
          + Post Request
        </Link>
      </div>

      <div className="grid gap-4">
        {sampleSubmissions.map((sub) => (
          <div key={sub.id} className="border p-5 rounded-lg shadow-sm bg-white">
            <h2 className="text-xl font-semibold mb-2">{sub.title}</h2>
            <p className="text-gray-600 mb-3">{sub.description}</p>
            <div className="flex gap-2 mb-4">
              {sub.techStack.map((tech) => (
                <span key={tech} className="bg-gray-100 text-xs px-2 py-1 rounded border">
                  {tech}
                </span>
              ))}
            </div>
            <Link 
              href={`/submissions/${sub.id}`} 
              className="text-lime-600 font-semibold hover:underline text-sm"
            >
              View & Review →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}