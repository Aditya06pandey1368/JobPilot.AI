"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  ExternalLink,
  FileText,
  MapPin,
  Sparkles,
  X,
} from "lucide-react";

const job = {
  title: "Software Engineer Intern",
  company: "Electronic Arts",
  location: "Hyderabad, India",
  type: "Internship",
  score: 92,
  description:
    "Software Engineer Intern working with Java, React and Node.js. You will work with experienced engineers to build software, develop features, improve existing systems and contribute to production-quality applications.",
  requirements: [
    "Java",
    "React",
    "Node.js",
    "MongoDB",
    "Docker",
    "Git",
    "Communication Skills",
  ],
  matched: [
    "Java",
    "React",
    "Node.js",
    "MongoDB",
    "Docker",
    "Git",
  ],
  missing: ["AWS", "REST APIs"],
};

export default function JobDetailsPage() {
  return (
    <main className="min-h-screen bg-[#07090d] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[15%] top-[-15%] h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute right-[-5%] top-[25%] h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-[1300px] px-4 py-6 sm:px-6 lg:px-8">

        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-xl font-semibold tracking-tight"
          >
            JobPilot<span className="text-blue-400">.AI</span>
          </Link>

          <Link
            href="/jobs"
            className="flex items-center gap-2 text-sm text-white/45 transition hover:text-white"
          >
            <ArrowLeft size={15} />
            Back to jobs
          </Link>
        </header>

        {/* Job Header */}
        <section className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

            <div className="flex gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-sm font-semibold">
                EA
              </div>

              <div>
                <p className="text-sm text-blue-400">
                  {job.company}
                </p>

                <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {job.title}
                </h1>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/35">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} />
                    {job.location}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <BriefcaseBusiness size={13} />
                    {job.type}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-center">
                <p className="text-2xl font-semibold text-emerald-400">
                  {job.score}%
                </p>

                <p className="text-[10px] text-emerald-400/60">
                  MATCH SCORE
                </p>
              </div>
            </div>

          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">

            <a
              href="https://www.ea.com/careers"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-white/10"
            >
              Apply on company site
              <ExternalLink
                size={15}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>

            <Link
              href="/applications"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/[0.07] hover:text-white"
            >
              <Sparkles size={16} />
              Generate application
            </Link>

          </div>
        </section>

        {/* Content */}
        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* Main */}
          <div className="space-y-6">

            {/* Description */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
              <h2 className="text-lg font-semibold">
                About the role
              </h2>

              <p className="mt-4 text-sm leading-7 text-white/50">
                {job.description}
              </p>
            </div>

            {/* Requirements */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
              <h2 className="text-lg font-semibold">
                Key requirements
              </h2>

              <div className="mt-5 flex flex-wrap gap-2">
                {job.requirements.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-white/[0.07] bg-white/[0.035] px-3 py-2 text-xs text-white/55"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Match Analysis */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400">
                  <Sparkles size={17} />
                </div>

                <div>
                  <h2 className="font-semibold">
                    AI match analysis
                  </h2>

                  <p className="text-xs text-white/35">
                    Based on your current profile
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Check
                      size={15}
                      className="text-emerald-400"
                    />

                    <span className="text-sm font-medium">
                      Matched skills
                    </span>
                  </div>

                  <div className="space-y-2">
                    {job.matched.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center gap-2 rounded-lg bg-emerald-400/[0.05] px-3 py-2 text-xs text-white/50"
                      >
                        <Check
                          size={13}
                          className="text-emerald-400"
                        />
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <X
                      size={15}
                      className="text-orange-400"
                    />

                    <span className="text-sm font-medium">
                      Missing skills
                    </span>
                  </div>

                  <div className="space-y-2">
                    {job.missing.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center gap-2 rounded-lg bg-orange-400/[0.05] px-3 py-2 text-xs text-white/50"
                      >
                        <X
                          size={13}
                          className="text-orange-400"
                        />
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">

            {/* Score */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">

              <p className="text-xs uppercase tracking-wider text-white/30">
                Your fit
              </p>

              <div className="mt-4 flex items-end gap-2">
                <span className="text-5xl font-semibold tracking-tight">
                  {job.score}
                </span>

                <span className="mb-2 text-sm text-white/30">
                  / 100
                </span>
              </div>

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                <div
                  className="h-full rounded-full bg-emerald-400"
                  style={{ width: `${job.score}%` }}
                />
              </div>

              <p className="mt-4 text-xs leading-5 text-white/35">
                Your profile strongly matches this position.
                Focus on demonstrating your backend and full-stack
                development experience during the interview.
              </p>
            </div>

            {/* Application CTA */}
            <div className="overflow-hidden rounded-2xl border border-blue-400/20 bg-blue-400/[0.06] p-6">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400">
                <FileText size={18} />
              </div>

              <h3 className="mt-5 font-semibold">
                Ready to apply?
              </h3>

              <p className="mt-2 text-xs leading-5 text-white/35">
                Generate a tailored resume and cover letter
                specifically for this position.
              </p>

              <Link
                href="/applications"
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5"
              >
                Generate application
                <ArrowUpRight size={15} />
              </Link>
            </div>

          </aside>
        </section>
      </div>
    </main>
  );
}