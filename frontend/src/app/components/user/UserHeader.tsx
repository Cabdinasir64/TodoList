"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../../lib/userStore";
import api from "../../util/api";
import toast from "react-hot-toast";

interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
}

interface GetMeResponse {
    message: string;
    user: User;
}

const UserHeader = () => {
    const router = useRouter();
    const { username, setUser, logout } = useStore();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [hasFetchedProfile, setHasFetchedProfile] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userData, setUserData] = useState<User | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get<GetMeResponse>("/api/users/me");
            if (!data.user.username) throw new Error("Invalid user data");

            setUser(data.user.username);
            setUserData(data.user);
            setHasFetchedProfile(true);
        } catch (err: any) {
            logout();
            toast.error("Session expired. Please sign in again.");
            router.push("/signin");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!username && !hasFetchedProfile) {
            fetchProfile();
        } else {
            setIsLoading(false);
        }
    }, [username, hasFetchedProfile]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);

        try {
            await api.post("/api/users/logout");
            logout();
            setUserData(null);
            toast.success("Logged out successfully");
            router.push("/signin");
        } catch (err: any) {
            logout();
            setUserData(null);
            toast.error(err.message || "Logout completed locally");
            router.push("/signin");
        } finally {
            setIsLoggingOut(false);
            setIsDropdownOpen(false);
        }
    };

    const handleProfileClick = () => {
        setIsDropdownOpen(false);
        router.push("/profile");
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part.charAt(0).toUpperCase())
            .join('')
            .slice(0, 2);
    };

    if (isLoading) {
        return (
            <header className="bg-white shadow-sm border-b border-gray-200 p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="flex flex-col">
                        <h1 className="text-lg font-semibold text-gray-900">
                            Welcome, {username || "User"}
                        </h1>
                        {!username && (
                            <p className="text-sm text-amber-600">
                                Please log in to access all features
                            </p>
                        )}
                    </div>
                </div>
                {username && userData && (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-1 transition-all duration-200 hover:bg-gray-100"
                        >
                            <div className="flex items-center space-x-2">
                                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                                    <span className="text-white font-semibold text-sm">
                                        {getInitials(username)}
                                    </span>
                                </div>
                            </div>
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in-80">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {username}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate mt-1">
                                        {userData.email}
                                    </p>
                                </div>
                                <button
                                    onClick={handleProfileClick}
                                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left transition-colors duration-150 flex items-center space-x-2"
                                >
                                    <svg
                                        className="h-4 w-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    <span>Profile</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left transition-colors duration-150 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoggingOut ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                            <span>Logging out...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                />
                                            </svg>
                                            <span>Logout</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {username && !userData && (
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out ${isLoggingOut
                            ? "bg-gray-400 cursor-not-allowed text-gray-700"
                            : "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md"
                            } focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
                    >
                        {isLoggingOut ? (
                            <>
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Logging out...</span>
                            </>
                        ) : (
                            <>
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                                <span>Logout</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </header>
    );
};

export default UserHeader;