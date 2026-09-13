"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

type Role = "admin" | "sales_officer" | "finance_officer";

export default function RequireRole({
    allow,
    children,
}: {
    allow: Role[];
    children: React.ReactNode;
}) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // dashboard/layout.tsx already guarantees `user` exists by the time
        // this renders — this only checks whether their ROLE is allowed here
        if (user && !allow.includes(user.role)) {
            router.replace("/dashboard"); // bounce back to the redirect-by-role page
        }
    }, [user, allow, router]);

    if (!user || !allow.includes(user.role)) {
        return null; // brief flash before the redirect above kicks in
    }

    return <>{children}</>;
}