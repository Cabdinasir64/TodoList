"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useMobileMenuStore } from "../../lib/mobileMenuStore";
import { useStore } from '../../lib/userStore'

interface NavItem {
    name: string;
    href: string;
    icon: string;
}

const adminNavItems: NavItem[] = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "📊" },
    { name: "Users", href: "/admin/users", icon: "👥" },
    { name: "Profile", href: "/admin/profile", icon: "👤" },
];

const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();

    const { isMobileMenuOpen, closeMobileMenu } = useMobileMenuStore();
    const { username } = useStore();

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth < 1024) {
                setIsOpen(false);
            } else {
                setIsOpen(true);
            }
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    useEffect(() => {
        closeMobileMenu();
    }, [pathname, closeMobileMenu]);

    const renderNavItem = (item: NavItem) => {
        const isActive = pathname === item.href;

        return (
            <Link key={item.name} href={item.href}>
                <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                        flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                        ${isActive
                            ? "bg-red-500 shadow-lg shadow-red-500/25"
                            : "bg-gray-700/50 hover:bg-gray-700"
                        }
                        ${isOpen ? "justify-start" : "justify-center"}
                    `}
                >
                    <span className="text-lg flex-shrink-0">{item.icon}</span>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                                className="font-medium whitespace-nowrap overflow-hidden"
                            >
                                {item.name}
                            </motion.span>
                        )}
                    </AnimatePresence>

                    {!isOpen && isActive && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute right-2 w-2 h-2 bg-red-300 rounded-full"
                        />
                    )}
                </motion.div>
            </Link>
        );
    };

    const desktopSidebar = (
        <motion.div
            initial={{ width: 256 }}
            animate={{ width: isOpen ? 256 : 80 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-gradient-to-b from-gray-800 to-gray-900 text-white h-screen p-4 flex-col relative shadow-xl hidden lg:flex"
        >
            <div className={`flex items-center ${isOpen ? "justify-between" : "justify-center"} mb-8`}>
                <AnimatePresence>
                    {isOpen && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="font-bold text-xl bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent"
                        >
                            Admin Panel
                        </motion.span>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors shadow-md"
                >
                    <motion.span
                        animate={{ rotate: isOpen ? 0 : 180 }}
                        transition={{ duration: 0.3 }}
                    >
                        {isOpen ? "◀" : "▶"}
                    </motion.span>
                </motion.button>
            </div>

            <nav className="flex flex-col gap-2 flex-1">
                {adminNavItems.map(renderNavItem)}
            </nav>

            <div className="p-3 bg-gray-700/30 rounded-xl border border-gray-600 mt-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                            {username ? username.charAt(0).toUpperCase() : 'A'}
                        </span>
                    </div>
                    {isOpen && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{username || 'Admin'}</p>
                            <p className="text-xs text-gray-400 truncate">Administrator</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );

    const mobileSidebar = (
        <>
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMobileMenu}
                            className="lg:hidden fixed inset-0 bg-black/50 z-40"
                        />
                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="lg:hidden fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white z-50 p-4 flex flex-col shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <span className="font-bold text-xl bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                                    Admin Panel
                                </span>
                                <button
                                    onClick={closeMobileMenu}
                                    className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <nav className="flex flex-col gap-2 flex-1">
                                {adminNavItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link key={item.name} href={item.href}>
                                            <motion.div
                                                whileTap={{ scale: 0.95 }}
                                                onClick={closeMobileMenu}
                                                className={`
                                                    flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                                                    ${isActive
                                                        ? "bg-red-500 shadow-lg shadow-red-500/25"
                                                        : "bg-gray-700/50 hover:bg-gray-700"
                                                    }
                                                `}
                                            >
                                                <span className="text-lg">{item.icon}</span>
                                                <span className="font-medium">{item.name}</span>
                                            </motion.div>
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="p-3 bg-gray-700/30 rounded-xl border border-gray-600">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">
                                            {username ? username.charAt(0).toUpperCase() : 'A'}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{username || 'Admin'}</p>
                                        <p className="text-xs text-gray-400 truncate">Administrator</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );

    return (
        <>
            {!isMobile && desktopSidebar}
            {isMobile && mobileSidebar}
        </>
    );
};

export default AdminSidebar;