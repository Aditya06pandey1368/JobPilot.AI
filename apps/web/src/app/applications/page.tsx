"use client";
import { useState, useEffect } from "react";
import { fetchAPI } from "@/lib/api";
import Link from "next/link";

export default function Applications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPI("/jobs/applications")
      .then((data) => {
        setApplications(data.applications || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-10">Loading your tailored applications...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My AI Applications</h1>
        <Link href="/" className="text-blue-500 underline">Back to Search</Link>
      </div>

      <div className="space-y-6">
        {applications.length === 0 && <p>No applications generated yet.</p>}
        {applications.map((app, idx) => (
          <div key={idx} className="border p-6 rounded shadow bg-white text-black">
            <h2 className="text-2xl font-bold mb-2">
              {app.analysis?.job_title || "Unknown Role"} @ {app.analysis?.company || "Unknown Company"}
            </h2>
            <div className="mb-4">
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded font-semibold text-sm">
                Status: {app.status || "Draft"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-bold mb-2">Tailored Cover Letter</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap h-40 overflow-y-auto">
                  {app.cover_letter?.content || "No cover letter generated."}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-bold mb-2">Resume Improvement Suggestions</h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {app.analysis?.improvement_suggestions?.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}