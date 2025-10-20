"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
    name: string;
    href: string;
    icon: string;
}

const navItems: NavItem[] = [
    { name: "Dashboard", href: "/user/dashboard", icon: "📊" },
    { name: "Tasks", href: "/user/task", icon: "✅" },
    { name: "Profile", href: "/user/profile", icon: "👤" },
];

const UserSidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const pathname = usePathname();

    return (
        <motion.div
            initial={{ width: 256 }}
            animate={{ width: isOpen ? 256 : 80 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-gradient-to-b from-gray-800 to-gray-900 text-white h-screen p-4 flex flex-col relative shadow-xl"
        >
            {/* Toggle button */}
            <div className={`flex items-center ${isOpen ? "justify-between" : "justify-center"} mb-8`}>
                <AnimatePresence>
                    {isOpen && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                        >
                            Logo
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

            {/* Navigation links */}
            <nav className="flex flex-col gap-2 flex-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link key={item.name} href={item.href}>
                            <motion.div
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className={`
                  flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                  ${isActive
                                        ? "bg-blue-500 shadow-lg shadow-blue-500/25"
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

                                {/* Active indicator dot for collapsed state */}
                                {!isOpen && isActive && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute right-2 w-2 h-2 bg-blue-300 rounded-full"
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* User info at bottom (optional) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="mt-auto p-3 bg-gray-700/30 rounded-xl border border-gray-600"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">U</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">Username</p>
                                <p className="text-xs text-gray-400 truncate">Free Plan</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default UserSidebar;