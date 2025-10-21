import type { Metadata } from "next";
import UserHeader from "../components/user/UserHeader";
import UserSidebar from "../components/user/UserSidebar";

export const metadata: Metadata = {
    title: {
        template: "%s | User Dashboard",
        default: "User Dashboard",
    },
    description: "Manage your account, tasks, and profile in one place",
    metadataBase: new URL("https://yourdomain.com"),
    keywords: ["user", "dashboard", "tasks", "profile", "management"],
    authors: [{ name: "TaskTrek" }],
    creator: "TaskTrek",
    publisher: "TaskTrek",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    alternates: {
        canonical: "/user",
    },
    openGraph: {
        title: "User Dashboard",
        description: "Manage your account, tasks, and profile in one place",
        url: "/user",
        siteName: "TaskTrek",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "User Dashboard",
        description: "Manage your account, tasks, and profile in one place",
        creator: "@TaskTrek",
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
        <div className="flex flex-col h-screen bg-gray-50">
            <UserHeader />
            <div className="flex flex-1 overflow-hidden">
                <UserSidebar />
                <div className="flex-1 flex flex-col min-h-0">
                    <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}