"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
// TODO: import your real auth hook once context/AuthContext.tsx exists
// import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const router = useRouter();

  // TODO: replace with real logged-in user from AuthContext
  // const { user } = useAuth();
  const user = { role: "admin" }; // placeholder until AuthContext is built

  useEffect(() => {
    if (user.role === "admin") router.replace("/dashboard/admin");
    else if (user.role === "sales_officer") router.replace("/dashboard/sales");
    else if (user.role === "finance_officer") router.replace("/dashboard/finance");
  }, [user.role, router]);

  return null;
}