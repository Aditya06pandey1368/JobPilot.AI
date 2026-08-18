"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  FileText,
  Plus,
  Sparkles,
} from "lucide-react";

const applications = [
  {
    company: "Electronic Arts",
    title: "Software Engineer Intern",
    status: "Ready to apply",
    score: 92,
  },
  {
    company: "Merkle Science",
    title: "Software Engineer Intern - Backend",
    status: "Draft",
    score: 89,
  },
];

export default function ApplicationsPage() {
  return (
    <main className="min-h-screen bg-[#07090d] text-white">

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[15%] top-[-15%] h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[1300px] px-4 py-6 sm:px-6 lg:px-8">

        <header className="mb-10 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-xl font-semibold"
          >
            JobPilot<span className="text-blue-400">.AI</span>
          </Link>

          <Link
            href="/jobs"
            className="text-sm text-white/45 hover:text-white"
          >
            Find jobs
          </Link>
        </header>

        <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>
            <p className="mb-2 text-sm text-blue-400">
              Applications
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Your applications
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Manage your generated applications and keep track
              of the opportunities you want to pursue.
            </p>
          </div>

          <Link
            href="/jobs"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5"
          >
            <Plus size={16} />
            New application
          </Link>

        </section>

        <section className="grid gap-4 sm:grid-cols-3">

          <Stat
            label="Total applications"
            value="12"
          />

          <Stat
            label="Ready to apply"
            value="4"
          />

          <Stat
            label="In progress"
            value="3"
          />

        </section>

        <section className="mt-8">

          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">
              Recent applications
            </h2>

            <span className="text-xs text-white/30">
              Updated recently
            </span>
          </div>

          <div className="space-y-3">

            {applications.map((application) => (
              <div
                key={application.title}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition hover:border-white/[0.13]"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
                    <BriefcaseBusiness
                      size={17}
                      className="text-white/50"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium">
                      {application.title}
                    </h3>

                    <p className="mt-1 text-sm text-white/40">
                      {application.company}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs text-blue-300">
                      {application.status}
                    </span>

                    <span className="text-sm text-emerald-400">
                      {application.score}%
                    </span>

                    <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/40 transition hover:bg-white/[0.06] hover:text-white">
                      <ArrowUpRight size={15} />
                    </button>
                  </div>

                </div>
              </div>
            ))}

          </div>
        </section>

        {/* Generator */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-blue-400/[0.08] to-white/[0.02] p-6 sm:p-8">

          <div className="max-w-2xl">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400">
              <Sparkles size={18} />
            </div>

            <h2 className="mt-5 text-2xl font-semibold">
              Create a tailored application
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/40">
              JobPilot analyzes the job description against your
              profile and generates a focused resume and cover
              letter for the specific role.
            </p>

            <Link
              href="/jobs"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5"
            >
              Choose a job
              <ArrowUpRight size={15} />
            </Link>

          </div>
        </section>

      </div>
    </main>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
      <p className="text-xs text-white/35">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold">
        {value}
      </p>
    </div>
  );
}