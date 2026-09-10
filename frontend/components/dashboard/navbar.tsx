"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LiaSortSolid } from "react-icons/lia";
import { CiSearch } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { LogOut, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/authContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    // turn "sales_officer" into "Sales Officer" for display
    const roleLabel = user?.role
        ?.split("_")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ");

    return (
        <div className="flex flex-row justify-between items-center bg-[#FAFBFC] border-b border-gray-200 p-2">
            <div className="rounded-lg flex flex-row gap-x-2 p-2 items-center justify-center">
                <LiaSortSolid className="text-[#0F1923]" size={16} />
                <h2 className="text-lg font-semibold text-[#0F1923]">sortThrough</h2>
            </div>

            <div className="flex flex-row gap-x-5 items-center">
                <div className="flex flex-row items-center bg-gray-300 gap-x-2 rounded-lg px-4 py-2 w-full max-w-md">
                    <CiSearch className="text-black" />
                    <input
                        className="bg-transparent outline-none w-full text-sm text-black"
                        placeholder="Search for anything"
                    />
                </div>

                <div className="bg-[#0F1923] rounded-full p-3 flex items-center justify-center">
                    <IoIosNotificationsOutline className="text-[#CBDDE9]" size={18} />
                </div>

                {/* Profile + dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className="flex items-center gap-2"
                    >
                        <div className="rounded-full overflow-hidden w-10 h-10 shrink-0 bg-[#CBDDE9]">
                            <Image
                                src={user?.avatar ? `http://localhost:5000/uploads/avatars/${user.avatar}` : "/profile.svg"}
                                alt="profile"
                                width={40}
                                height={40}
                                className="rounded-full object-cover w-full h-full"
                            />
                        </div>
                        <div className="text-left leading-tight hidden sm:block">
                            <p className="text-sm font-medium text-[#0F1923]">{user?.name}</p>
                            <p className="text-xs text-[#7B8186]">{roleLabel}</p>
                        </div>
                        <ChevronDown size={14} className="text-[#7B8186]" />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#CBDDE9] rounded-lg shadow-lg py-1 z-50">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#0F1923] hover:bg-[#CBDDE9]/30 transition-colors"
                            >
                                <LogOut size={15} />
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}