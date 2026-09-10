"use client";

import { useAuth } from "@/context/authContext";

type Role = "admin" | "sales_officer" | "finance_officer";

export default function RoleGuard({
    allow,
    children,
}: {
    allow: Role[];
    children: React.ReactNode;
}) {
    const { user } = useAuth();

    if (!user || !allow.includes(user.role)) {
        return null; // render nothing — no redirect, just hide it
    }

    return <>{children}</>;
}