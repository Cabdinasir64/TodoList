'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'

interface User {
    _id: string
    username: string
    email: string
    avatar?: string
}

export default function UserProfile() {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchUserData()
    }, [])

    const fetchUserData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include"
            })

            if (response.ok) {
                const userData = await response.json()
                setUser(userData.user)
            } else {
                toast.error('Failed to load user data')
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Failed to load user data: ${error}`)
            } else {
                toast.error(`Failed to load user data`)
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleEditClick = () => {
        toast('Edit profile feature coming soon!', {
            icon: '📝',
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#F59E0B',
                color: 'white',
                borderRadius: '10px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '500',
            },
        })
    }

    const handleImageClick = () => {
        toast('Profile image upload feature coming soon!', {
            icon: '📸',
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#8B5CF6',
                color: 'white',
                borderRadius: '10px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '500',
            },
        })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
                />
            </div>
        )
    }

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: 'green',
                            secondary: 'black',
                        },
                    },
                }}
            />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 px-2 sm:py-8 sm:px-4">
                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden mx-2 sm:mx-0"
                    >
                        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 sm:p-6 text-white">
                            <motion.h1
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl sm:text-2xl font-bold text-center sm:text-left"
                            >
                                User Profile
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-purple-100 text-sm sm:text-base text-center sm:text-left mt-1"
                            >
                                View your account information
                            </motion.p>
                        </div>

                        <div className="p-4 sm:p-6">
                            <div className="flex flex-col items-center mb-6 sm:mb-8">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative cursor-pointer"
                                    onClick={handleImageClick}
                                >
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-r from-blue-400 to-blue-400 flex items-center justify-center text-white text-xl sm:text-2xl font-bold mb-3 sm:mb-4 overflow-hidden border-4 border-white shadow-lg">
                                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-white rounded-full p-1 sm:p-2 shadow-lg"
                                    >
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </motion.div>
                                </motion.div>
                                <p className="text-xs sm:text-sm text-gray-500 text-center">
                                    Click on image to upload
                                </p>
                            </div>

                            <div className="space-y-4 sm:space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Username
                                    </label>
                                    <motion.input
                                        type="text"
                                        value={user?.username || ''}
                                        disabled
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed text-sm sm:text-base"
                                        placeholder="Username"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <motion.input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed text-sm sm:text-base"
                                        placeholder="Email address"
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleEditClick}
                                        className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow text-sm sm:text-base"
                                    >
                                        Edit Profile
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    )
}