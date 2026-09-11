"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import Link from "next/link";

export default function ApplicationDetailsPage() {
  const params = useParams();
  const appId = params.id as string;
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [coverLetterContent, setCoverLetterContent] = useState("");

  const [prepLoading, setPrepLoading] = useState(false);
  const [prepData, setPrepData] = useState<string | null>(null);

  useEffect(() => {
    fetchAPI(`/jobs/applications/${appId}`)
      .then((res) => {
        const root = res.application || res;
        const aiReport = root.application || root;

        const processedData = {
          ...root,
          analysis: aiReport.analysis || root.analysis,
          tailored_resume: aiReport.tailored_resume || root.tailored_resume,
          cover_letter: aiReport.cover_letter || root.cover_letter,
          checklist: aiReport.checklist || root.checklist,
          status: root.status || "saved",
          job: root.job,
        };
        
        setData(processedData);

        const rawLetter = processedData.cover_letter;
        const extractedText = typeof rawLetter === "string" 
          ? rawLetter 
          : rawLetter?.content || rawLetter?.body || rawLetter?.letter || "No cover letter generated.";
        
        setCoverLetterContent(extractedText);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [appId]);

  const generateInterviewPrep = async () => {
    setPrepLoading(true);
    try {
      const res = await fetchAPI(`/jobs/applications/${appId}/interview-prep`, { method: "POST" });
      setPrepData(res.prep_guide);
    } catch (err: any) {
      alert(`Failed to generate prep: ${err.message}`);
    } finally {
      setPrepLoading(false);
    }
  };

  if (loading) return <p className="p-10 text-gray-600 font-medium">Loading your AI application materials...</p>;
  if (error || !data) return <p className="p-10 text-red-500 font-medium">Error: {error || "Application not found"}</p>;

  const title = data.analysis?.job_title || data.job?.title || "Role";
  const company = data.analysis?.company || data.job?.company || "Company";
  const fitScore = data.analysis?.fit_score ?? data.fit_score ?? 0;
  const checklistItems = data.checklist?.items || (Array.isArray(data.checklist) ? data.checklist : []);
  const summary = data.tailored_resume?.summary;
  const keywords = data.tailored_resume?.keywords_to_emphasize || [];
  const improvements = data.analysis?.improvement_suggestions || [];
  
  // The job URL to redirect to
  const targetJobUrl = data.job?.apply_url || data.job?.source_url || "#";

  return (
    <div className="max-w-6xl mx-auto p-6 text-black print:p-0">
      
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Link href="/applications" className="text-blue-600 hover:underline font-medium">
          &larr; Back to Kanban Board
        </Link>
        
        <div className="flex gap-3">
          {/* NEW: Simple External Link to the Job */}
          <a 
            href={targetJobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded shadow transition-colors font-medium flex items-center gap-2"
          >
            Apply Now &nearr;
          </a>

          <button 
            onClick={generateInterviewPrep}
            disabled={prepLoading}
            className={`${prepLoading ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'} text-white px-4 py-2 rounded shadow transition-colors font-medium flex items-center gap-2`}
          >
            {prepLoading ? "⏳ Generating..." : "🎤 Prep for Interview"}
          </button>
          
          <button 
            onClick={() => window.print()}
            className="bg-gray-900 text-white px-4 py-2 rounded shadow hover:bg-gray-800 transition-colors font-medium"
          >
            📄 Export to PDF
          </button>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6 shadow-sm mb-6 print:shadow-none print:border-none print:px-0">
        <h1 className="text-3xl font-bold mb-1 text-gray-900">{title}</h1>
        <p className="text-lg text-gray-700 font-medium">{company}</p>
        <div className="mt-4 flex gap-3 print:hidden">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded font-semibold text-sm">
            ATS Fit: {fitScore}%
          </span>
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded font-semibold capitalize text-sm">
            Status: {data.status}
          </span>
        </div>
      </div>

      {prepData && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 shadow-sm mb-6 print:hidden">
          <h2 className="text-2xl font-bold mb-4 text-purple-900">Your Custom Interview Guide</h2>
          <div className="whitespace-pre-wrap text-sm text-gray-800 bg-white p-6 border rounded shadow-inner leading-relaxed">
            {prepData}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-gray-50 border rounded-lg p-6 shadow-sm print:bg-white print:border-none print:shadow-none print:p-0">
            <div className="flex justify-between items-center mb-4 print:hidden">
                <h2 className="text-xl font-bold text-gray-900">Tailored Cover Letter</h2>
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 font-semibold"
                >
                    {isEditing ? "Save & View" : "✏️ Edit"}
                </button>
            </div>
            
            {isEditing ? (
                <textarea 
                    value={coverLetterContent}
                    onChange={(e) => setCoverLetterContent(e.target.value)}
                    className="w-full h-96 p-4 border rounded shadow-inner text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 print:hidden"
                />
            ) : (
                <div className="whitespace-pre-wrap text-sm text-gray-800 bg-white p-6 border rounded shadow-inner leading-relaxed print:border-none print:shadow-none print:p-0 print:text-black">
                    {coverLetterContent}
                </div>
            )}
          </div>
        </div>

        <div className="space-y-6 print:hidden">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-blue-900">Resume Adjustments</h2>
            {summary && (
              <>
                <h3 className="font-semibold text-blue-800 mt-2 mb-2 text-sm">Recommended Summary</h3>
                <p className="text-sm bg-white p-3 rounded border text-gray-700 mb-4 leading-relaxed">{summary}</p>
              </>
            )}
            {keywords.length > 0 && (
              <>
                <h3 className="font-semibold text-blue-800 mt-4 mb-2 text-sm">Keywords to Emphasize</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {keywords.map((kw: string, i: number) => (
                    <span key={i} className="bg-blue-200 text-blue-900 text-xs px-2 py-1 rounded font-medium">{kw}</span>
                  ))}
                </div>
              </>
            )}
          </div>

          {checklistItems.length > 0 && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-indigo-900">Pre-Application Checklist</h2>
              <ul className="space-y-2">
                {checklistItems.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-indigo-900">
                    <span className="text-indigo-600 font-bold">☑</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}