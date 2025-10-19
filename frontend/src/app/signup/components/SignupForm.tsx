"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "./signupService";
import { validateUser, UserInput } from "./userValidation";
import { toast, Toaster } from "react-hot-toast";

export default function SignupForm() {
    const [formData, setFormData] = useState<UserInput>({
        username: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const mutation = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            toast.success("✅ Account created successfully!");
            setFormData({ username: "", email: "", password: "" });
            setErrors({});
            setTouched({});
        },
        onError: (error: any) => {
            toast.error(error.message || "❌ Something went wrong!");
        },
    });

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
            toast.error("Please fix validation errors");
            return;
        }

        mutation.mutate(formData);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 px-4">
            <Toaster position="top-right" />
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-white shadow-xl rounded-2xl p-10 md:p-12"
            >
                <h2 className="text-4xl font-extrabold text-center text-blue-600 mb-8">
                    Create Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {["username", "email", "password"].map((field) => (
                        <div key={field}>
                            <label className="block text-gray-700 capitalize mb-1 font-semibold">
                                {field}
                            </label>
                            <input
                                name={field}
                                type={field === "password" ? "password" : "text"}
                                value={formData[field as keyof UserInput]}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder={`Enter your ${field}`}
                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all text-gray-800 bg-gray-50 ${errors[field] && touched[field]
                                    ? "border-red-500 focus:ring-red-300"
                                    : "border-gray-300 focus:ring-blue-400"
                                    }`}
                            />
                            {errors[field] && touched[field] && (
                                <motion.p
                                    className="text-sm text-red-500 mt-1"
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {errors[field]}
                                </motion.p>
                            )}
                        </div>
                    ))}

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md"
                    >
                        {mutation.isPending ? "Creating..." : "Sign Up"}
                    </motion.button>
                </form>

                <p className="text-center text-gray-600 text-sm mt-6">
                    Already have an account?{" "}
                    <a
                        href="/signin"
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Sign In
                    </a>
                </p>
            </motion.div>
        </div>
    );
}
