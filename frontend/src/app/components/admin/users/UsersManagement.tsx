"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useDeferredValue } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
    Search,
    Users,
    Mail,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertCircle,
    UserX,
    Shield,
    ShieldCheck,
    MoreVertical,
    Filter
} from "lucide-react";

interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
}

interface UsersResponse {
    users: User[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalUsers: number;
        hasNext: boolean;
        hasPrev: boolean;
        limit: number;
    };
}

const UsersManagement = () => {
    const [apiUrl, setApiUrl] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [mobileMenuOpen, setMobileMenuOpen] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const deferredSearchTerm = useDeferredValue(searchTerm);

    useEffect(() => {
        setApiUrl(process.env.NEXT_PUBLIC_API_URL!);
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [deferredSearchTerm]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileMenuOpen && !(event.target as Element).closest('.mobile-menu-trigger')) {
                setMobileMenuOpen(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [mobileMenuOpen]);

    const {
        data: usersData,
        isLoading,
        error,
        isFetching,
        refetch
    } = useQuery<UsersResponse, Error>({
        queryKey: ["adminUsers", currentPage, limit, deferredSearchTerm],
        queryFn: async (): Promise<UsersResponse> => {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: limit.toString(),
                ...(deferredSearchTerm && { search: deferredSearchTerm })
            });

            const response = await fetch(`${apiUrl}/api/users/admin/users?${params}`, {
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch users: ${response.status}`);
            }

            return response.json();
        },
        enabled: !!apiUrl,
        retry: 2,
    });

    const updateRoleMutation = useMutation({
        mutationFn: async ({ userId, role }: { userId: string; role: string }) => {

            const response = await fetch(`${apiUrl}/api/users/admin/users/${userId}/role`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ role }),
            });


            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP ${response.status}`);
            }

            return data;
        },
        onSuccess: (variables) => {
            toast.success(
                <div className="flex items-center space-x-2">
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                    <span className="font-medium">{variables.role === 'admin' ? 'Admin privileges granted' : 'User role set'}</span>
                </div>,
                {
                    duration: 3000,
                    position: "top-right",
                    style: {
                        background: '#f0fdf4',
                        color: '#166534',
                        border: '1px solid #bbf7d0',
                    }
                }
            );
            queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
            setMobileMenuOpen(null);
        },
        onError: (error: Error) => {
            toast.error(
                <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <span className="font-medium">{error.message}</span>
                </div>,
                {
                    duration: 5000,
                    position: "top-right",
                    style: {
                        background: '#fef2f2',
                        color: '#dc2626',
                        border: '1px solid #fecaca',
                    }
                }
            );
            setMobileMenuOpen(null);
        },
    });

    const handleRoleUpdate = (user: User, newRole: string) => {
        if (user.role === newRole) {
            toast("Role is already set to " + newRole, { icon: "ℹ️" });
            return;
        }

        updateRoleMutation.mutate({
            userId: user._id,
            role: newRole
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getRoleColor = (role: string) => {
        return role === 'admin'
            ? 'from-red-500 to-pink-600'
            : 'from-blue-500 to-cyan-600';
    };

    const getRoleIcon = (role: string) => {
        return role === 'admin' ?
            <Shield className="h-4 w-4" /> :
            <Users className="h-4 w-4" />;
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
                <Toaster position="top-right" />
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="h-10 w-10 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Connection Issue</h2>
                    <p className="text-slate-600 mb-2">{error.message}</p>
                    <p className="text-sm text-slate-500 mb-6">Please check your connection and try again</p>
                    <div className="space-y-3">
                        <button
                            onClick={() => refetch()}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
                        >
                            <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                            Retry Connection
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-slate-500 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 lg:p-6">
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        borderRadius: '12px',
                        padding: '12px 16px',
                    },
                }}
            />

            <div className="max-w-7xl mx-auto">
                <div className="mb-6 lg:mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text ">
                                User Management
                            </h1>
                            <p className="text-slate-600 mt-1 text-sm lg:text-base">
                                Manage user roles and system access
                            </p>
                        </div>

                        {usersData && (
                            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 shadow-sm">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <Users className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {usersData.pagination.totalUsers}
                                        </p>
                                        <p className="text-sm text-slate-500">Total Users</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 lg:p-6 mb-6 lg:mb-8">
                    <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
                        <div className="relative w-full xl:max-w-md">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search by username or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50 transition-all duration-200 text-sm lg:text-base"
                            />
                            {isFetching && (
                                <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 animate-spin" />
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                            <div className="bg-slate-100 px-4 py-2 rounded-lg text-sm text-slate-700 font-medium flex items-center">
                                <Filter className="h-4 w-4 mr-2" />
                                {usersData ? (
                                    `Page ${usersData.pagination.currentPage} • ${usersData.users.length} users`
                                ) : (
                                    "Loading users..."
                                )}
                            </div>
                            <select
                                value={limit}
                                onChange={(e) => setLimit(Number(e.target.value))}
                                className="bg-white border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm lg:text-base"
                            >
                                <option value="5">5 per page</option>
                                <option value="10">10 per page</option>
                                <option value="20">20 per page</option>
                                <option value="50">50 per page</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 lg:px-6 py-4 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-slate-900 text-lg flex items-center space-x-2">
                                <Users className="h-5 w-5 text-blue-500" />
                                <span>User Accounts</span>
                            </h2>
                            <div className="flex items-center space-x-4">
                                {isFetching && (
                                    <div className="flex items-center text-sm text-blue-600 font-medium">
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Syncing...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {isLoading && (
                        <div className="flex justify-center items-center py-16">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                                </div>
                                <p className="text-slate-600 font-medium">Loading users...</p>
                            </div>
                        </div>
                    )}

                    {!isLoading && usersData && (
                        <>
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="text-left py-4 px-6 text-sm font-semibold text-slate-900 uppercase tracking-wider">User Profile</th>
                                            <th className="text-left py-4 px-6 text-sm font-semibold text-slate-900 uppercase tracking-wider">Role</th>
                                            <th className="text-left py-4 px-6 text-sm font-semibold text-slate-900 uppercase tracking-wider">Member Since</th>
                                            <th className="text-left py-4 px-6 text-sm font-semibold text-slate-900 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {usersData.users.map((user) => (
                                            <tr
                                                key={user._id}
                                                className="hover:bg-slate-50/50 transition-colors duration-150 group"
                                            >
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center space-x-4">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow bg-gradient-to-r ${getRoleColor(user.role)}`}>
                                                            <span className="text-white font-bold text-sm">
                                                                {user.username.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-slate-900 truncate">
                                                                {user.username}
                                                            </p>
                                                            <p className="text-sm text-slate-500 flex items-center truncate">
                                                                <Mail className="h-3 w-3 mr-2 flex-shrink-0" />
                                                                <span className="truncate">{user.email}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center space-x-2">
                                                        {getRoleIcon(user.role)}
                                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${user.role === 'admin'
                                                            ? 'bg-red-50 text-red-700 border-red-200'
                                                            : 'bg-blue-50 text-blue-700 border-blue-200'
                                                            }`}>
                                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center text-sm text-slate-600 space-x-2">
                                                        <Calendar className="h-4 w-4 text-slate-400" />
                                                        <span>{formatDate(user.createdAt)}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center space-x-3">
                                                        <select
                                                            value={user.role}
                                                            onChange={(e) => handleRoleUpdate(user, e.target.value)}
                                                            disabled={updateRoleMutation.isPending}
                                                            className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                                                        >
                                                            <option value="user">👤 User</option>
                                                            <option value="admin">🛡️ Admin</option>
                                                        </select>
                                                        {updateRoleMutation.isPending && (
                                                            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="lg:hidden">
                                {usersData.users.map((user) => (
                                    <div key={user._id} className="border-b border-slate-200 last:border-b-0 p-4 hover:bg-slate-50/50 transition-colors duration-150">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm bg-gradient-to-r ${getRoleColor(user.role)}`}>
                                                    <span className="text-white font-bold text-sm">
                                                        {user.username.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-semibold text-slate-900 truncate">{user.username}</p>
                                                    <p className="text-sm text-slate-500 truncate flex items-center">
                                                        <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="relative mobile-menu-trigger">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setMobileMenuOpen(mobileMenuOpen === user._id ? null : user._id);
                                                    }}
                                                    className="p-2 rounded-xl hover:bg-slate-200 transition-colors"
                                                >
                                                    <MoreVertical className="h-4 w-4 text-slate-500" />
                                                </button>

                                                {mobileMenuOpen === user._id && (
                                                    <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 min-w-[160px] overflow-hidden">
                                                        <div className="p-3 border-b border-slate-100 bg-slate-50">
                                                            <span className="text-xs font-semibold text-slate-600">Change Role</span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRoleUpdate(user, 'user')}
                                                            disabled={updateRoleMutation.isPending || user.role === 'user'}
                                                            className={`w-full text-left px-4 py-3 text-sm flex items-center space-x-2 transition-colors ${user.role === 'user'
                                                                ? 'bg-blue-50 text-blue-700'
                                                                : 'hover:bg-slate-50 text-slate-700'
                                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                        >
                                                            <Users className="h-4 w-4" />
                                                            <span>Set as User</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleRoleUpdate(user, 'admin')}
                                                            disabled={updateRoleMutation.isPending || user.role === 'admin'}
                                                            className={`w-full text-left px-4 py-3 text-sm flex items-center space-x-2 transition-colors ${user.role === 'admin'
                                                                ? 'bg-red-50 text-red-700'
                                                                : 'hover:bg-slate-50 text-slate-700'
                                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                        >
                                                            <Shield className="h-4 w-4" />
                                                            <span>Set as Admin</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-slate-500">Role:</span>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${user.role === 'admin'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="h-3 w-3 text-slate-400" />
                                                <span className="text-slate-500">{formatDate(user.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {usersData.users.length === 0 && (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <UserX className="h-10 w-10 text-slate-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No users found</h3>
                                    <p className="text-slate-500 max-w-md mx-auto">
                                        {deferredSearchTerm
                                            ? `No users match "${deferredSearchTerm}". Try different search terms.`
                                            : "There are no users in the system yet."
                                        }
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                    {usersData && usersData.pagination.totalPages > 1 && (
                        <div className="bg-slate-50 px-4 lg:px-6 py-4 border-t border-slate-200">
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-slate-600">
                                    Page <span className="font-semibold">{usersData.pagination.currentPage}</span> of{" "}
                                    <span className="font-semibold">{usersData.pagination.totalPages}</span>
                                    <span className="mx-2">•</span>
                                    <span className="font-semibold">{usersData.pagination.totalUsers.toLocaleString()}</span> total users
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        disabled={!usersData.pagination.hasPrev || isFetching}
                                        className="flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-2" />
                                        Previous
                                    </button>

                                    <div className="flex space-x-1">
                                        {Array.from({ length: Math.min(5, usersData.pagination.totalPages) }, (_, i) => {
                                            const pageNum = i + 1;
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    disabled={isFetching}
                                                    className={`px-3 py-2 border text-sm font-medium rounded-lg transition-all duration-200 ${usersData.pagination.currentPage === pageNum
                                                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-md"
                                                        : "border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400 shadow-sm"
                                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        disabled={!usersData.pagination.hasNext || isFetching}
                                        className="flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-2" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UsersManagement;