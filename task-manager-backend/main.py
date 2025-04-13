from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import uuid
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os

app = FastAPI()

# Update CORS configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://task-manager-frontend.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)


class LoginRequest(BaseModel):
    username: str

class Task(BaseModel):
    id: Optional[str] = None
    title: str
    completed: bool
    username: str

class CreateTaskRequest(BaseModel):
    title: str
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
    tasks = read_data(TASKS_FILE)
    new_task = {
        "id": str(uuid.uuid4()),
        "title": task.title,
        "completed": False,
        "username": task.username
    }
    tasks.append(new_task)
    write_data(TASKS_FILE, tasks)
    return {"success": True, "task": new_task}

@app.get("/tasks/{username}")
def get_tasks(username: str):
    tasks = read_data(TASKS_FILE)
    user_tasks = [task for task in tasks if task["username"] == username]
    return {"success": True, "tasks": user_tasks}

@app.put("/tasks/complete/{task_id}")
async def complete_task(task_id: str):
    tasks = read_data(TASKS_FILE)
    for task in tasks:
        if task["id"] == task_id:
            task["completed"] = not task["completed"] 
            write_data(TASKS_FILE, tasks)
            return {"success": True, "task": task}
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    tasks = read_data(TASKS_FILE)
    for i, task in enumerate(tasks):
        if task["id"] == task_id:
            del tasks[i]
            write_data(TASKS_FILE, tasks)
            return {"success": True, "message": "Task deleted"}
    raise HTTPException(status_code=404, detail="Task not found")

@app.put("/tasks/{task_id}")
async def update_task(task_id: str, task: Task):
    tasks = read_data(TASKS_FILE)
    for i, t in enumerate(tasks):
        if t["id"] == task_id:
            if not task.title or not task.title.strip():
                raise HTTPException(status_code=400, detail="Title cannot be empty")
            
            tasks[i] = {
                "id": task_id,
                "title": task.title.strip(),
                "completed": task.completed,
                "username": t["username"]
            }
            write_data(TASKS_FILE, tasks)
            return {"success": True, "task": tasks[i]}
    
    raise HTTPException(status_code=404, detail="Task not found")