"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import Link from "next/link";

export default function AnalyticsDashboard() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAPI("/jobs/applications")
      .then((data) => {
        setApplications(data.applications || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-10 text-gray-600 font-medium">Crunching your application data...</p>;
  if (error) return <p className="p-10 text-red-500 font-medium">Error: {error}</p>;

  // --- CALCULATE METRICS ---
  const totalJobs = applications.length;
  
  // Status Counts
  const statusCounts = applications.reduce((acc, app) => {
    const status = app.status || "saved";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const applied = statusCounts["applied"] || 0;
  const interviews = statusCounts["interview"] || 0;
  const offers = statusCounts["offer"] || 0;
  const rejections = statusCounts["rejected"] || 0;

  // Conversion Rates
  const interviewRate = applied > 0 ? Math.round((interviews / applied) * 100) : 0;
  
  // Average ATS Fit Score
  const totalScore = applications.reduce((sum, app) => {
    const aiReport = app.application || app;
    const score = aiReport.analysis?.fit_score ?? app.fit_score ?? 0;
    return sum + score;
  }, 0);
  const avgFitScore = totalJobs > 0 ? Math.round(totalScore / totalJobs) : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 text-black">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
        <Link href="/applications" className="text-blue-600 hover:underline font-medium">
          &larr; Back to Kanban Board
        </Link>
      </div>

      {totalJobs === 0 ? (
        <div className="bg-white p-10 rounded-lg shadow-sm border text-center">
          <h2 className="text-xl font-bold text-gray-700">No data yet!</h2>
          <p className="text-gray-500 mt-2">Generate some AI applications to see your stats.</p>
        </div>
      ) : (
        <>
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm font-semibold text-gray-500 uppercase">Total Tracked</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{totalJobs}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm font-semibold text-gray-500 uppercase">Avg. ATS Fit</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{avgFitScore}%</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm font-semibold text-gray-500 uppercase">Active Interviews</p>
              <p className="text-4xl font-bold text-purple-600 mt-2">{interviews}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm font-semibold text-gray-500 uppercase">Offers Received</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{offers}</p>
            </div>
          </div>

          {/* Pipeline Funnel & Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Status Breakdown (Visual Funnel) */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Application Pipeline</h2>
              <div className="space-y-4">
                <FunnelBar label="Saved" count={statusCounts["saved"] || 0} total={totalJobs} color="bg-gray-400" />
                <FunnelBar label="Applied" count={applied} total={totalJobs} color="bg-blue-500" />
                <FunnelBar label="Assessment" count={statusCounts["assessment"] || 0} total={totalJobs} color="bg-yellow-500" />
                <FunnelBar label="Interviewing" count={interviews} total={totalJobs} color="bg-purple-500" />
                <FunnelBar label="Offers" count={offers} total={totalJobs} color="bg-green-500" />
                <FunnelBar label="Rejected" count={rejections} total={totalJobs} color="bg-red-500" />
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-indigo-50 p-6 rounded-lg shadow-sm border border-indigo-100">
              <h2 className="text-xl font-bold text-indigo-900 mb-4">AI Insights</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-indigo-500 text-xl">💡</span>
                  <p className="text-sm text-indigo-900">
                    Your average ATS match is <strong>{avgFitScore}%</strong>. {avgFitScore < 50 ? "Try tailoring your resume summary more aggressively using the AI suggestions to boost this score." : "Great job targeting roles that match your skill set!"}
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-500 text-xl">🎯</span>
                  <p className="text-sm text-indigo-900">
                    You have converted <strong>{interviewRate}%</strong> of your applications into interviews. {interviewRate > 20 ? "Your profile is highly competitive in the current market!" : "If this number is low, consider leveraging the cold-email networking templates."}
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-500 text-xl">📈</span>
                  <p className="text-sm text-indigo-900">
                    You currently have <strong>{totalJobs}</strong> opportunities in your pipeline. Keep dropping jobs into the Kanban board to maintain momentum.
                  </p>
                </li>
              </ul>
            </div>
            
          </div>
        </>
      )}
    </div>
  );
}

// Helper component to render progress bars
function FunnelBar({ label, count, total, color }: { label: string, count: number, total: number, color: string }) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1 font-semibold text-gray-700">
        <span>{label} ({count})</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div className={`${color} h-3 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}