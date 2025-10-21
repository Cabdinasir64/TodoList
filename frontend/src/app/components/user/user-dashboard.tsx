"use client";

import { useQuery } from "@tanstack/react-query";
import Overview from "./overview";

interface Task {
    _id: string;
    title: string;
    description: string;
    status: "pending" | "in-progress" | "completed";
    createdAt: string;
    updatedAt: string;
}

interface TasksResponse {
    message: string;
    tasks: Task[];
    total?: number;
    pending?: number;
    inProgress?: number;
    completed?: number;
}

const fetchTasks = async (): Promise<TasksResponse> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) throw new Error("Failed to fetch tasks");

    const data: TasksResponse = await res.json();

    const total = data.tasks?.length || 0;
    const pending = data.tasks?.filter((t) => t.status === "pending").length || 0;
    const inProgress = data.tasks?.filter((t) => t.status === "in-progress").length || 0;
    const completed = data.tasks?.filter((t) => t.status === "completed").length || 0;

    return { ...data, total, pending, inProgress, completed };
};

const LoadingSkeleton = () => {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <div className="h-8 bg-gray-200 rounded w-64"></div>
                    <div className="h-4 bg-gray-200 rounded w-96"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                                <div className="h-8 bg-gray-200 rounded w-12"></div>
                                <div className="h-3 bg-gray-200 rounded w-10"></div>
                            </div>
                            <div className="p-3 bg-gray-100 rounded-full">
                                <div className="h-6 w-6 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                    <div className="h-64 space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                </div>
                                <div className="flex space-x-2">
                                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                                </div>
                            </div>
                        ))}
                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex justify-between">
                                <div className="h-4 bg-gray-200 rounded w-12"></div>
                                <div className="h-4 bg-gray-200 rounded w-8"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="p-6 space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center space-x-4">
                                <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                                </div>
                            </div>
                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function UserDashboard() {
    const { data: tasksData, isLoading, error } = useQuery({
        queryKey: ['tasks'],
        queryFn: fetchTasks,
        retry: 1,
        staleTime: 5 * 60 * 1000,
        refetchInterval: 60
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-600 mt-1">
                        Welcome back! Here&apos;s your task summary and statistics.
                    </p>
                </div>
            </div>

            {isLoading && <LoadingSkeleton />}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <div className="text-red-600 text-lg font-semibold mb-2">
                        Error loading tasks
                    </div>
                    <p className="text-red-500">{(error as Error).message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {tasksData && <Overview tasksData={tasksData} />}
        </div>
    );
}