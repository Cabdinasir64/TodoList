'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '../../../../util/api';
import TaskFormUI from './TaskFormUI';

interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
}

interface TaskFormData {
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
}

interface TaskFormProps {
    editTaskId?: string | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ editTaskId }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<TaskFormData>({
        title: '',
        description: '',
        status: 'pending'
    });

    const fetchTaskData = useCallback(async () => {
        if (!editTaskId) return;

        try {
            setLoading(true);
            setError('');

            const response = await api.get<Task>(`/api/tasks/${editTaskId}`);
            const task = response.data;

            setFormData({
                title: task.title,
                description: task.description,
                status: task.status
            });

            toast.success('Task loaded for editing');
        } catch (err: unknown) {
            let errorMessage = 'Failed to load task';

            if (err instanceof Error) {
                errorMessage = err.message;
            } else if (typeof err === 'object' && err !== null && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string } } };
                errorMessage = axiosError.response?.data?.message || errorMessage;
            }

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [editTaskId]);

    useEffect(() => {
        if (editTaskId) {
            fetchTaskData();
        }
    }, [editTaskId, fetchTaskData]);

    const handleInputChange = (field: keyof TaskFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error('Title is required');
            return;
        }

        try {
            setSubmitting(true);
            setError('');

            if (editTaskId) {
                await api.put(`/api/tasks/${editTaskId}`, formData);
                toast.success('Task updated successfully! 🎉');
            } else {
                await api.post('/api/tasks', formData);
                toast.success('Task created successfully! 🎉');
            }

            setTimeout(() => {
                router.push('/user/tasks');
            }, 1500);

        } catch (err: unknown) {
            let errorMessage = editTaskId ? 'Failed to update task' : 'Failed to create task';

            if (err instanceof Error) {
                errorMessage = err.message;
            } else if (typeof err === 'object' && err !== null && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string } } };
                errorMessage = axiosError.response?.data?.message || errorMessage;
            }

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.push('/user/tasks');
    };

    return (
        <TaskFormUI
            formData={formData}
            loading={loading}
            submitting={submitting}
            error={error}
            isEdit={!!editTaskId}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    );
};

export default TaskForm;
