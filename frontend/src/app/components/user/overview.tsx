"use client";

import { useQuery } from "@tanstack/react-query";
import {
    Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
    PieLabelRenderProps
} from 'recharts';
import api from '../../util/api'

interface Task {
    _id: string;
    title: string;
    description: string;
    status: "pending" | "in-progress" | "completed";
    createdAt: string;
    updatedAt: string;
}

interface TasksResponse {
    message: string;
    tasks: Task[];
}

interface StatusDataItem {
    name: string;
    value: number;
    percentage: string;
    color: string;
    [key: string]: unknown;
}

interface PayloadItem {
    payload: StatusDataItem;
    name: string;
    value: number;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: PayloadItem[];
}

const COLORS = {
    pending: '#F59E0B',
    'in-progress': '#3B82F6',
    completed: '#10B981'
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
                <p className="font-medium text-gray-900">{data.name}</p>
                <p className="text-sm text-gray-600">
                    {data.value} tasks ({data.percentage}%)
                </p>
            </div>
        );
    }
    return null;
};

const renderCustomizedLabel = (props: PieLabelRenderProps) => {
    const cx = props.cx as number;
    const cy = props.cy as number;
    const midAngle = props.midAngle as number;
    const innerRadius = props.innerRadius as number;
    const outerRadius = props.outerRadius as number;
    const percent = props.percent as number;

    if (percent === 0) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            fontSize={12}
            fontWeight="bold"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};


const Overview = () => {
    const { data: tasksData, isLoading, error } = useQuery({
        queryKey: ['tasks'],
        queryFn: async (): Promise<TasksResponse> => {
            const response = await api.get<TasksResponse>('/api/tasks');
            return response.data;
        },
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Calculate statistics from tasks
    const total = tasksData?.tasks?.length || 0;
    const pending = tasksData?.tasks?.filter(task => task.status === "pending").length || 0;
    const inProgress = tasksData?.tasks?.filter(task => task.status === "in-progress").length || 0;
    const completed = tasksData?.tasks?.filter(task => task.status === "completed").length || 0;

    if (isLoading) {
        return (
            <div className="animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-lg shadow p-6">
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-6 h-80">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 h-80">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-red-600 text-lg font-semibold mb-2">
                    Error loading tasks
                </div>
                <p className="text-red-500">Please try again later</p>
            </div>
        );
    }

    if (!tasksData || !tasksData.tasks || tasksData.tasks.length === 0) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <div className="text-yellow-600 text-lg font-semibold mb-2">
                    No tasks found
                </div>
                <p className="text-yellow-500">Create your first task to see statistics</p>
            </div>
        );
    }

    const totalTasks = total || 1;
    const statusData: StatusDataItem[] = [
        {
            name: 'Pending',
            value: pending,
            percentage: ((pending) / totalTasks * 100).toFixed(1),
            color: COLORS.pending
        },
        {
            name: 'In Progress',
            value: inProgress,
            percentage: ((inProgress) / totalTasks * 100).toFixed(1),
            color: COLORS['in-progress']
        },
        {
            name: 'Completed',
            value: completed,
            percentage: ((completed) / totalTasks * 100).toFixed(1),
            color: COLORS.completed
        }
    ];

    const recentTasks = tasksData.tasks.slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                            <p className="text-3xl font-bold text-gray-900">{total}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <span className="text-blue-600 text-xl">📋</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pending</p>
                            <p className="text-3xl font-bold text-gray-900">{pending}</p>
                            <p className="text-xs text-amber-600 mt-1">
                                {((pending) / totalTasks * 100).toFixed(1)}%
                            </p>
                        </div>
                        <div className="p-3 bg-amber-100 rounded-full">
                            <span className="text-amber-600 text-xl">⏳</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">In Progress</p>
                            <p className="text-3xl font-bold text-gray-900">{inProgress}</p>
                            <p className="text-xs text-blue-600 mt-1">
                                {((inProgress) / totalTasks * 100).toFixed(1)}%
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <span className="text-blue-600 text-xl">🚀</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Completed</p>
                            <p className="text-3xl font-bold text-gray-900">{completed}</p>
                            <p className="text-xs text-green-600 mt-1">
                                {((completed) / totalTasks * 100).toFixed(1)}%
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <span className="text-green-600 text-xl">✅</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Distribution Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Status Distribution</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Tasks Overview */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks Summary</h3>
                    <div className="h-64 flex flex-col justify-center">
                        <div className="space-y-4">
                            {statusData.map((status) => (
                                <div key={status.name} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: status.color }}
                                        ></div>
                                        <span className="text-sm font-medium text-gray-700">
                                            {status.name}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {status.value}
                                        </span>
                                        <span className="text-xs text-gray-500 ml-2">
                                            ({status.percentage}%)
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-900">Total</span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {total}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Tasks */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
                </div>
                <div className="p-6">
                    {recentTasks.length > 0 ? (
                        <div className="space-y-4">
                            {recentTasks.map((task) => (
                                <div key={task._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-3 h-3 rounded-full ${task.status === 'completed' ? 'bg-green-500' :
                                            task.status === 'in-progress' ? 'bg-blue-500' : 'bg-amber-500'
                                            }`}></div>
                                        <div>
                                            <p className="font-medium text-gray-900">{task.title}</p>
                                            <p className="text-sm text-gray-500">
                                                Created: {new Date(task.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                'bg-amber-100 text-amber-800'
                                            }`}>
                                            {task.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No tasks found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Overview;