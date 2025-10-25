'use client';
import { FormEvent } from 'react';

interface TaskFormData {
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
}

interface TaskFormUIProps {
    formData: TaskFormData;
    loading: boolean;
    submitting: boolean;
    error: string;
    isEdit: boolean;

    onInputChange: (field: keyof TaskFormData, value: string) => void;
    onSubmit: (e: FormEvent) => void;
    onCancel: () => void;
}

const TaskFormUI: React.FC<TaskFormUIProps> = ({
    formData,
    loading,
    submitting,
    error,
    isEdit,
    onInputChange,
    onSubmit,
    onCancel
}) => {
    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-xl border border-white/20 p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading task data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {isEdit ? '✏️ Edit Task' : '➕ Create New Task'}
                </h1>
                <p className="text-gray-600">
                    {isEdit
                        ? 'Update your task details below'
                        : 'Fill in the details to create a new task'
                    }
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Task Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={formData.title}
                        onChange={(e) => onInputChange('title', e.target.value)}
                        placeholder="Enter task title..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        required
                        disabled={submitting}
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => onInputChange('description', e.target.value)}
                        placeholder="Enter task description (optional)..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                        disabled={submitting}
                    />
                </div>

                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>
                    <select
                        id="status"
                        value={formData.status}
                        onChange={(e) => onInputChange('status', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        disabled={submitting}
                    >
                        <option value="pending">⏳ Pending</option>
                        <option value="in-progress">🔄 In Progress</option>
                        <option value="completed">✅ Completed</option>
                    </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={submitting}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting || !formData.title.trim()}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                {isEdit ? 'Updating...' : 'Creating...'}
                            </div>
                        ) : (
                            isEdit ? 'Update Task' : 'Create Task'
                        )}
                    </button>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-500">
                        * Required field
                    </p>
                </div>
            </form>
        </div>
    );
};

export default TaskFormUI;