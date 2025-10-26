import type { Metadata } from "next";
import UsersManagement from "../../components/admin/users/UsersManagement";

export const metadata: Metadata = {
    title: "Users Management | Admin Panel",
    description: "Manage users and their roles",
};

export default function UsersPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <UsersManagement />
            </div>
        </div>
    );
}