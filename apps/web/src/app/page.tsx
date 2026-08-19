"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<{name: string} | null>(null);
  
  // Search State
  const [query, setQuery] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    fetchAPI("/auth/me")
      .then((data) => setUser(data))
      .catch(() => router.push("/login"));
  }, [router]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await fetchAPI("/jobs/search", {
        method: "POST",
        body: JSON.stringify({ query, resume_text: resumeText }),
      });
      setJobs(data.jobs || []);
    } catch (err) {
      alert("Search failed. Check console.");
      console.error(err);
    }
    setLoading(false);
  };

  const handleApply = async (source: string, external_id: string) => {
    try {
      alert("Generating application... This might take a minute.");
      const data = await fetchAPI("/jobs/application", {
        method: "POST",
        body: JSON.stringify({ source, external_id, resume_text: resumeText }),
      });
      alert(`Application Generated! ID: ${data.application_id}`);
      router.push("/applications");
    } catch (err) {
      alert("Failed to generate application.");
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!user) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <div className="space-x-4">
          <Link href="/applications" className="text-blue-500 underline">My Applications</Link>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="bg-gray-100 p-6 rounded shadow mb-8 text-black">
        <h2 className="text-xl font-semibold mb-4">Find & Rank Jobs</h2>
        <div className="space-y-4">
          <input 
            type="text" placeholder="E.g., Python Developer Internship in Bangalore" required
            className="w-full p-2 border rounded"
            value={query} onChange={(e) => setQuery(e.target.value)} 
          />
          <textarea 
            placeholder="Paste your raw resume text here to rank jobs..." required
            className="w-full p-2 border rounded h-32"
            value={resumeText} onChange={(e) => setResumeText(e.target.value)} 
          />
          <button disabled={loading} type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
            {loading ? "Discovering & Ranking (LangGraph running)..." : "Search Jobs"}
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {jobs.map((rankedJob, idx) => (
          <div key={idx} className="border p-4 rounded shadow bg-white text-black">
            <h3 className="text-xl font-bold">{rankedJob.job.title} @ {rankedJob.job.company}</h3>
            <p className="text-sm text-gray-600 mb-2">{rankedJob.job.location}</p>
            
            <div className="flex space-x-4 mb-4 text-sm font-semibold">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Final Score: {rankedJob.final_score}</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Resume Match: {rankedJob.resume_score}</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Trust Score: {rankedJob.company_trust_score}</span>
            </div>
            
            <p className="text-sm mb-4"><strong>AI Reason:</strong> {rankedJob.ranking_reason}</p>
            
            <button 
              onClick={() => handleApply(rankedJob.job.source, rankedJob.job.external_id)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Generate AI Application (Tailor Resume & Cover Letter)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}