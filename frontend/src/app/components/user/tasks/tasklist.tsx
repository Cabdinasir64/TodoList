'use client';
import { useState, useEffect, FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation'
import api from '../../../util/api';
import TaskListUI from './TaskListUI';

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

interface TasksResponse {
    tasks: Task[];
    pagination: PaginationInfo;
}

const TaskList = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [pagination, setPagination] = useState<PaginationInfo>({
        currentPage: 1,
        totalPages: 1,
        totalTasks: 0,
        hasNext: false,
        hasPrev: false,
        limit: 10
    });

    const router = useRouter();

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError('');

            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: itemsPerPage.toString(),
                ...(searchInput && { search: searchInput }),
                ...(statusFilter && { status: statusFilter })
            });

            const response = await api.get<TasksResponse>(`/api/tasks?${params}`);
            setTasks(response.data.tasks);
            setPagination(response.data.pagination);
        } catch (err: unknown) {
            const errorMessage = (err as any).response.data.message || 'Failed to load tasks';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchTasks();
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [currentPage, itemsPerPage, searchInput, statusFilter]);

    const handleDelete = async (taskId: string) => {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            setDeletingId(taskId);
            await api.delete(`/api/tasks/${taskId}`);

            await fetchTasks();
            toast.success('Task deleted successfully! 🗑️');

        } catch (err: unknown) {
            const errorMessage = (err as any).response.data.message || 'Failed to delete task';
            toast.error(errorMessage);
        } finally {
            setDeletingId(null);
        }
    };

    const handleEdit = (taskId: string) => {
        router.push(`/user/tasks/new?edit=${taskId}`);
    };

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);

        if (searchInput) {
            toast.success(`Searching for: "${searchInput}"`);
        }
    };

    const handleFilter = (status: string) => {
        setStatusFilter(status);
        setCurrentPage(1);

        if (status) {
            toast.success(`Filtered by: ${status}`);
        }
    };

    const handleClearFilters = () => {
        setSearchInput('');
        setStatusFilter('');
        setCurrentPage(1);
        toast.success('Filters cleared ✅');
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleItemsPerPageChange = (limit: number) => {
        setItemsPerPage(limit);
        setCurrentPage(1);
        toast.success(`Showing ${limit} tasks per page`);
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (pagination.totalPages <= maxVisiblePages) {
            for (let i = 1; i <= pagination.totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(pagination.totalPages);
            } else if (currentPage >= pagination.totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = pagination.totalPages - 3; i <= pagination.totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(pagination.totalPages);
            }
        }

        return pages;
    };

    return (
        <TaskListUI
            tasks={tasks}
            loading={loading}
            error={error}
            pagination={pagination}
            searchInput={searchInput}
            statusFilter={statusFilter}
            deletingId={deletingId}

            onSearch={handleSearch}
            onSearchInputChange={setSearchInput}
            onFilterChange={handleFilter}
            onClearFilters={handleClearFilters}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            onDelete={handleDelete}
            onEdit={handleEdit}

            getPageNumbers={getPageNumbers}
        />
    );
};

export default TaskList;