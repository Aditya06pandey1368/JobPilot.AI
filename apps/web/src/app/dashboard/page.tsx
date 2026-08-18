"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  Search,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";

const stats = [
  {
    label: "Jobs Found",
    value: "124",
    change: "+18%",
    icon: Search,
  },
  {
    label: "Applications",
    value: "12",
    change: "+4 this week",
    icon: BriefcaseBusiness,
  },
  {
    label: "Interviews",
    value: "3",
    change: "+2 this week",
    icon: Clock3,
  },
  {
    label: "Avg. Match",
    value: "84%",
    change: "+6%",
    icon: TrendingUp,
  },
];

const jobs = [
  {
    company: "Electronic Arts",
    title: "Software Engineer Intern",
    location: "Hyderabad, India",
    score: 92,
    type: "Internship",
  },
  {
    company: "Merkle Science",
    title: "Software Engineer Intern - Backend",
    location: "Bengaluru, India",
    score: 89,
    type: "Internship",
  },
  {
    company: "Enterpret",
    title: "Backend Software Engineering Intern",
    location: "Bengaluru, India",
    score: 86,
    type: "Internship",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#07090d] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute right-[-5%] top-[20%] h-[380px] w-[380px] rounded-full bg-violet-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">

        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <Link href="/dashboard" className="group">
            <div className="text-xl font-semibold tracking-tight">
              JobPilot<span className="text-blue-400">.AI</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/jobs"
              className="hidden rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70 transition hover:bg-white/[0.07] hover:text-white sm:block"
            >
              Find Jobs
            </Link>

            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-sm font-medium">
              AP
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="relative mb-8 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 shadow-2xl sm:p-8 lg:p-10">

          <div className="absolute right-[-100px] top-[-120px] h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-[80px]" />

          <div className="relative max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs font-medium text-blue-300">
              <Sparkles size={13} />
              Your AI job assistant
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Find the right job.
              <br />
              <span className="text-white/45">
                Let AI handle the busy work.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/50 sm:text-base">
              Search relevant opportunities, understand your fit, and
              generate tailored applications without wasting hours on
              repetitive work.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/jobs"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-white/10"
              >
                Search jobs
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>

              <Link
                href="/applications"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/[0.08] hover:text-white"
              >
                <FileText size={16} />
                My applications
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.04]"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                    <Icon size={17} className="text-white/60" />
                  </div>

                  <span className="text-xs text-emerald-400">
                    {stat.change}
                  </span>
                </div>

                <p className="text-2xl font-semibold tracking-tight">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-white/40">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </section>

        {/* Main Grid */}
        <section className="grid gap-6 lg:grid-cols-[1fr_340px]">

          {/* Recommended Jobs */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025]">

            <div className="flex items-center justify-between border-b border-white/[0.07] p-5">
              <div>
                <h2 className="font-semibold">
                  Recommended jobs
                </h2>
                <p className="mt-1 text-xs text-white/40">
                  Based on your skills and profile
                </p>
              </div>

              <Link
                href="/jobs"
                className="text-xs text-white/50 transition hover:text-white"
              >
                View all →
              </Link>
            </div>

            <div className="divide-y divide-white/[0.06]">
              {jobs.map((job) => (
                <Link
                  href="/jobs"
                  key={job.title}
                  className="group block p-5 transition hover:bg-white/[0.035]"
                >
                  <div className="flex gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-xs font-semibold">
                      {job.company
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row">
                        <div>
                          <h3 className="font-medium transition group-hover:text-blue-300">
                            {job.title}
                          </h3>

                          <p className="mt-1 text-sm text-white/45">
                            {job.company} · {job.location}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                            {job.score}% match
                          </span>

                          <ArrowUpRight
                            size={16}
                            className="text-white/20 transition group-hover:text-white/60"
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <span className="rounded-md bg-white/[0.05] px-2 py-1 text-[11px] text-white/45">
                          {job.type}
                        </span>

                        <span className="text-[11px] text-white/30">
                          Recommended for you
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Application Progress */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
              <h2 className="font-semibold">
                Application progress
              </h2>

              <p className="mt-1 text-xs text-white/40">
                This week's activity
              </p>

              <div className="mt-6 space-y-5">

                <ProgressRow
                  icon={<Search size={15} />}
                  title="Jobs discovered"
                  value="42"
                />

                <ProgressRow
                  icon={<CheckCircle2 size={15} />}
                  title="Applications sent"
                  value="8"
                />

                <ProgressRow
                  icon={<Clock3 size={15} />}
                  title="Awaiting response"
                  value="6"
                />

              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
              <h2 className="font-semibold">
                Quick actions
              </h2>

              <div className="mt-4 space-y-2">

                <QuickAction
                  href="/jobs"
                  icon={<Search size={16} />}
                  title="Search jobs"
                />

                <QuickAction
                  href="/applications"
                  icon={<FileText size={16} />}
                  title="View applications"
                />

                <QuickAction
                  href="/profile"
                  icon={<BriefcaseBusiness size={16} />}
                  title="Update profile"
                />

              </div>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}

function ProgressRow({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-white/50">
        {icon}
      </div>

      <div className="flex-1">
        <p className="text-sm text-white/70">
          {title}
        </p>
      </div>

      <span className="text-sm font-medium">
        {value}
      </span>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  title,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3 text-sm text-white/60 transition hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-white"
    >
      <span className="text-white/50">
        {icon}
      </span>

      {title}

      <ArrowUpRight
        size={14}
        className="ml-auto text-white/20"
      />
    </Link>
  );
}