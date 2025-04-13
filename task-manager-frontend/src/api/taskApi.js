// Create the file: task-manager-frontend/src/api/taskApi.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000'
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
  const response = await api.post('/login', { username });
  return response.data;
};

export const getTasks = async (username) => {
  const response = await api.get(`/tasks/${username}`);
  return response.data;
};

export const addTask = async (title, username) => {
  if (!title || !username) {
    throw new Error('Title and username are required');
  }
  const response = await api.post('/tasks', { 
    title: title.trim(),
    username 
  });
  return response.data;
};

export const completeTask = async (taskId) => {
  const response = await api.put(`/tasks/complete/${taskId}`);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};

export const updateTask = async (taskId, title, completed, username) => {
  if (!title || !username) {
    throw new Error('Title and username are required');
  }
  const response = await api.put(`/tasks/${taskId}`, { 
    title: title.trim(),
    completed,
    username
  });
  return response.data;
};