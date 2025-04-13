import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, addTask, completeTask, deleteTask, updateTask } from '../api/taskApi';
import TaskList from '../components/TaskList';
import AddTaskForm from '../components/AddTaskForm';
import Navbar from '../components/Navbar';

function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/login');
      return;
    }
    fetchTasks();
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const username = localStorage.getItem('username');
      const response = await getTasks(username);
      if (response.success) {
        setTasks(response.tasks);
      } else {
        setError(response.error || 'Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (title) => {
    try {
      setError(null);
      const username = localStorage.getItem('username');
      if (!title || !username) {
        setError('Title and username are required');
        return;
      }
      const response = await addTask(title, username);
      if (response.success) {
        await fetchTasks();
      } else {
        setError(response.error || 'Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task');
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      setError(null);
      const response = await completeTask(taskId);
      if (response.success) {
        await fetchTasks(); // Refresh the task list
      } else {
        setError(response.error || 'Failed to update task status');
      }
    } catch (error) {
      console.error('Error completing task:', error);
      setError('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    try {
      setError(null);
      const response = await deleteTask(taskId);
      if (response.success) {
        await fetchTasks(); // Refresh the task list
      } else {
        setError(response.error || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setError(null);
  };

  const handleUpdateTask = async (title) => {
    try {
      setError(null);
      if (!title) {
        setError('Title is required');
        return;
      }
      if (!editingTask) {
        setError('No task selected for editing');
        return;
      }
      
      const response = await updateTask(
        editingTask.id,
        title.trim(),
        editingTask.completed
      );
      
      if (response.success) {
        setEditingTask(null);
        await fetchTasks(); // Refresh the task list
      } else {
        setError(response.error || 'Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f6fa'
    }}>
      <Navbar username={localStorage.getItem('username')} onLogout={handleLogout} />
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        <AddTaskForm
          onSubmit={editingTask ? handleUpdateTask : handleAddTask}
          initialValue={editingTask?.title}
          isEditing={!!editingTask}
          onCancel={() => setEditingTask(null)}
        />
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
        ) : (
          <TaskList
            tasks={tasks}
            onComplete={handleCompleteTask}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
          />
        )}
      </div>
    </div>
  );
}

export default TaskPage;