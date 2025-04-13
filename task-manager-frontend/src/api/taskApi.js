// Create the file: task-manager-frontend/src/api/taskApi.js
import axios from 'axios';

// Use localhost for development
const BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log('Request:', config.method.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.status, error.response.data);
      return Promise.reject({
        success: false,
        error: error.response.data?.detail || 'An error occurred'
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      return Promise.reject({
        success: false,
        error: 'No response from server. Please check your connection.'
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
      return Promise.reject({
        success: false,
        error: 'Error setting up request'
      });
    }
  }
);

export const login = async (username) => {
  try {
    const response = await api.post('/login', { username });
    return response.data;
  } catch (error) {
    return { success: false, error: 'Failed to login' };
  }
};

export const getTasks = async (username) => {
  try {
    const response = await api.get(`/tasks/${username}`);
    // Make sure we're returning an array of tasks
    const tasks = Array.isArray(response.data.tasks) ? response.data.tasks : [];
    return { success: true, tasks };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return { success: false, error: 'Failed to fetch tasks', tasks: [] };
  }
};

export const addTask = async (title, username) => {
  try {
    const response = await api.post('/tasks', { title, username });
    return { success: true, task: response.data };
  } catch (error) {
    return { success: false, error: 'Failed to add task' };
  }
};

export const updateTask = async (taskId, title, completed) => {
  try {
    const username = localStorage.getItem('username');
    const response = await api.put(`/tasks/${taskId}`, {
      id: taskId,
      title,
      completed: completed || false,
      username
    });
    if (response.data.success) {
      return { success: true, task: response.data.task };
    }
    return { success: false, error: response.data.detail || 'Failed to update task' };
  } catch (error) {
    console.error('Error updating task:', error);
    return { success: false, error: error.response?.data?.detail || 'Failed to update task' };
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`/tasks/${taskId}`);
    if (response.data.success) {
      return { success: true, message: response.data.message };
    }
    return { success: false, error: response.data.detail || 'Failed to delete task' };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { success: false, error: error.response?.data?.detail || 'Failed to delete task' };
  }
};

export const completeTask = async (taskId) => {
  try {
    const response = await api.put(`/tasks/complete/${taskId}`);
    if (response.data.success) {
      return { success: true, task: response.data.task };
    }
    return { success: false, error: response.data.detail || 'Failed to complete task' };
  } catch (error) {
    console.error('Error completing task:', error);
    return { success: false, error: error.response?.data?.detail || 'Failed to complete task' };
  }
};