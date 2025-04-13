import React from 'react';
import { FaCheck, FaEdit, FaTrash, FaUndo } from 'react-icons/fa';

function TaskList({ tasks, onComplete, onDelete, onEdit }) {
  return (
    <div style={{
      marginTop: '2rem',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse'
      }}>
        <thead>
          <tr style={{
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #dee2e6'
          }}>
            <th style={{ padding: '1rem', textAlign: 'left' }}>Task</th>
            <th style={{ padding: '1rem', textAlign: 'center', width: '150px' }}>Status</th>
            <th style={{ padding: '1rem', textAlign: 'center', width: '150px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id} style={{
              borderBottom: '1px solid #dee2e6',
              backgroundColor: task.completed ? '#f8f9fa' : 'white'
            }}>
              <td style={{ 
                padding: '1rem',
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? '#6c757d' : '#212529'
              }}>
                {task.title}
              </td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>
                {task.completed ? (
                  <span style={{
                    color: '#28a745',
                    fontWeight: 'bold'
                  }}>Completed</span>
                ) : (
                  <span style={{
                    color: '#6c757d'
                  }}>Pending</span>
                )}
              </td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>
                <button
                  onClick={() => onComplete(task.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: task.completed ? '#6c757d' : '#28a745',
                    cursor: 'pointer',
                    marginRight: '0.5rem'
                  }}
                  title={task.completed ? "Mark as Pending" : "Mark as Completed"}
                >
                  {task.completed ? <FaUndo /> : <FaCheck />}
                </button>
                <button
                  onClick={() => onEdit(task)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#007bff',
                    cursor: 'pointer',
                    marginRight: '0.5rem'
                  }}
                  title="Edit Task"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc3545',
                    cursor: 'pointer'
                  }}
                  title="Delete Task"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
          {tasks.length === 0 && (
            <tr>
              <td colSpan="3" style={{ padding: '1rem', textAlign: 'center' }}>
                No tasks found. Add a new task to get started!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;