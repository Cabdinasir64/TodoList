import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Overview",
    description: "View your dashboard overview and quick statistics",
};

export default function UserPage() {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Quick Stats</h3>
                    <p className="text-gray-600">Your overview statistics will appear here.</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Recent Activity</h3>
                    <p className="text-gray-600">Your recent activities will appear here.</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Quick Actions</h3>
                    <p className="text-gray-600">Access frequently used features quickly.</p>
                </div>
            </div>
        </div>
    );
}