"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

export default function DashboardPage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (isLoading) return; // wait until we know if there's a logged-in user

        if (!user) {
            router.replace("/login");
            return;
        }

        if (user.role === "admin") router.replace("/dashboard/admin");
        else if (user.role === "sales_officer") router.replace("/dashboard/sales");
        else if (user.role === "finance_officer") router.replace("/dashboard/finance");
    }, [user, isLoading, router]);

    return null;
}