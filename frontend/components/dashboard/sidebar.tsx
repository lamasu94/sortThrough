"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItemsByRole } from "@/lib/nav-config";
import { LiaSortSolid } from "react-icons/lia";
import { useAuth } from "@/context/authContext";

export default function Sidebar() {
    const pathname = usePathname();
    const { user } = useAuth();

    if (!user) return null; // nothing to show if not logged in

    const items = navItemsByRole[user.role];

  return (
    <div className="flex flex-col bg-[#0F1923] space-y-4 w-60 min-h-screen">
      <div>
        <div className="bg-[#CBDDE9]  flex flex-row gap-x-2 p-2 items-center justify-center">
          <LiaSortSolid className="text-[#0F1923]" size={24} />
          <h2 className="text-lg font-semibold text-[#0F1923]">sortThrough</h2>
        </div>
      </div>
      <div className="flex flex-col px-3 space-y-1">
        {items.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-[#2872A1] text-white"
                  : "text-[#CBDDE9]/70 hover:bg-white/5 hover:text-[#CBDDE9]"
              }`}
            >
              <Icon size={17} strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}