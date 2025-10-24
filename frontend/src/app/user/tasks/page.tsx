import TaskList from '../../components/user/tasks/tasklist';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Tasks | TaskTrek',
  description: 'Explore all tasks on TaskTrek. Filter, search, and manage your tasks efficiently.',
  keywords: ['TaskTrek', 'tasks', 'project management', 'to-do', 'task list'],
};

export default function UserTasksPage() {
  return <TaskList />;
}
