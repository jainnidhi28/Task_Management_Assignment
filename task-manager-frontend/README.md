# Task Manager Frontend

A React-based frontend for the Task Manager application.

## Features

- Modern UI with dark theme
- User authentication
- Task management (CRUD operations)
- Responsive design
- Loading states and error handling

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will start at `http://localhost:3000`

## Project Structure

```
task-manager-frontend/
├── public/              # Static files
├── src/
│   ├── api/            # API services
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── App.js          # Main application
│   └── index.js        # Entry point
├── package.json        # Dependencies
└── README.md          # Documentation
```

## Components

### Pages
- `LoginPage`: User authentication
- `TaskPage`: Task management interface

### Components
- `Navbar`: Navigation bar with user info
- `AddTaskForm`: Form for adding/editing tasks
- `TaskList`: List of tasks with actions

## API Integration

The frontend communicates with the backend through the following endpoints:
- Login: `POST /login`
- Tasks: `GET /tasks`
- Add Task: `POST /tasks`
- Update Task: `PUT /tasks/{id}`
- Delete Task: `DELETE /tasks/{id}`
- Complete Task: `POST /tasks/{id}/complete` 