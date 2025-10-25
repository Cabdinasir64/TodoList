'use client';
import { FormEvent } from 'react';
import { Toaster } from 'react-hot-toast';

interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    user: string;
    createdAt: string;
}

interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalTasks: number;
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
}

interface TaskListUIProps {
    tasks: Task[];
    loading: boolean;
    error: string;
    pagination: PaginationInfo;
    searchInput: string;
    statusFilter: string;
    deletingId: string | null;

    onSearch: (e: FormEvent) => void;
    onSearchInputChange: (value: string) => void;
    onFilterChange: (status: string) => void;
    onClearFilters: () => void;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (limit: number) => void;
    onDelete: (taskId: string) => void;
    onEdit: (taskId: string) => void;

    getPageNumbers: () => (number | string)[];
}

const TaskListUI: React.FC<TaskListUIProps> = ({
    tasks,
    loading,
    error,
    pagination,
    searchInput,
    statusFilter,
    deletingId,
    onSearch,
    onSearchInputChange,
    onFilterChange,
    onClearFilters,
    onPageChange,
    onItemsPerPageChange,
    onDelete,
    onEdit,
    getPageNumbers
}) => {
    if (loading) {
        return (
            <>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                    }}
                />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">Loading your tasks...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#10B981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 4000,
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />

            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-6xl mx-auto">

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Tasks</h1>
                        <p className="text-gray-600">Manage all your tasks in one place</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

                            <form onSubmit={onSearch} className="lg:col-span-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={searchInput}
                                        onChange={(e) => onSearchInputChange(e.target.value)}
                                        placeholder="Search tasks..."
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Search
                                    </button>
                                </div>
                            </form>

                            <select
                                value={statusFilter}
                                onChange={(e) => onFilterChange(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>

                            <select
                                value={pagination.limit}
                                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value={10}>10 per page</option>
                                <option value={20}>20 per page</option>
                                <option value={30}>30 per page</option>
                                <option value={40}>40 per page</option>
                                <option value={50}>50 per page</option>
                            </select>

                        </div>

                        <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-gray-600">
                                Showing {tasks.length} of {pagination.totalTasks} tasks
                            </div>
                            {(searchInput || statusFilter) && (
                                <button
                                    onClick={onClearFilters}
                                    className="text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded transition-colors"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4 mb-8">
                        {tasks.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">No tasks found</h3>
                                <p className="text-gray-500 mb-4">
                                    {searchInput || statusFilter
                                        ? "Try adjusting your search or filters."
                                        : "Get started by creating your first task!"}
                                </p>
                                {(searchInput || statusFilter) && (
                                    <button
                                        onClick={onClearFilters}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            tasks.map((task) => (
                                <div
                                    key={task._id}
                                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                {task.title}
                                            </h3>
                                            {task.description && (
                                                <p className="text-gray-600 mb-3">{task.description}</p>
                                            )}
                                            <div className="flex items-center gap-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${task.status === 'completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : task.status === 'in-progress'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {task.status}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(task.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onEdit(task._id)}
                                                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onDelete(task._id)}
                                                disabled={deletingId === task._id}
                                                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:bg-red-400 disabled:cursor-not-allowed"
                                            >
                                                {deletingId === task._id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {pagination.totalPages > 1 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="text-sm text-gray-600">
                                    Page {pagination.currentPage} of {pagination.totalPages}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onPageChange(pagination.currentPage - 1)}
                                        disabled={!pagination.hasPrev}
                                        className={`px-3 py-2 rounded border text-sm ${pagination.hasPrev
                                            ? 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                                            }`}
                                    >
                                        Previous
                                    </button>

                                    <div className="flex gap-1">
                                        {getPageNumbers().map((page, index) => (
                                            page === '...' ? (
                                                <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                                                    ...
                                                </span>
                                            ) : (
                                                <button
                                                    key={page}
                                                    onClick={() => onPageChange(page as number)}
                                                    className={`w-10 h-10 rounded border text-sm ${page === pagination.currentPage
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => onPageChange(pagination.currentPage + 1)}
                                        disabled={!pagination.hasNext}
                                        className={`px-3 py-2 rounded border text-sm ${pagination.hasNext
                                            ? 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                                            }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default TaskListUI;