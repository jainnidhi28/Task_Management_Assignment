from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import uuid
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, HTMLResponse, RedirectResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Update CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],
    max_age=3600,
)

# Add health check endpoint
@app.get("/health")
async def health_check():
    logger.info("Health check requested")
    return {"status": "healthy", "message": "API is running"}

# Add error handling middleware
@app.middleware("http")
async def add_error_handling(request: Request, call_next):
    try:
        logger.info(f"Received request: {request.method} {request.url}")
        response = await call_next(request)
        logger.info(f"Response status: {response.status_code}")
        return response
    except Exception as e:
        logger.error(f"Error in request: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal server error: {str(e)}"}
        )

class LoginRequest(BaseModel):
    username: str

class Task(BaseModel):
    id: Optional[str] = None
    title: str
    completed: bool = False
    username: str

class CreateTaskRequest(BaseModel):
    title: str
    username: str

class UpdateTaskRequest(BaseModel):
    title: str
    completed: bool = False
    username: str

TASKS_FILE = 'tasks.json'
USERS_FILE = 'users.json'

if not os.path.exists(TASKS_FILE):
    with open(TASKS_FILE, 'w') as f:
        json.dump([], f)

if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, 'w') as f:
        json.dump([], f)

def read_data(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)

def write_data(file_path, data):
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)

@app.get("/")
def root():
    return {"message": "Task Manager API is running"}

@app.head("/")
def root_head():
    return Response(status_code=200)

@app.get("/favicon.ico")
def favicon():
    return Response(status_code=204)

@app.get("/login")
def get_login():
    return {"message": "Login page"}

@app.post("/login")
def login(user: LoginRequest):
    users = read_data(USERS_FILE)
    if user.username not in users:
        users.append(user.username)
        write_data(USERS_FILE, users)
    return {"success": True, "message": "Login successful"}

@app.get("/tasks")
def get_all_tasks(request: Request):
    username = request.query_params.get("username")
    if not username:
        raise HTTPException(status_code=400, detail="Username is required")
    return RedirectResponse(url=f"/tasks/{username}")

@app.post("/tasks")
def add_task(task: CreateTaskRequest):
    try:
        logger.info(f"Received task creation request: {task}")
        
        # Validate input
        if not task.title or not task.title.strip():
            logger.error("Empty title provided")
            raise HTTPException(status_code=400, detail="Title cannot be empty")
            
        if not task.username:
            logger.error("No username provided")
            raise HTTPException(status_code=400, detail="Username is required")
        
        # Read existing tasks
        tasks = read_data(TASKS_FILE)
        logger.info(f"Current number of tasks: {len(tasks)}")
        
        # Create new task
        new_task = {
            "id": str(uuid.uuid4()),
            "title": task.title.strip(),
            "completed": False,
            "username": task.username
        }
        logger.info(f"Created new task: {new_task}")
        
        # Add task and save
        tasks.append(new_task)
        write_data(TASKS_FILE, tasks)
        logger.info("Task successfully added and saved")
        
        return {"success": True, "task": new_task}
    except json.JSONDecodeError as e:
        logger.error(f"JSON error: {str(e)}")
        raise HTTPException(status_code=500, detail="Error reading tasks file")
    except Exception as e:
        logger.error(f"Error adding task: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error adding task: {str(e)}")

@app.get("/tasks/{username}")
def get_tasks(username: str):
    try:
        logger.info(f"Fetching tasks for username: {username}")
        tasks = read_data(TASKS_FILE)
        logger.info(f"All tasks: {tasks}")
        user_tasks = [task for task in tasks if task["username"] == username]
        logger.info(f"User tasks for {username}: {user_tasks}")
        return {"success": True, "tasks": user_tasks}
    except Exception as e:
        logger.error(f"Error in get_tasks: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching tasks: {str(e)}")

@app.put("/tasks/complete/{task_id}")
async def complete_task(task_id: str):
    tasks = read_data(TASKS_FILE)
    for task in tasks:
        if str(task["id"]) == str(task_id):
            task["completed"] = not task["completed"] 
            write_data(TASKS_FILE, tasks)
            return {"success": True, "task": task}
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    tasks = read_data(TASKS_FILE)
    for i, task in enumerate(tasks):
        if str(task["id"]) == str(task_id):
            del tasks[i]
            write_data(TASKS_FILE, tasks)
            return {"success": True, "message": "Task deleted"}
    raise HTTPException(status_code=404, detail="Task not found")

@app.put("/tasks/{task_id}")
async def update_task(task_id: str, task: UpdateTaskRequest):
    try:
        logger.info(f"Received update request for task {task_id}: {task}")
        
        # Validate input
        if not task.title or not task.title.strip():
            logger.error("Empty title provided")
            raise HTTPException(status_code=400, detail="Title cannot be empty")
            
        if not task.username:
            logger.error("No username provided")
            raise HTTPException(status_code=400, detail="Username is required")
        
        # Read existing tasks
        tasks = read_data(TASKS_FILE)
        logger.info(f"Current number of tasks: {len(tasks)}")
        
        # Find and update task
        task_found = False
        for i, t in enumerate(tasks):
            if str(t["id"]) == str(task_id):
                if t["username"] != task.username:
                    logger.error(f"Task {task_id} belongs to different user")
                    raise HTTPException(status_code=403, detail="Cannot update task belonging to another user")
                
                tasks[i] = {
                    "id": task_id,
                    "title": task.title.strip(),
                    "completed": task.completed,
                    "username": task.username
                }
                task_found = True
                logger.info(f"Updated task: {tasks[i]}")
                break
        
        if not task_found:
            logger.error(f"Task {task_id} not found")
            raise HTTPException(status_code=404, detail="Task not found")
        
        # Save updated tasks
        write_data(TASKS_FILE, tasks)
        logger.info("Tasks successfully saved")
        
        return {"success": True, "task": tasks[i]}
    except json.JSONDecodeError as e:
        logger.error(f"JSON error: {str(e)}")
        raise HTTPException(status_code=500, detail="Error reading tasks file")
    except Exception as e:
        logger.error(f"Error updating task: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error updating task: {str(e)}")