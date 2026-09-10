"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Role = "admin" | "sales_officer" | "finance_officer";

type User = {
    id: number;
    name: string;
    email: string;
    role: Role;
    avatar: string | null;
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    isLoading: boolean; // true while checking localStorage on first load
    login: (user: User, token: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // on first load, check if a user was already logged in (saved from a previous session)
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        try {
            if (storedUser && storedToken && storedUser !== "undefined") {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            }
        } catch (err) {
            // corrupted or invalid data — clear it instead of crashing
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        }

        setIsLoading(false);
    }, []);

    const login = (user: User, token: string) => {
        setUser(user);
        setToken(token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// the hook every component will actually use
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside an AuthProvider");
    }
    return context;
}