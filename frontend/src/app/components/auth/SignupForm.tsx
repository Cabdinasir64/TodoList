"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "../../util/signupService";
import { validateUser, UserInput } from "../../util/userValidation";
import { toast, Toaster } from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck } from "react-icons/fi";
import Link from "next/link";

export default function SignupForm() {
    const [formData, setFormData] = useState<UserInput>({
        username: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    const mutation = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            toast.success("🎉 Account created successfully!");
            setFormData({ username: "", email: "", password: "" });
            setErrors({});
            setTouched({});
        },
        onError: (error: any) => {
            toast.error(error.message || "❌ Something went wrong!");
        },
    });

    useEffect(() => {
        const validationErrors = validateUser(formData);
        setIsFormValid(Object.keys(validationErrors).length === 0);
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updated = { ...formData, [name]: value };
        setFormData(updated);

        const validationErrors = validateUser(updated);
        setErrors(validationErrors);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateUser(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setTouched({
                username: true,
                email: true,
                password: true,
            });
            toast.error("Please fix validation errors");
            return;
        }

        mutation.mutate(formData);
    };

    const getInputIcon = (field: string) => {
        switch (field) {
            case "username":
                return <FiUser className="text-gray-400" />;
            case "email":
                return <FiMail className="text-gray-400" />;
            case "password":
                return <FiLock className="text-gray-400" />;
            default:
                return null;
        }
    };

    return (
        <div>
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
                className="w-full max-w-md min-h-[500px] bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 md:p-10 border border-white/50"
            >
                <div className="text-center mb-10">
                    <motion.h2
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent mb-2"
                    >
                        Join Us Today
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600"
                    >
                        Create your account and get started
                    </motion.p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {["username", "email", "password"].map((field) => (
                        <div key={field} className="relative">
                            <label className="block text-gray-700 capitalize mb-2 font-medium text-sm">
                                {field}
                            </label>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    {getInputIcon(field)}
                                </div>

                                <input
                                    name={field}
                                    type={field === "password" ? (showPassword ? "text" : "password") : "text"}
                                    value={formData[field as keyof UserInput]}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder={`Enter your ${field}`}
                                    className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl focus:ring-2 transition-all text-gray-800 bg-white/70 backdrop-blur-sm
                                        ${errors[field] && touched[field]
                                            ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                                            : "border-gray-200 focus:ring-purple-200 focus:border-purple-400"
                                        }`}
                                />

                                {field === "password" && (
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <FiEyeOff className="text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <FiEye className="text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                )}
                            </div>

                            <AnimatePresence>
                                {errors[field] && touched[field] && (
                                    <motion.p
                                        className="text-sm text-red-500 mt-2 flex items-center"
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                    >
                                        <span className="mr-1">•</span> {errors[field]}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}

                    <motion.button
                        whileHover={{
                            scale: isFormValid ? 1.02 : 1,
                            boxShadow: isFormValid ? "0 10px 25px -5px rgba(139, 92, 246, 0.4)" : "none"
                        }}
                        whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                        type="submit"
                        disabled={mutation.isPending || !isFormValid}
                        className={`w-full py-4 text-white text-lg font-semibold rounded-xl transition-all shadow-md flex items-center justify-center
                            ${mutation.isPending || !isFormValid
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-300 to-blue-500 hover:from-blue-500 hover:to-blue-300"
                            }`}
                    >
                        {mutation.isPending ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                />
                                Creating Account...
                            </>
                        ) : (
                            <>
                                <FiCheck className="mr-2" />
                                Sign Up
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-center text-gray-600 text-sm">
                        Already have an account?{" "}
                        <Link
                            href="/signin"
                            className="text-blue-600 font-medium hover:text-blue-800 transition-colors hover:underline"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}