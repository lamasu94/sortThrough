import api from "./api";

export type ProfileInput = {
    name: string;
    email: string;
    avatarFile?: File | null;
};

export type PasswordInput = {
    currentPassword: string;
    newPassword: string;
};

export async function updateProfile(data: ProfileInput): Promise<void> {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    if (data.avatarFile) {
        formData.append("avatar", data.avatarFile);
    }
    await api.put("/auth/profile", formData);
}

export async function changePassword(data: PasswordInput): Promise<void> {
    await api.put("/auth/change-password", data);
}