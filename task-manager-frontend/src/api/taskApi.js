// Create the file: task-manager-frontend/src/api/taskApi.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL
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
    console.error('Response error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const login = async (username) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Failed to login' };
  }
};

export const getTasks = async (username) => {
  try {
    const response = await fetch(`${BASE_URL}/tasks/${username}`);
    const tasks = await response.json();
    return { success: true, tasks };
  } catch (error) {
    return { success: false, error: 'Failed to fetch tasks' };
  }
};

export const addTask = async (title, username) => {
  try {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, username }),
    });
    const result = await response.json();
    return { success: true, task: result };
  } catch (error) {
    return { success: false, error: 'Failed to add task' };
  }
};

export const updateTask = async (taskId, title, completed) => {
  try {
    const username = localStorage.getItem('username');
    const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: taskId,
        title: title,
        completed: completed || false,
        username: username
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.detail || 'Failed to update task' };
    }
    const result = await response.json();
    return { success: true, task: result };
  } catch (error) {
    return { success: false, error: 'Failed to update task' };
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
    });
    await response.json();
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete task' };
  }
};

export const completeTask = async (taskId) => {
  try {
    const response = await fetch(`${BASE_URL}/tasks/complete/${taskId}`, {
      method: 'PUT',
    });
    const result = await response.json();
    return { success: true, task: result };
  } catch (error) {
    return { success: false, error: 'Failed to complete task' };
  }
};