"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Loader2,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import api from "@/lib/api";

type Job = {
  external_id?: string;
  id?: string;

  title: string;
  company: string;
  location?: string;

  description?: string;

  source?: string;
  source_url?: string;
  apply_url?: string;

  fit_score?: number;
  final_score?: number;

  matched_skills?: string[];
  missing_skills?: string[];
};

export default function JobsPage() {
  const [query, setQuery] = useState(
    "Software Engineer internships in India"
  );

  const [resumeText, setResumeText] = useState(
    "Final year Computer Science student. Skills: Java, Python, React, Node.js, MongoDB, Docker, Git. Projects: JobPilot.AI, ScholarHub LMS, GamingArena."
  );

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event: FormEvent) {
    event.preventDefault();

    if (!query.trim()) {
      setError("Please enter a job search.");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const response = await api.post("/api/jobs/search", {
        query: query.trim(),
        resume_text: resumeText.trim(),
      });

      const data = response.data;

      let results: Job[] = [];

      if (Array.isArray(data)) {
        results = data;
      } else if (Array.isArray(data.jobs)) {
        results = data.jobs;
      } else if (Array.isArray(data.ranked_jobs)) {
        results = data.ranked_jobs.map((item: any) => ({
          ...item.job,
          fit_score: item.fit_score,
          final_score: item.final_score,
          matched_skills: item.matched_skills,
          missing_skills: item.missing_skills,
        }));
      } else if (Array.isArray(data.relevant_jobs)) {
        results = data.relevant_jobs.map((item: any) => ({
          ...item.job,
          fit_score: item.fit_score,
          final_score: item.final_score,
          matched_skills: item.matched_skills,
          missing_skills: item.missing_skills,
        }));
      }

      setJobs(results);
    } catch (err: any) {
      console.error(err);

      setJobs([]);

      setError(
        err?.response?.data?.detail ||
          "Unable to search jobs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#07090d] text-white">

      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-blue-500/[0.08] blur-[130px]" />

        <div className="absolute right-[-5%] top-[30%] h-[450px] w-[450px] rounded-full bg-violet-500/[0.07] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-[1350px] px-4 py-6 sm:px-6 lg:px-8">

        {/* Navbar */}
        <header className="flex items-center justify-between">

          <Link
            href="/dashboard"
            className="text-xl font-semibold tracking-tight"
          >
            JobPilot<span className="text-blue-400">.AI</span>
          </Link>

          <div className="flex items-center gap-3">

            <Link
              href="/dashboard"
              className="hidden text-sm text-white/40 transition hover:text-white sm:block"
            >
              Dashboard
            </Link>

            <Link
              href="/applications"
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 transition hover:bg-white/[0.05] hover:text-white"
            >
              Applications
            </Link>

          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto max-w-4xl py-14 text-center sm:py-20">

          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/[0.06] px-4 py-2 text-xs text-blue-300">
            <Sparkles size={14} />
            AI-powered job discovery
          </div>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Find your next
            <span className="text-blue-400"> opportunity.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/40 sm:text-base">
            Search thousands of opportunities and let JobPilot
            analyze how well each position matches your profile.
          </p>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="mt-9 rounded-2xl border border-white/[0.09] bg-white/[0.035] p-2 shadow-2xl shadow-black/20"
          >
            <div className="flex flex-col gap-2 sm:flex-row">

              <div className="flex flex-1 items-center gap-3 rounded-xl bg-black/20 px-4">

                <Search
                  size={18}
                  className="shrink-0 text-white/30"
                />

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Software Engineer internships in India"
                  className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/25"
                />

              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Searching...
                  </>
                ) : (
                  <>
                    Search jobs
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

            </div>
          </form>

        </section>

        {/* Resume */}
        <section className="mx-auto max-w-4xl">

          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium">
                Resume profile
              </h2>

              <p className="mt-1 text-xs text-white/30">
                Used by AI to calculate job relevance.
              </p>
            </div>

            <span className="text-xs text-emerald-400">
              Profile ready
            </span>
          </div>

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-sm leading-6 text-white/60 outline-none transition placeholder:text-white/20 focus:border-blue-400/30"
          />

        </section>

        {/* Error */}
        {error && (
          <div className="mx-auto mt-6 max-w-4xl rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Results */}
        <section className="mx-auto max-w-6xl py-12">

          {searched && !loading && (
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Search results
                </h2>

                <p className="mt-1 text-xs text-white/30">
                  {jobs.length} opportunities found
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="grid gap-4 md:grid-cols-2">

              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6"
                >
                  <div className="h-4 w-24 rounded bg-white/10" />
                  <div className="mt-4 h-5 w-3/4 rounded bg-white/10" />
                  <div className="mt-3 h-3 w-1/2 rounded bg-white/10" />
                  <div className="mt-7 h-16 rounded bg-white/[0.05]" />
                </div>
              ))}

            </div>
          )}

          {!loading && searched && jobs.length === 0 && !error && (
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-12 text-center">

              <BriefcaseBusiness
                size={30}
                className="mx-auto text-white/20"
              />

              <h3 className="mt-5 font-medium">
                No jobs found
              </h3>

              <p className="mt-2 text-sm text-white/30">
                Try a broader search query.
              </p>

            </div>
          )}

          {!loading && jobs.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">

              {jobs.map((job, index) => (
                <JobCard
                  key={
                    job.external_id ||
                    job.id ||
                    `${job.company}-${job.title}-${index}`
                  }
                  job={job}
                />
              ))}

            </div>
          )}

          {!searched && (
            <div className="py-10 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                <BriefcaseBusiness
                  size={22}
                  className="text-white/30"
                />
              </div>

              <p className="mt-5 text-sm text-white/30">
                Search for a position to discover matching jobs.
              </p>

            </div>
          )}

        </section>

      </div>
    </main>
  );
}

function JobCard({ job }: { job: Job }) {
  const score =
    job.final_score ??
    job.fit_score ??
    0;

  const jobId =
    job.external_id ||
    job.id ||
    "";

  return (
    <article className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-black/20">

      <div className="flex items-start justify-between gap-4">

        <div className="flex min-w-0 gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-xs font-semibold">
            {getCompanyInitials(job.company)}
          </div>

          <div className="min-w-0">

            <p className="truncate text-xs text-blue-400">
              {job.company}
            </p>

            <h3 className="mt-1 line-clamp-2 text-base font-semibold">
              {job.title}
            </h3>

          </div>

        </div>

        {score > 0 && (
          <div className="shrink-0 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-2 text-center">

            <p className="text-lg font-semibold text-emerald-400">
              {Math.round(score)}
            </p>

            <p className="text-[9px] text-emerald-400/50">
              MATCH
            </p>

          </div>
        )}

      </div>

      <div className="mt-5 flex flex-wrap gap-3 text-xs text-white/35">

        {job.location && (
          <span className="flex items-center gap-1.5">
            <MapPin size={13} />
            {job.location}
          </span>
        )}

        {job.source && (
          <span className="flex items-center gap-1.5">
            <Building2 size={13} />
            {job.source}
          </span>
        )}

      </div>

      {job.description && (
        <p className="mt-4 line-clamp-3 text-xs leading-6 text-white/35">
          {job.description}
        </p>
      )}

      {job.matched_skills &&
        job.matched_skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">

            {job.matched_skills
              .slice(0, 5)
              .map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-emerald-400/[0.06] px-2 py-1 text-[10px] text-emerald-300/70"
                >
                  {skill}
                </span>
              ))}

          </div>
        )}

      <div className="mt-6 flex items-center gap-2">

        <Link
          href={`/jobs/details?id=${encodeURIComponent(jobId)}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] py-2.5 text-xs font-medium text-white/70 transition hover:bg-white/[0.07] hover:text-white"
        >
          View details
          <ArrowRight size={14} />
        </Link>

        {job.apply_url && (
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-black transition hover:-translate-y-0.5"
          >
            Apply
          </a>
        )}

      </div>

    </article>
  );
}

function getCompanyInitials(company?: string) {
  if (!company) return "JP";

  return company
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}