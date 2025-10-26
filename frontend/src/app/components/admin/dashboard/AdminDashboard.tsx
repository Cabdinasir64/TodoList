"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Users, UserCheck, UserPlus, Shield, Mail, Calendar, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import UserChart from "./UserChart";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

interface DashboardData {
  stats: {
    totalUsers: number;
    activeUsers: number;
    newUsersToday: number;
    adminUsers: number;
  };
  recentUsers: User[];
  chartData: { name: string; users: number }[];
}

interface AdminDashboardProps {
  initialData: DashboardData;
}

const AdminDashboard = ({ initialData }: AdminDashboardProps) => {
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    setApiUrl(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");
  }, []);

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: async (): Promise<DashboardData> => {
      if (!apiUrl) {
        return initialData;
      }

      const response = await fetch(`${apiUrl}/api/users/admin/dashboard`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      return response.json();
    },
    initialData,
    refetchInterval: 30000,
    enabled: !!apiUrl,
  });

  const statsCards = [
    {
      title: "Total Users",
      value: dashboardData.stats.totalUsers,
      icon: Users,
      color: "bg-blue-500",
      description: "All registered users",
    },
    {
      title: "Active Users",
      value: dashboardData.stats.activeUsers,
      icon: UserCheck,
      color: "bg-green-500",
      description: "Active in last 30 days",
    },
    {
      title: "New Today",
      value: dashboardData.stats.newUsersToday,
      icon: UserPlus,
      color: "bg-purple-500",
      description: "New registrations today",
    },
    {
      title: "Admin Users",
      value: dashboardData.stats.adminUsers,
      icon: Shield,
      color: "bg-red-500",
      description: "Administrator accounts",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const formatDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(dateString));
    } catch {
      return "N/A";
    }
  };

  const calculateGrowth = () => {
    if (!dashboardData?.chartData || dashboardData.chartData.length < 2) return "+0%";
    
    const firstMonth = dashboardData.chartData[0].users;
    const lastMonth = dashboardData.chartData[dashboardData.chartData.length - 1].users;
    
    if (firstMonth === 0) return "+0%";
    
    const growth = ((lastMonth - firstMonth) / firstMonth) * 100;
    return `${growth >= 0 ? '+' : ''}${Math.round(growth)}%`;
  };

  const growthPercentage = calculateGrowth();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="text-red-600 font-medium mb-2">
          Error loading dashboard
        </div>
        <div className="text-red-500 text-sm">Please try refreshing the page</div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statsCards.map((stat) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stat.value.toLocaleString()}
                </h3>
                <p className="text-gray-600 font-medium">{stat.title}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                User Growth
              </h2>
              <p className="text-gray-600 text-sm mt-1">Last 6 months</p>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">{growthPercentage} growth</span>
            </div>
          </div>

          <UserChart initialChartData={dashboardData.chartData} />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Recent Users
          </h2>

          {dashboardData.recentUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData.recentUsers.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.username}
                      </p>
                      <div className="flex items-center space-x-1 text-gray-500 text-sm">
                        <Mail className="h-3 w-3" />
                        <span className="max-w-[150px] truncate">{user.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {user.role}
                    </span>
                    <div className="flex items-center space-x-1 text-gray-500 text-xs mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;