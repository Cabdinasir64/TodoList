"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center relative">
            <div className="text-2xl font-bold text-blue-600">
                <Link href="/">TaskTrek</Link>
            </div>

            <div className="hidden md:flex space-x-4">
                <Link
                    href="/signin"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Sign In
                </Link>
                <Link
                    href="/signup"
                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                >
                    Sign Up
                </Link>
            </div>

            <div className="md:hidden">
                <button onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center py-4 md:hidden"
                    >
                        <Link
                            href="/signin"
                            className="px-4 py-2 w-3/4 text-center bg-blue-600 text-white rounded-lg mb-2 hover:bg-blue-700 transition"
                            onClick={() => setIsOpen(false)}
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/signup"
                            className="px-4 py-2 w-3/4 text-center border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                            onClick={() => setIsOpen(false)}
                        >
                            Sign Up
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
