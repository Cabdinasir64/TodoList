import { Suspense } from 'react';
import { Metadata } from 'next';
import TaskForm from '../../../components/user/tasks/new/TaskForm';

interface PageProps {
    searchParams: Promise<{ edit?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const params = await searchParams;
    const editTaskId = params.edit || null;

    return {
        title: editTaskId ? 'Edit Task - TaskTrek' : 'Create Task - TaskTrek',
        description: editTaskId
            ? 'Edit your existing task details'
            : 'Create a new task to organize your work',
    };
}

const NewTaskPage = async ({ searchParams }: PageProps) => {
    const params = await searchParams;
    const editTaskId = params.edit || null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <Suspense fallback={
                    <div className="bg-white rounded-2xl shadow-xl border border-white/20 p-8">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 text-lg">Loading Task Form...</p>
                        </div>
                    </div>
                }>
                    <TaskForm editTaskId={editTaskId} />
                </Suspense>
            </div>
        </div>
    );
};

export default NewTaskPage;
