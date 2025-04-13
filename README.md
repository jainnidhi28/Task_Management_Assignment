# Task Manager Application

A full-stack task management application built with React and FastAPI.

## Features

- User authentication with username
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Modern UI with dark theme
- Responsive design
- Real-time updates
- Error handling and loading states

## Tech Stack

### Frontend
- React (Hooks)
- React Router for navigation
- React Icons for UI elements
- Axios for API calls
- CSS-in-JS for styling

### Backend
- FastAPI (Python)
- JSON file-based storage
- CORS middleware for cross-origin requests

## Project Structure

```
task-manager/
├── task-manager-frontend/     # React frontend
│   ├── public/               # Static files
│   ├── src/
│   │   ├── api/             # API services
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── App.js           # Main application
│   │   └── index.js         # Entry point
│   ├── package.json         # Frontend dependencies
│   └── README.md            # Frontend documentation
│
└── task-manager-backend/     # FastAPI backend
    ├── main.py              # FastAPI application
    ├── requirements.txt     # Backend dependencies
    └── README.md           # Backend documentation
```

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
```bash
cd task-manager-backend
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the server:
```bash
uvicorn main:app --reload
```

The backend server will start at `http://localhost:8000`

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd task-manager-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend application will start at `http://localhost:3000`

## API Documentation

### Authentication
- `POST /login`
  - Request body: `{ "username": "string" }`
  - Response: `{ "success": boolean, "error": "string" }`

### Tasks
- `GET /tasks`
  - Response: `{ "success": boolean, "tasks": array, "error": "string" }`

- `POST /tasks`
  - Request body: `{ "title": "string", "username": "string" }`
  - Response: `{ "success": boolean, "error": "string" }`

- `PUT /tasks/{task_id}`
  - Request body: `{ "title": "string", "completed": boolean }`
  - Response: `{ "success": boolean, "error": "string" }`

- `DELETE /tasks/{task_id}`
  - Response: `{ "success": boolean, "error": "string" }`

- `POST /tasks/{task_id}/complete`
  - Response: `{ "success": boolean, "error": "string" }`

## Frontend Components

### Pages
- `LoginPage`: User authentication interface
- `TaskPage`: Main task management interface

### Components
- `Navbar`: Navigation bar with user info and logout
- `AddTaskForm`: Form for adding and editing tasks
- `TaskList`: Display and manage tasks with actions

## Development

### Backend Development
- The backend uses FastAPI for rapid API development
- JSON file storage for simplicity
- CORS enabled for frontend communication
- Error handling and validation

### Frontend Development
- React functional components with hooks
- Responsive design with CSS-in-JS
- Loading states and error handling
- Real-time updates

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

