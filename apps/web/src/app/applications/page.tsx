"use client";
import { useState, useEffect } from "react";
import { fetchAPI } from "@/lib/api";
import Link from "next/link";

// Match the valid statuses from your backend ApplicationStatusRequest
const COLUMNS = [
  { id: "saved", title: "Saved", color: "bg-gray-200" },
  { id: "applied", title: "Applied", color: "bg-blue-200" },
  { id: "assessment", title: "Assessment", color: "bg-yellow-200" },
  { id: "interview", title: "Interview", color: "bg-purple-200" },
  { id: "offer", title: "Offer", color: "bg-green-200" },
  { id: "rejected", title: "Rejected", color: "bg-red-200" },
];

export default function Applications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch applications on load
  useEffect(() => {
    fetchAPI("/jobs/applications")
      .then((data) => {
        setApplications(data.applications || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load applications.");
        setLoading(false);
      });
  }, []);

  // Native HTML5 Drag Start
  const handleDragStart = (e: React.DragEvent, appId: string) => {
    e.dataTransfer.setData("applicationId", appId);
  };

  // Allow dropping by preventing default behavior
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle the Drop event
  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const appId = e.dataTransfer.getData("applicationId");

    if (!appId) return;

    // Optimistically update the UI immediately so it feels fast
    const previousApps = [...applications];
    setApplications((prev) =>
      prev.map((app) =>
        app._id === appId || app.id === appId ? { ...app, status: newStatus } : app
      )
    );

    // Call your FastAPI PATCH endpoint
    try {
      await fetchAPI(`/jobs/applications/${appId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
      // Revert if the API call failed
      setApplications(previousApps);
    }
  };

  if (loading) return <p className="p-10 text-gray-600">Loading your Kanban board...</p>;
  if (error) return <p className="p-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 h-screen flex flex-col text-black">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <h1 className="text-3xl font-bold">Job Application Tracker</h1>
        <div className="flex gap-4">
          <Link href="/analytics" className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded font-bold hover:bg-indigo-200 transition-colors">
            📊 View Analytics
          </Link>
          <Link href="/" className="text-blue-600 hover:underline font-medium px-4 py-2">
            &larr; Back to Search
          </Link>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex gap-6 overflow-x-auto pb-4 h-full items-start">
        {COLUMNS.map((col) => {
          // Filter jobs that belong in this column
          const columnJobs = applications.filter((app) => (app.status || "saved") === col.id);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="flex flex-col bg-gray-50 rounded-lg w-80 min-w-[20rem] h-full max-h-[75vh] border shadow-sm"
            >
              {/* Column Header */}
              <div className={`px-4 py-3 border-b rounded-t-lg font-bold flex justify-between items-center ${col.color}`}>
                <span className="capitalize">{col.title}</span>
                <span className="bg-white/50 text-gray-800 text-xs px-2 py-1 rounded-full">
                  {columnJobs.length}
                </span>
              </div>

              {/* Column Cards Container */}
              <div className="p-3 overflow-y-auto flex-1 space-y-3">
                {columnJobs.map((app, idx) => {
                  const appId = app._id || app.id; 
                  
                  // Safely check multiple possible locations for the data depending on your DB structure
                  const jobTitle = app.job?.title || app.analysis?.job_title || "Saved Job";
                  const companyName = app.job?.company || app.analysis?.company || "Company";
                  const fitScore = app.fit_score || app.analysis?.overall_score || app.analysis?.fit_score || 0;

                  return (
                    <div
                      key={idx}
                      draggable
                      onDragStart={(e) => handleDragStart(e, appId)}
                      className="bg-white p-4 rounded shadow border border-gray-200 cursor-grab active:cursor-grabbing hover:border-blue-400 transition-colors"
                    >
                      <h3 className="font-bold text-gray-900 leading-tight truncate">
                        {jobTitle}
                      </h3>
                      <p className="text-sm font-medium text-gray-600 mb-3 truncate">
                        {companyName}
                      </p>
                      
                      <div className="flex justify-between items-center text-xs mt-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">
                          ATS Fit: {fitScore}%
                        </span>
                        
                        {/* Always show the link, regardless of job_id existing */}
                        <Link 
                           href={`/applications/${appId}`} 
                           className="text-blue-600 hover:text-blue-800 hover:underline font-bold"
                        >
                          View Details &rarr;
                        </Link>
                      </div>
                    </div>
                  );
                })}
                
                {/* Empty state for column */}
                {columnJobs.length === 0 && (
                  <div className="text-center p-4 border-2 border-dashed border-gray-200 rounded text-gray-400 text-sm">
                    Drop jobs here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}