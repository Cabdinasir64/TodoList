import type { Metadata } from "next";
import { cookies } from "next/headers";
import AdminDashboard from "../../components/admin/dashboard/AdminDashboard";

interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
}

interface DashboardData {
    stats: {
        totalUsers: number;
        activeUsers: number;
        newUsersToday: number;
        adminUsers: number;
    };
    recentUsers: User[];
    chartData: { name: string; users: number }[];
}

async function getDashboardData(): Promise<DashboardData> {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();

        const response = await fetch(`${apiUrl}/api/users/admin/dashboard`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieHeader 
            },
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch dashboard data: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error: unknown) {
        return {
            stats: {
                totalUsers: 156,
                activeUsers: 128,
                newUsersToday: 5,
                adminUsers: 3
            },
            recentUsers: [
                { _id: "1", username: "john_doe", email: "john@example.com", role: "user", createdAt: new Date().toISOString() },
                { _id: "2", username: "jane_smith", email: "jane@example.com", role: "user", createdAt: new Date(Date.now() - 86400000).toISOString() },
                { _id: "3", username: "admin_user", email: "admin@example.com", role: "admin", createdAt: new Date(Date.now() - 172800000).toISOString() }
            ],
            chartData: [
                { name: 'Jan', users: 45 },
                { name: 'Feb', users: 52 },
                { name: 'Mar', users: 48 },
                { name: 'Apr', users: 60 },
                { name: 'May', users: 75 },
                { name: 'Jun', users: 82 },
            ]
        };
    }
}

export const metadata: Metadata = {
    title: "Dashboard | TaskTrek",
    description: "Admin dashboard with user statistics and analytics",
};

export default async function AdminDashboardPage() {
    const dashboardData = await getDashboardData();

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-2">Manage your users and view system statistics</p>
                </div>

                <AdminDashboard initialData={dashboardData} />
            </div>
        </div>
    );
}
