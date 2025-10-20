import { ReactNode } from "react";
import Link from "next/link";

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 relative flex items-center justify-center">
            <Link href="/">
                <h1 className="absolute top-6 left-6 text-blue-600 text-3xl font-bold cursor-pointer">
                    TaskTrek
                </h1>
            </Link>
            <div className="w-full max-w-md p-6">
                {children}
            </div>
        </div>
    );
}
