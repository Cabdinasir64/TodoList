"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast, Toaster } from "react-hot-toast";
import { loginUser, SigninInput } from "./signinService";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";

export default function SigninForm() {
    const router = useRouter();
    const [formData, setFormData] = useState<SigninInput>({ email: "", password: "" });
    const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    const mutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            toast.success(data.message || "🎉 Login successful!");
            router.push(data.redirect);
        },
        onError: (error: any) => {
            toast.error(error.message || "❌ Invalid credentials");
        },
    });

    useEffect(() => {
        setIsFormValid(!!formData.email && !!formData.password);
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setTouched({ ...touched, [e.target.name]: true });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error("Please fill in all fields");
            setTouched({ email: true, password: true });
            return;
        }
        mutation.mutate(formData);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 px-4">
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                }}
            />
            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 md:p-10 border border-white/50"
            >
                <div className="text-center mb-10">
                    <motion.h2
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2"
                    >
                        Welcome Back
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600"
                    >
                        Sign in to your account
                    </motion.p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-6">
                        <div className="relative">
                            <label className="block text-gray-700 capitalize mb-2 font-medium text-sm">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiMail className="text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter your email"
                                    className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl focus:ring-2 transition-all text-gray-800 bg-white/70 backdrop-blur-sm
                                        ${!formData.email && touched.email
                                            ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                                            : "border-gray-200 focus:ring-blue-200 focus:border-blue-400"
                                        }`}
                                />
                            </div>
                            <AnimatePresence>
                                {!formData.email && touched.email && (
                                    <motion.p
                                        className="text-sm text-red-500 mt-2 flex items-center"
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                    >
                                        <span className="mr-1">•</span> Email is required
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="relative">
                            <label className="block text-gray-700 capitalize mb-2 font-medium text-sm">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLock className="text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter your password"
                                    className={`w-full pl-4 pr-12 py-3 border-2 rounded-xl focus:ring-2 transition-all text-gray-800 bg-white/70 backdrop-blur-sm
                                        ${!formData.password && touched.password
                                            ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                                            : "border-gray-200 focus:ring-blue-200 focus:border-blue-400"
                                        }`}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <FiEyeOff className="text-gray-400 hover:text-gray-600 transition-colors" />
                                    ) : (
                                        <FiEye className="text-gray-400 hover:text-gray-600 transition-colors" />
                                    )}
                                </button>
                            </div>
                            <AnimatePresence>
                                {!formData.password && touched.password && (
                                    <motion.p
                                        className="text-sm text-red-500 mt-2 flex items-center"
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                    >
                                        <span className="mr-1">•</span> Password is required
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    <div className="text-right">
                        <a
                            href="/forgot-password"
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors hover:underline"
                        >
                            Forgot your password?
                        </a>
                    </div>

                    <motion.button
                        whileHover={{
                            scale: isFormValid ? 1.02 : 1,
                            boxShadow: isFormValid ? "0 10px 25px -5px rgba(59, 130, 246, 0.4)" : "none"
                        }}
                        whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                        type="submit"
                        disabled={mutation.isPending || !isFormValid}
                        className={`w-full py-4 text-white text-lg font-semibold rounded-xl transition-all shadow-md flex items-center justify-center
                            ${mutation.isPending || !isFormValid
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                            }`}
                    >
                        {mutation.isPending ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                />
                                Signing in...
                            </>
                        ) : (
                            <>
                                <FiLogIn className="mr-2" />
                                Sign In
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-center text-gray-600 text-sm">
                        Don't have an account?{" "}
                        <a
                            href="/signup"
                            className="text-blue-600 font-medium hover:text-blue-800 transition-colors hover:underline"
                        >
                            Sign Up
                        </a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}