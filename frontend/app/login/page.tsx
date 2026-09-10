"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, CheckCircle2, Maximize2, Sparkles } from "lucide-react";
import { LiaSortSolid } from "react-icons/lia";
import Link from "next/link";
import { useAuth } from "@/context/authContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password,
            });

            const { user, token } = response.data;
            login(user, token);

            // send them to the right dashboard based on their role
            if (user.role === "admin") router.push("/dashboard/admin");
            else if (user.role === "sales_officer") router.push("/dashboard/sales");
            else if (user.role === "finance_officer") router.push("/dashboard/finance");
        } catch (err: any) {
            setError(err.response?.data?.msg || "Login failed. Check your credentials.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#CBDDE9] flex items-center justify-center p-6">
            {/* Back button */}
            <Link href="/">
                <button className="absolute top-6 left-6 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#CBDDE9]/40 transition">
                    <ArrowLeft className="w-5 h-5 text-[#0F1923]" />
                </button>
            </Link>

            {/* Card */}
            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                {/* Left illustration panel */}
                <div className="relative bg-[#CBDDE9]/40 flex items-center justify-center p-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#CBDDE9]/60 to-transparent" />
                    <LiaSortSolid className="w-32 h-32 text-[#0F1923] relative z-10" strokeWidth={1} />
                </div>

                {/* Right form panel */}
                <div className="p-10 flex flex-col justify-center">
                    <h1 className="text-4xl font-serif text-[#0F1923] mb-8">Login</h1>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>
                        )}

                        <div className="flex items-center border-b border-[#CBDDE9] pb-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="yourmail@example.com"
                                required
                                className="w-full text-sm text-[#0F1923] placeholder-[#7B8186] outline-none bg-transparent"
                            />
                            <CheckCircle2 className="w-4 h-4 text-[#2872A1]" />
                        </div>

                        <div className="border-b border-[#CBDDE9] pb-2">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••"
                                required
                                className="w-full text-sm text-[#0F1923] placeholder-[#7B8186] outline-none bg-transparent"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#2872A1] hover:bg-[#0F1923] transition-colors text-white text-sm font-medium py-3 rounded-full disabled:opacity-50"
                        >
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </button>

                        <p className="text-center text-sm text-[#7B8186] italic pt-2">
                            Forgot password?
                        </p>
                    </form>
                </div>
            </div>

            {/* Floating action buttons */}
            <button className="absolute bottom-6 right-16 w-11 h-11 rounded-full bg-[#CBDDE9]/50 shadow-md flex items-center justify-center hover:bg-[#CBDDE9] transition">
                <Maximize2 className="w-4 h-4 text-[#0F1923]" />
            </button>
            <button className="absolute bottom-6 right-6 w-11 h-11 rounded-full bg-[#0F1923] shadow-md flex items-center justify-center hover:bg-[#152533] transition">
                <Sparkles className="w-4 h-4 text-white" />
            </button>
        </div>
    );
}