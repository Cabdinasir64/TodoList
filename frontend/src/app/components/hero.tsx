"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const HeroSection = () => {
    return (
        <section className="bg-blue-50 min-h-screen flex flex-col justify-center items-center text-center px-6 md:px-20">
            <motion.h1
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-6xl font-bold text-blue-600 mb-6"
            >
                Take Control of Your Tasks
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-lg md:text-2xl text-gray-700 mb-8 max-w-2xl"
            >
                TaskTrek helps you organize, prioritize, and complete your daily tasks efficiently. Never miss a thing!
            </motion.p>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="flex flex-col md:flex-row gap-4"
            >
                <Link
                    href="/signup"
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                    Get Started
                </Link>
                <Link
                    href="/learn-more"
                    className="px-6 py-3 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
                >
                    Learn More
                </Link>
            </motion.div>
        </section>
    );
};

export default HeroSection;
