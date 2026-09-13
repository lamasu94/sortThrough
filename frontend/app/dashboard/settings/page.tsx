"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateProfile, changePassword } from "@/services/authService";
import { useAuth } from "@/context/authContext";
import Image from "next/image";

export default function SettingsPage() {
    const { user, login, token } = useAuth();

    return (
        <div className="space-y-6 max-w-lg">
            <div>
                <h1 className="text-xl font-serif font-bold text-[#0F1923]">Settings</h1>
                <p className="text-sm text-[#7B8186] mt-1">Update your profile and password.</p>
            </div>

            <ProfileSection user={user} token={token} login={login} />
            <PasswordSection />
        </div>
    );
}

function ProfileSection({ user, token, login }: { user: any; token: string | null; login: (u: any, t: string) => void }) {
    const [name, setName] = useState(user?.name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const avatarPreview = avatarFile
        ? URL.createObjectURL(avatarFile)
        : user?.avatar
        ? `http://localhost:5000/uploads/avatars/${user.avatar}`
        : "/profile.svg";

    const mutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            setSuccess(true);
            setError("");
            // update the locally stored user so the Navbar reflects changes immediately
            if (token) login({ ...user, name, email }, token);
        },
        onError: (err: any) => {
            setError(err.response?.data?.error || "Failed to update profile");
            setSuccess(false);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ name, email, avatarFile });
    };

    return (
        <div className=" bg-white border border-[#CBDDE9]/60 rounded-xl p-6">
            <h2 className="text-sm font-medium text-[#0F1923] mb-4">Profile</h2>

            {success && <p className="text-sm text-[#2872A1] bg-[#2872A1]/10 px-3 py-2 rounded-md mb-4">Profile updated.</p>}
            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-[#CBDDE9]/40">
                        <Image src={avatarPreview} alt="avatar" width={64} height={64} className="w-full h-full object-cover" />
                    </div>
                    <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)} className="text-sm" />
                </div>

                <div>
                    <label className="text-xs text-[#7B8186] uppercase tracking-wide">Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} required
                        className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1] text-[#7B8186]" />
                </div>

                <div>
                    <label className="text-xs text-[#7B8186] uppercase tracking-wide">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                        className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1] text-[#7B8186]" />
                </div>

                <button type="submit" disabled={mutation.isPending}
                    className="px-4 py-2 bg-[#0F1923] hover:bg-[#152533] text-white text-sm font-medium rounded-lg disabled:opacity-50">
                    {mutation.isPending ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}

function PasswordSection() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const mutation = useMutation({
        mutationFn: changePassword,
        onSuccess: () => {
            setSuccess(true);
            setError("");
            setCurrentPassword("");
            setNewPassword("");
        },
        onError: (err: any) => {
            setError(err.response?.data?.error || "Failed to change password");
            setSuccess(false);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ currentPassword, newPassword });
    };

    return (
        <div className="bg-white border border-[#CBDDE9]/60 rounded-xl p-6">
            <h2 className="text-sm font-medium text-[#0F1923] mb-4">Change Password</h2>

            {success && <p className="text-sm text-[#2872A1] bg-[#2872A1]/10 px-3 py-2 rounded-md mb-4">Password changed.</p>}
            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-xs text-[#7B8186] uppercase tracking-wide">Current Password</label>
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required
                        className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1] text-[#7B8186]" />
                </div>

                <div>
                    <label className="text-xs text-[#7B8186] uppercase tracking-wide">New Password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
                        className="w-full mt-1 border border-[#CBDDE9] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2872A1] text-[#7B8186]" />
                </div>

                <button type="submit" disabled={mutation.isPending}
                    className="px-4 py-2 bg-[#0F1923] hover:bg-[#152533] text-white text-sm font-medium rounded-lg disabled:opacity-50">
                    {mutation.isPending ? "Updating..." : "Change Password"}
                </button>
            </form>
        </div>
    );
}