"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react";

const jobs = [
  {
    title: "Software Engineer Intern",
    company: "Electronic Arts",
    location: "Hyderabad, India",
    score: 92,
    skills: ["Java", "React", "Node.js", "MongoDB"],
    type: "Internship",
  },
  {
    title: "Software Engineer Intern - Backend",
    company: "Merkle Science",
    location: "Bengaluru, India",
    score: 89,
    skills: ["Java", "Python", "Docker", "Git"],
    type: "Internship",
  },
  {
    title: "Backend Software Engineering Intern",
    company: "Enterpret",
    location: "Bengaluru, India",
    score: 86,
    skills: ["Node.js", "MongoDB", "REST APIs"],
    type: "Internship",
  },
  {
    title: "Software Engineering Intern",
    company: "74Software",
    location: "India",
    score: 78,
    skills: ["JavaScript", "React", "Git"],
    type: "Internship",
  },
];

export default function JobsPage() {
  const [query, setQuery] = useState("");

  const filteredJobs = jobs.filter((job) =>
    `${job.title} ${job.company} ${job.location}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#07090d] text-white">

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[20%] top-[-15%] h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] h-[350px] w-[350px] rounded-full bg-violet-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">

        <header className="mb-8 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-xl font-semibold"
          >
            JobPilot<span className="text-blue-400">.AI</span>
          </Link>

          <Link
            href="/dashboard"
            className="text-sm text-white/50 hover:text-white"
          >
            Dashboard
          </Link>
        </header>

        <section className="mb-8">
          <p className="mb-3 text-sm text-blue-400">
            Job discovery
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Find your next opportunity.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
            Search thousands of opportunities and let JobPilot
            identify the roles that match your profile.
          </p>
        </section>

        <section className="mb-8 flex flex-col gap-3 sm:flex-row">

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by role, company or location..."
              className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] pl-11 pr-4 text-sm outline-none transition placeholder:text-white/25 focus:border-blue-400/40"
            />
          </div>

          <button className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 text-sm text-white/60 transition hover:bg-white/[0.07] hover:text-white">
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </section>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-white/40">
            {filteredJobs.length} opportunities
          </p>

          <p className="hidden text-xs text-white/25 sm:block">
            Ranked using your profile
          </p>
        </div>

        <section className="space-y-3">

          {filteredJobs.map((job) => (
            <Link
              href="/jobs/details"
              key={`${job.company}-${job.title}`}
              className="group block rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.04]"
            >
              <div className="flex gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] font-semibold">
                  {job.company
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">

                    <div>
                      <h2 className="font-medium group-hover:text-blue-300">
                        {job.title}
                      </h2>

                      <p className="mt-1 text-sm text-white/45">
                        {job.company}
                      </p>

                      <div className="mt-2 flex items-center gap-1 text-xs text-white/30">
                        <MapPin size={13} />
                        {job.location}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
                        {job.score}% match
                      </span>

                      <ArrowUpRight
                        size={17}
                        className="mt-1 text-white/20 transition group-hover:text-white/60"
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="flex items-center gap-1 rounded-md bg-white/[0.05] px-2 py-1 text-[11px] text-white/40">
                      <BriefcaseBusiness size={11} />
                      {job.type}
                    </span>

                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-white/[0.04] px-2 py-1 text-[11px] text-white/40"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                </div>
              </div>
            </Link>
          ))}

          {filteredJobs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center">
              <Search
                size={28}
                className="mx-auto text-white/20"
              />

              <p className="mt-4 text-sm text-white/50">
                No jobs found.
              </p>
            </div>
          )}

        </section>
      </div>
    </main>
  );
}