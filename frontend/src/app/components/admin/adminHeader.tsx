"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../../lib/userStore";
import api from "../../util/api";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMobileMenuStore } from "../../lib/mobileMenuStore";

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

const AdminHeader = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { username, setUser, logout } = useStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { isMobileMenuOpen, toggleMobileMenu } = useMobileMenuStore();

    const { data: userData, isLoading, error } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async (): Promise<User> => {
            const { data } = await api.get<GetMeResponse>("/api/users/me");
            if (!data.user.username) throw new Error("Invalid user data");

            if (data.user.role !== 'admin') {
                throw new Error("Unauthorized access");
            }

            setUser(data.user.username);
            return data.user;
        },
        retry: 1,
        staleTime: 5 * 60 * 1000,
        enabled: !username,
    });

    useEffect(() => {
        if (error) {
            logout();
            toast.error("Session expired or unauthorized. Please sign in again.");
            router.push("/signin");
        }
    }, [error, logout, router]);

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
        try {
            await api.post("/api/users/logout");
            queryClient.removeQueries({ queryKey: ['userProfile'] });
            logout();
            toast.success("Logged out successfully");
            router.push("/signin");
        } catch (err: unknown) {
            queryClient.removeQueries({ queryKey: ['userProfile'] });
            logout();
            toast.error((err as Error).message || "Logout completed locally");
            router.push("/signin");
        } finally {
            setIsDropdownOpen(false);
        }
    };

    const handleProfileClick = () => {
        setIsDropdownOpen(false);
        router.push("/admin/profile");
    };

    const handleAdminDashboard = () => {
        setIsDropdownOpen(false);
        router.push("/admin/dashboard");
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part.charAt(0).toUpperCase())
            .join('')
            .slice(0, 1);
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
                    <button
                        onClick={toggleMobileMenu}
                        className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {isMobileMenuOpen ? (
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>

                    <div className="flex flex-col">
                        <h1 className="text-lg font-semibold text-gray-900">
                            Admin Dashboard
                        </h1>
                        <p className="text-sm text-gray-500">
                            Welcome back, {username || "Admin"}
                        </p>
                    </div>
                </div>

                {username && userData && (
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span>System Online</span>
                            </div>
                        </div>

                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-1 transition-all duration-200 hover:bg-gray-100"
                            >
                                <div className="flex items-center space-x-2">
                                    <div className="h-10 w-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-sm">
                                        <span className="text-white font-semibold text-sm">
                                            {getInitials(username)}
                                        </span>
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium text-gray-900">{username}</p>
                                        <p className="text-xs text-gray-500">Administrator</p>
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
                                        <div className="mt-1">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                Administrator
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleAdminDashboard}
                                        className="w-full px-4 py-2 text-sm cursor-pointer text-gray-700 hover:bg-gray-50 text-left transition-colors duration-150 flex items-center space-x-2"
                                    >
                                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        <span>Dashboard</span>
                                    </button>

                                    <button
                                        onClick={handleProfileClick}
                                        className="w-full px-4 py-2 text-sm cursor-pointer text-gray-700 hover:bg-gray-50 text-left transition-colors duration-150 flex items-center space-x-2"
                                    >
                                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>Profile</span>
                                    </button>

                                    <div className="border-t border-gray-100 my-1"></div>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 text-sm cursor-pointer text-red-600 hover:bg-red-50 text-left transition-colors duration-150 flex items-center space-x-2"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default AdminHeader;