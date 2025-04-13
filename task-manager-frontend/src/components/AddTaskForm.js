import React, { useState, useEffect } from 'react';
import { FaPlus, FaSave, FaTimes } from 'react-icons/fa';

function AddTaskForm({ onSubmit, initialValue = '', isEditing = false, onCancel }) {
  const [title, setTitle] = useState(initialValue);
  const [error, setError] = useState('');

  useEffect(() => {
    setTitle(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    if (title.length < 3) {
      setError('Task title must be at least 3 characters long');
      return;
    }
    if (title.length > 100) {
      setError('Task title must be less than 100 characters');
      return;
    }
    onSubmit(title);
    setTitle('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-start'
      }}>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError('');
          }}
          placeholder="Enter task title"
          style={{
            flex: 1,
            padding: '0.75rem',
            borderRadius: '4px',
            border: error ? '2px solid #dc3545' : '1px solid #dee2e6',
            fontSize: '1rem'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {isEditing ? <FaSave /> : <FaPlus />}
          {isEditing ? 'Save' : 'Add Task'}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaTimes />
            Cancel
          </button>
        )}
      </div>
      {error && (
        <div style={{
          color: '#dc3545',
          fontSize: '0.875rem',
          marginTop: '0.5rem'
        }}>
          {error}
        </div>
      )}
    </form>
  );
}

export default AddTaskForm;