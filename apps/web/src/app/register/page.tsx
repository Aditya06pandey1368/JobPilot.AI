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

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
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
        "/api/auth/register",
        {
          name,
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
        setError("Unable to create account");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f7f5] text-neutral-950 dark:bg-[#080808] dark:text-white">

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[15%] top-[20%] h-72 w-72 rounded-full bg-neutral-300/30 blur-3xl dark:bg-white/[0.04]" />

        <div className="absolute bottom-[5%] right-[5%] h-96 w-96 rounded-full bg-neutral-200/40 blur-3xl dark:bg-white/[0.03]" />

        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Brand />

        <ThemeToggle />
      </nav>

      <section className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-5 py-12">

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
          }}
          className="w-full max-w-md"
        >
          <div className="rounded-[28px] border border-black/[0.08] bg-white/80 p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-9 dark:border-white/[0.09] dark:bg-white/[0.045] dark:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">

            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create your account
              </h1>

              <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                Build your profile and let JobPilot find better opportunities.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Full name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Aditya Pandey"
                  required
                  className="h-12 w-full rounded-xl border border-black/10 bg-black/[0.02] px-4 text-sm outline-none transition focus:border-black/30 focus:ring-4 focus:ring-black/[0.04] dark:border-white/10 dark:bg-white/[0.04] dark:focus:border-white/30"
                />
              </div>

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
                  className="h-12 w-full rounded-xl border border-black/10 bg-black/[0.02] px-4 text-sm outline-none transition focus:border-black/30 focus:ring-4 focus:ring-black/[0.04] dark:border-white/10 dark:bg-white/[0.04] dark:focus:border-white/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Create a strong password"
                  minLength={8}
                  required
                  className="h-12 w-full rounded-xl border border-black/10 bg-black/[0.02] px-4 text-sm outline-none transition focus:border-black/30 focus:ring-4 focus:ring-black/[0.04] dark:border-white/10 dark:bg-white/[0.04] dark:focus:border-white/30"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                type="submit"
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 text-sm font-medium text-white shadow-lg shadow-black/10 disabled:opacity-50 dark:bg-white dark:text-black"
              >
                {loading
                  ? "Creating account..."
                  : "Create account"}

                {!loading && (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </motion.button>

            </form>

            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <ShieldCheck className="h-4 w-4" />
              Your information is securely stored.
            </div>

            <p className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
              Already have an account?{" "}

              <Link
                href="/login"
                className="font-medium text-neutral-950 hover:underline dark:text-white"
              >
                Sign in
              </Link>
            </p>

          </div>
        </motion.div>

      </section>
    </main>
  );
}