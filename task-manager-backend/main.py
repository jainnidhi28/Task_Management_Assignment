from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional
import json
import uuid
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----- Models -----
class LoginRequest(BaseModel):
    username: str

class Task(BaseModel):
    id: Optional[int] = None
    title: str
    completed: bool
    username: str

class CreateTaskRequest(BaseModel):
    title: str
    username: str

# ----- File helpers -----
TASKS_FILE = 'tasks.json'
USERS_FILE = 'users.json'

# Ensure files exist
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

# ----- Routes -----

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
    return {"message": "Login successful"}

@app.get("/tasks")
def get_all_tasks(request: Request):
    # Get username from query parameters
    username = request.query_params.get("username")
    if not username:
        raise HTTPException(status_code=400, detail="Username is required")
    return RedirectResponse(url=f"/tasks/{username}")

@app.post("/tasks")
def add_task(task: CreateTaskRequest):
    tasks = read_data(TASKS_FILE)
    new_task = {
        "id": len(tasks) + 1,
        "title": task.title,
        "completed": False,
        "username": task.username
    }
    tasks.append(new_task)
    write_data(TASKS_FILE, tasks)
    return new_task

@app.get("/tasks/{username}")
def get_tasks(username: str):
    tasks = read_data(TASKS_FILE)
    return [task for task in tasks if task["username"] == username]

@app.put("/tasks/complete/{task_id}")
async def complete_task(task_id: int):
    tasks = read_data(TASKS_FILE)
    for task in tasks:
        if task["id"] == task_id:
            task["completed"] = not task["completed"]  # Toggle completion status
            write_data(TASKS_FILE, tasks)
            return {"success": True, "task": task}
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    tasks = read_data(TASKS_FILE)
    for i, task in enumerate(tasks):
        if task["id"] == task_id:
            del tasks[i]
            write_data(TASKS_FILE, tasks)
            return {"message": "Task deleted"}
    raise HTTPException(status_code=404, detail="Task not found")

@app.put("/tasks/{task_id}")
async def update_task(task_id: int, task: Task):
    tasks = read_data(TASKS_FILE)
    for i, t in enumerate(tasks):
        if t["id"] == task_id:
            # Validate input
            if not task.title or not task.title.strip():
                raise HTTPException(status_code=400, detail="Title cannot be empty")
            
            # Update the task while preserving the username and id
            tasks[i] = {
                "id": task_id,
                "title": task.title.strip(),
                "completed": task.completed,
                "username": t["username"]  # Preserve the original username
            }
            write_data(TASKS_FILE, tasks)
            return {"success": True, "task": tasks[i]}
    
    raise HTTPException(status_code=404, detail="Task not found")