"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import Link from "next/link";

export default function ProfilePage() {
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAPI("/jobs/profile")
      .then((data) => {
        setResumeText(data.resume_text || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await fetchAPI("/jobs/profile", {
        method: "POST",
        body: JSON.stringify({ resume_text: resumeText }),
      });
      setMessage("✅ Master resume saved successfully!");
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-10">Loading profile...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Profile</h1>
        <Link href="/applications" className="text-blue-600 hover:underline font-medium">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold mb-2">Your Master Resume</h2>
        <p className="text-sm text-gray-600 mb-4">
          Paste your core resume text here once. We will automatically use it to analyze jobs, tailor applications, and prep you for interviews.
        </p>

        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your full resume text here..."
          className="w-full h-96 p-4 border rounded shadow-inner text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-bold transition-colors"
          >
            {saving ? "Saving..." : "Save Resume"}
          </button>
          {message && <span className="text-sm font-medium">{message}</span>}
        </div>
      </div>
    </div>
  );
}