"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 text-center">
            <motion.h1
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-6xl md:text-8xl font-bold text-blue-600 mb-4"
            >
                404
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-lg md:text-2xl text-gray-700 mb-8"
            >
                Oops! The page you are looking for does not exist.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
            >
                <Link
                    href="/"
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                    Go Back Home
                </Link>
            </motion.div>
        </div>
    );
};

export default NotFound;
