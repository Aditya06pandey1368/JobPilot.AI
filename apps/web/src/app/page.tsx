// app/page.tsx

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string } | null>(null);

  const [query, setQuery] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    fetchAPI("/auth/me")
      .then((data) => setUser(data))
      .catch(() => router.push("/login"));

    const savedResume = sessionStorage.getItem("current_resume");
    if (savedResume) setResumeText(savedResume);
  }, [router]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Save resume to session storage for the details page
    sessionStorage.setItem("current_resume", resumeText);

    try {
      const data = await fetchAPI("/jobs/search", {
        method: "POST",
        body: JSON.stringify({ query, resume_text: resumeText }),
      });
      setJobs(data.jobs || []);
    } catch (err: any) {
      alert(`Search failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!user) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 text-black">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <div className="space-x-4">
          <Link href="/applications" className="text-blue-600 underline">
            My Applications
          </Link>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="bg-gray-50 border p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Discover Jobs</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search roles (e.g., Software Engineer, Python Intern)..."
            required
            className="w-full p-2.5 border rounded bg-white"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <textarea
            placeholder="Paste your raw resume text here to enable on-demand ATS evaluations..."
            required
            className="w-full p-2.5 border rounded h-28 bg-white"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
          <button
            disabled={loading}
            type="submit"
            className="bg-blue-600 text-white px-6 py-2.5 rounded font-medium disabled:opacity-50 hover:bg-blue-700"
          >
            {loading ? "Searching Listings..." : "Search Jobs"}
          </button>
        </div>
      </form>

      {/* Results Listing */}
      <div className="space-y-4">
        {jobs.length > 0 && (
          <h3 className="text-lg font-semibold text-gray-700">
            Available Listings ({jobs.length})
          </h3>
        )}

        {/* NEW: Show a message if 0 jobs are returned */}
        {jobs.length === 0 && !loading && (
          <div className="text-center py-12 bg-white border rounded-lg border-dashed">
            <p className="text-gray-500 font-medium">
              No jobs passed the AI relevance filter.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Try a broader search query like "Software Engineer" or "Developer".
            </p>
          </div>
        )}

        {jobs.map((item, idx) => {
          const job = item.job || item;
          return (
            <div key={idx} className="border p-5 rounded-lg bg-white shadow-sm flex justify-between items-center">
              <div>
                <h4 className="text-xl font-bold text-gray-900">{job.title}</h4>
                <p className="text-sm font-medium text-gray-700">{job.company}</p>
                <p className="text-xs text-gray-500">{job.location} &bull; Source: {job.source}</p>
              </div>

              <Link
                href={`/jobs/${job.source}/${job.external_id}`}
                className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-4 py-2 rounded font-medium hover:bg-indigo-100"
              >
                View & Analyze Job &rarr;
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}