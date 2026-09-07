"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import Link from "next/link";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const source = params.source as string;
  const id = params.id as string;

  const [job, setJob] = useState<any>(null);
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false); // NEW STATE
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Fetch existing job details
    fetchAPI(`/jobs/detail/${source}/${id}`)
      .then((data) => {
        setJob(data.job);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    // 2. Pre-fill resume text from sessionStorage if available
    const savedResume = sessionStorage.getItem("current_resume");
    if (savedResume) setResumeText(savedResume);
  }, [source, id]);

  const handleRunAnalysis = async () => {
    if (!resumeText.trim()) {
      alert("Please provide resume text to run ATS analysis.");
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const data = await fetchAPI(`/jobs/detail/${source}/${id}/analyze`, {
        method: "POST",
        body: JSON.stringify({ resume_text: resumeText }),
      });
      setAnalysisResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  // NEW FUNCTION: Generate the full application
  const handleGenerateApplication = async () => {
    if (!resumeText.trim()) {
      alert("Please provide resume text.");
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      await fetchAPI("/jobs/application", {
        method: "POST",
        body: JSON.stringify({ source, external_id: id, resume_text: resumeText }),
      });
      
      // Successfully generated! Redirect to the Kanban board
      router.push("/applications");
    } catch (err: any) {
      setError(`Application generation failed: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <p className="p-10 text-gray-600">Loading job details...</p>;
  if (error && !job) return <p className="p-10 text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 text-black">
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="text-blue-600 hover:underline">
          &larr; Back to Search
        </Link>
        <a
          href={job.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Open External Job Link &rarr;
        </a>
      </div>

      {/* Header */}
      <div className="bg-white border rounded-lg p-6 shadow-sm mb-6">
        <h1 className="text-3xl font-bold mb-1">{job.title}</h1>
        <p className="text-lg text-gray-700 font-medium">{job.company}</p>
        <p className="text-sm text-gray-500">{job.location} &bull; Source: {job.source}</p>
      </div>

      {/* On-Demand Analysis Action Section */}
      <div className="bg-gray-50 border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">Run ATS Match & Trust Evaluation</h2>
        <p className="text-sm text-gray-600 mb-4">
          Analyze this specific posting against your resume for keyword match, ATS scores, and company credibility.
        </p>

        <textarea
          placeholder="Paste or update your resume text here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          className="w-full p-3 border rounded h-28 mb-3 bg-white"
        />

        {/* BUTTONS CONTAINER */}
        <div className="flex gap-4">
          <button
            onClick={handleRunAnalysis}
            disabled={analyzing || generating}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded font-medium disabled:opacity-50 hover:bg-indigo-700"
          >
            {analyzing ? "Analyzing ATS Fit & Trust..." : "Analyze This Job"}
          </button>

          <button
            onClick={handleGenerateApplication}
            disabled={analyzing || generating || !resumeText}
            className="bg-green-600 text-white px-6 py-2.5 rounded font-medium disabled:opacity-50 hover:bg-green-700"
          >
            {generating ? "Crafting AI Application..." : "Generate AI Application"}
          </button>
        </div>

        {error && <p className="text-red-500 mt-3 text-sm font-semibold">{error}</p>}
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="space-y-6 mb-8">
          {/* Score Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
              <span className="text-xs uppercase text-green-700 font-bold">ATS Overall Score</span>
              <p className="text-4xl font-extrabold text-green-800 mt-1">
                {analysisResult.ats_match?.overall_score}%
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
              <span className="text-xs uppercase text-blue-700 font-bold">Skill Match Score</span>
              <p className="text-4xl font-extrabold text-blue-800 mt-1">
                {analysisResult.ats_match?.skill_score}%
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg text-center">
              <span className="text-xs uppercase text-purple-700 font-bold">Company Trust</span>
              <p className="text-4xl font-extrabold text-purple-800 mt-1">
                {analysisResult.company_trust?.trust_score ?? "N/A"}/100
              </p>
              <span className="text-xs text-purple-700">
                {analysisResult.company_trust?.recommendation}
              </span>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-green-200 bg-green-50/50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Matched Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.ats_match?.matched_skills?.map((s: string, i: number) => (
                  <span key={i} className="bg-green-200 text-green-900 px-2 py-0.5 rounded text-xs">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="border border-red-200 bg-red-50/50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">Missing Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.ats_match?.missing_skills?.map((s: string, i: number) => (
                  <span key={i} className="bg-red-200 text-red-900 px-2 py-0.5 rounded text-xs">
                    ✗ {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Red Flags & Feedback */}
          {analysisResult.company_trust?.red_flags?.length > 0 && (
            <div className="border border-amber-300 bg-amber-50 p-4 rounded-lg">
              <h3 className="font-semibold text-amber-900 mb-1">Company Due Diligence Notices</h3>
              <ul className="list-disc pl-5 text-sm text-amber-800">
                {analysisResult.company_trust.red_flags.map((flag: string, i: number) => (
                  <li key={i}>{flag}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Full Description */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Job Description</h2>
        <div className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
          {job.description || "No full description provided."}
        </div>
      </div>
    </div>
  );
}