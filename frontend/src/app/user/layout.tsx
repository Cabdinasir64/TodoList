import type { Metadata } from "next";
import UserHeader from "../components/user/UserHeader";
import UserSidebar from "../components/user/UserSidebar";

export const metadata: Metadata = {
    title: {
        template: "%s | User Dashboard",
        default: "User Dashboard",
    },
    description: "Manage your account, tasks, and profile in one place",
    keywords: ["user", "dashboard", "tasks", "profile", "management"],
    authors: [{ name: "Your Company" }],
    creator: "Your Company",
    publisher: "Your Company",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL("https://yourdomain.com"),
    alternates: {
        canonical: "/user",
    },
    openGraph: {
        title: "User Dashboard",
        description: "Manage your account, tasks, and profile in one place",
        url: "/user",
        siteName: "Your App",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "User Dashboard",
        description: "Manage your account, tasks, and profile in one place",
        creator: "@yourapp",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

interface UserLayoutProps {
    children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <UserHeader />
            <div className="flex">
                <UserSidebar />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}