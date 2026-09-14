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
  const [uploading, setUploading] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    fetchAPI("/auth/me")
      .then((data) => setUser(data))
      .catch(() => router.push("/login"));

    const savedResume = sessionStorage.getItem("current_resume");
    if (savedResume) setResumeText(savedResume);
  }, [router]);

  // Handle PDF Upload to FastAPI Backend
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/profile/upload-resume", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log("Upload response data:", data); // <--- CHECK YOUR BROWSER CONSOLE (F12) FOR THIS

      if (res.ok && data.success) {
        // Fallback to resume_text if skills is empty
        const textToDisplay = data.skills || data.resume_text || "";
        setResumeText(textToDisplay);
        sessionStorage.setItem("current_resume", textToDisplay);
        alert("✅ Resume parsed successfully!");
      } else {
        alert(`❌ Error: ${data.detail || "Upload failed"}`);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Failed to upload resume.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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

  if (!user) return <div className="flex justify-center items-center h-screen"><p className="text-lg text-gray-600 animate-pulse">Loading profile...</p></div>;

  return (
    <div className="max-w-5xl mx-auto p-6 text-black">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome, {user.name}</h1>
        <div className="space-x-4 flex items-center">
          <Link href="/applications" className="text-blue-600 font-medium hover:underline">
            My Applications
          </Link>
          <button onClick={logout} className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-md font-medium hover:bg-red-100 transition-colors">
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Left Column: Profile & Resume Management */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Your Profile Context</h2>
            <p className="text-sm text-gray-600 mb-4">
              Upload your resume PDF. Our AI will extract your skills here and save your full background to the database for extension analysis.
            </p>
            
            {/* Hidden File Input */}
            <input
              type="file"
              id="resumeUpload"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileUpload}
            />
            
            {/* Upload Button */}
            <button
              type="button"
              onClick={() => document.getElementById("resumeUpload")?.click()}
              disabled={uploading}
              className="w-full mb-4 bg-indigo-50 text-indigo-700 border border-indigo-200 px-4 py-2.5 rounded-lg font-semibold hover:bg-indigo-100 transition-colors flex justify-center items-center disabled:opacity-70"
            >
              {uploading ? (
                <span className="animate-pulse">⏳ Parsing PDF...</span>
              ) : (
                <span>📄 Upload Resume (PDF)</span>
              )}
            </button>

            {/* Editable Skills Area */}
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Extracted Skills
            </label>
            <textarea
              placeholder="Upload a PDF to auto-extract, or type skills manually (e.g., Python, React, AWS)..."
              className="w-full p-3 border rounded-lg h-32 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-2">
              These skills influence your AI job search relevance.
            </p>
          </div>
        </div>

        {/* Right Column: Job Search */}
        <div className="md:col-span-2">
          <form onSubmit={handleSearch} className="bg-gray-50 border p-6 rounded-xl shadow-inner mb-6">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Discover Jobs</h2>
            <p className="text-sm text-gray-600 mb-6">Search for roles across India using semantic matching.</p>
            
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="e.g., Senior Backend Engineer in Python..."
                required
                className="flex-1 p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                disabled={loading}
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors whitespace-nowrap"
              >
                {loading ? "Scanning..." : "Search"}
              </button>
            </div>
          </form>

          {/* Results Listing */}
          <div className="space-y-4">
            {jobs.length > 0 && (
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Available Listings <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full ml-2">{jobs.length}</span>
              </h3>
            )}

            {jobs.length === 0 && !loading && (
              <div className="text-center py-16 bg-white border rounded-xl border-dashed">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-gray-600 font-medium text-lg">
                  No jobs passed the AI relevance filter.
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Try a broader search query or update your profile skills.
                </p>
              </div>
            )}

            {jobs.map((item, idx) => {
              const job = item.job || item;
              return (
                <div key={idx} className="border p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{job.title}</h4>
                    <p className="text-md font-semibold text-indigo-600 mt-1">{job.company}</p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                      <span>📍 {job.location}</span> 
                      <span>&bull;</span> 
                      <span className="capitalize border px-2 py-0.5 rounded text-xs bg-gray-100">{job.source}</span>
                    </p>
                  </div>

                  <Link
                    href={`/jobs/${job.source}/${job.external_id}`}
                    className="bg-white text-blue-600 border border-blue-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center whitespace-nowrap"
                  >
                    Analyze Role &rarr;
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}