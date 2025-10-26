import type { Metadata } from "next";
import AdminHeader from "../components/admin/adminHeader";
import AdminSidebar from "../components/admin/adminSidebar";

export const metadata: Metadata = {
    title: {
        template: "%s | Admin Dashboard",
        default: "Admin Dashboard",
    },
    description: "Administrative dashboard for managing users, content, and system settings",
    metadataBase: new URL("https://yourdomain.com"),
    keywords: ["admin", "dashboard", "management", "users", "content"],
    authors: [{ name: "Your Company" }],
    creator: "Your Company",
    publisher: "Your Company",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    alternates: {
        canonical: "/admin",
    },
    openGraph: {
        title: "Admin Dashboard",
        description: "Administrative dashboard for managing users, content, and system settings",
        url: "/admin",
        siteName: "Your Company",
        locale: "en_US",
        type: "website",
    },
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
        },
    },
};

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <AdminHeader />
            <div className="flex flex-1 overflow-hidden">
                <AdminSidebar />
                <div className="flex-1 flex flex-col min-h-0">
                    <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}