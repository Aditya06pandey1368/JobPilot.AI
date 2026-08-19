"use client";
import { useState } from "react";
import { fetchAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await fetchAPI("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      localStorage.setItem("token", data.access_token);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <input 
          type="text" placeholder="Name" required className="w-full p-2 border rounded text-black"
          value={name} onChange={(e) => setName(e.target.value)} 
        />
        <input 
          type="email" placeholder="Email" required className="w-full p-2 border rounded text-black"
          value={email} onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" placeholder="Password" required className="w-full p-2 border rounded text-black"
          value={password} onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Register</button>
      </form>
      <p className="mt-4 text-sm">Already have an account? <Link href="/login" className="text-blue-500">Login</Link></p>
    </div>
  );
}