"use client";
import { useState } from "react";
import { fetchAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) return;

    setIsLoading(true);
    setError("");

    try {
      const data = await fetchAPI("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      localStorage.setItem("token", data.access_token);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false); // Only re-enable if there's an error
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <input 
          name="name" type="text" placeholder="Name" required 
          className="w-full p-2 border rounded text-black"
        />
        <input 
          name="email" type="email" placeholder="Email" required 
          className="w-full p-2 border rounded text-black"
        />
        <input 
          name="password" type="password" placeholder="Password (min 8 chars)" required 
          className="w-full p-2 border rounded text-black"
        />
        <button 
          type="submit" disabled={isLoading} 
          className="w-full bg-green-600 text-white p-2 rounded disabled:opacity-50"
        >
          {isLoading ? "Creating account..." : "Register"}
        </button>
      </form>
      <p className="mt-4 text-sm">Already have an account? <Link href="/login" className="text-blue-500">Login</Link></p>
    </div>
  );
}