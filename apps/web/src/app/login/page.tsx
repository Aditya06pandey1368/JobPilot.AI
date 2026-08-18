"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

import api from "@/lib/api";
import { saveToken } from "@/lib/auth";
import Brand from "@/components/brand";
import ThemeToggle from "@/components/theme-toggle";

const benefits = [
  "AI-powered job matching",
  "Personalized application insights",
  "Track every application in one place",
];

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/api/auth/login",
        {
          email,
          password,
        }
      );

      saveToken(response.data.access_token);

      router.push("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f7f5] text-neutral-950 dark:bg-[#080808] dark:text-white">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-[15%] h-72 w-72 rounded-full bg-neutral-300/30 blur-3xl dark:bg-white/[0.04]" />

        <div className="absolute bottom-[10%] right-[10%] h-96 w-96 rounded-full bg-neutral-200/40 blur-3xl dark:bg-white/[0.03]" />

        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Brand />

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-neutral-500 sm:block dark:text-neutral-400">
            New to JobPilot?
          </span>

          <Link
            href="/register"
            className="hidden rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-medium transition hover:bg-white sm:block dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            Create account
          </Link>

          <ThemeToggle />
        </div>
      </nav>

      {/* Main */}
      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-7xl items-center gap-16 px-5 py-12 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">

        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1.5 text-xs font-medium backdrop-blur dark:border-white/10 dark:bg-white/5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Intelligent job search
          </div>

          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] xl:text-6xl">
            Stop searching for jobs.
            <br />
            <span className="text-neutral-400 dark:text-neutral-500">
              Start finding the right ones.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-neutral-500 dark:text-neutral-400">
            JobPilot.AI analyzes opportunities against your
            profile, helping you spend less time searching and
            more time applying to roles that actually fit.
          </p>

          <div className="mt-9 space-y-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.15 + index * 0.1,
                }}
                className="flex items-center gap-3"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-950 text-white dark:bg-white dark:text-black">
                  <Check className="h-3.5 w-3.5" />
                </div>

                <span className="text-sm text-neutral-600 dark:text-neutral-300">
                  {benefit}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Login card */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
            rotateX: 4,
          }}
          animate={{
            opacity: 1,
            y: 0,
            rotateX: 0,
          }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          style={{
            perspective: 1000,
          }}
          className="mx-auto w-full max-w-md"
        >
          <div className="relative overflow-hidden rounded-[28px] border border-black/[0.08] bg-white/80 p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-9 dark:border-white/[0.09] dark:bg-white/[0.045] dark:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">

            <div className="absolute right-[-80px] top-[-80px] h-40 w-40 rounded-full border border-black/[0.06] dark:border-white/[0.06]" />

            <div className="relative">

              <div className="mb-8">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                  Sign in to continue your job search.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    required
                    className="h-12 w-full rounded-xl border border-black/10 bg-black/[0.02] px-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-black/30 focus:ring-4 focus:ring-black/[0.04] dark:border-white/10 dark:bg-white/[0.04] dark:placeholder:text-neutral-600 dark:focus:border-white/30 dark:focus:ring-white/[0.05]"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs text-neutral-500 transition hover:text-black dark:text-neutral-400 dark:hover:text-white"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="••••••••"
                    required
                    className="h-12 w-full rounded-xl border border-black/10 bg-black/[0.02] px-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-black/30 focus:ring-4 focus:ring-black/[0.04] dark:border-white/10 dark:bg-white/[0.04] dark:placeholder:text-neutral-600 dark:focus:border-white/30 dark:focus:ring-white/[0.05]"
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-600 dark:text-red-400"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.button
                  whileHover={{
                    y: -1,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 text-sm font-medium text-white shadow-lg shadow-black/10 transition disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
                >
                  {loading
                    ? "Signing in..."
                    : "Sign in"}

                  {!loading && (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </motion.button>

              </form>

              <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />

                <span className="text-[11px] uppercase tracking-wider text-neutral-400">
                  Secure access
                </span>

                <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <ShieldCheck className="h-4 w-4" />
                Your account information is protected.
              </div>

              <p className="mt-7 text-center text-sm text-neutral-500 dark:text-neutral-400">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-neutral-950 hover:underline dark:text-white"
                >
                  Create one
                </Link>
              </p>

            </div>
          </div>
        </motion.div>

      </section>
    </main>
  );
}