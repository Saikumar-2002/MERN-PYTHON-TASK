from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime, timedelta
from typing import Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Task Management Analytics API",
    description="Analytics and insights service for task management",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
try:
    client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/taskmanagement'))
    db = client.get_database()
    print("✅ MongoDB connected successfully")
except Exception as e:
    print(f"❌ MongoDB connection error: {e}")

# Helper function to validate ObjectId
def validate_object_id(id_str: str):
    try:
        return ObjectId(id_str)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID format")

@app.get("/")
def read_root():
    return {
        "message": "Task Management Analytics API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/api/analytics/user-stats/{user_id}")
async def get_user_statistics(user_id: str):
    """
    Get aggregate statistics for a user
    - Total task count
    - Completed vs pending tasks
    - Task distribution by priority
    - Completion rate
    """
    try:
        user_object_id = validate_object_id(user_id)
        
        # Get all tasks for user
        tasks = list(db.tasks.find({"user": user_object_id}))
        
        if not tasks:
            return {
                "success": True,
                "user_id": user_id,
                "total_tasks": 0,
                "completed_tasks": 0,
                "pending_tasks": 0,
                "in_progress_tasks": 0,
                "completion_rate": 0,
                "priority_distribution": {
                    "Low": 0,
                    "Medium": 0,
                    "High": 0
                },
                "status_distribution": {
                    "Todo": 0,
                    "In Progress": 0,
                    "Completed": 0
                }
            }
        
        # Calculate statistics
        total_tasks = len(tasks)
        completed_tasks = sum(1 for task in tasks if task.get('status') == 'Completed')
        in_progress_tasks = sum(1 for task in tasks if task.get('status') == 'In Progress')
        pending_tasks = sum(1 for task in tasks if task.get('status') == 'Todo')
        
        # Priority distribution
        priority_distribution = {
            "Low": sum(1 for task in tasks if task.get('priority') == 'Low'),
            "Medium": sum(1 for task in tasks if task.get('priority') == 'Medium'),
            "High": sum(1 for task in tasks if task.get('priority') == 'High')
        }
        
        # Status distribution
        status_distribution = {
            "Todo": pending_tasks,
            "In Progress": in_progress_tasks,
            "Completed": completed_tasks
        }
        
        # Completion rate
        completion_rate = round((completed_tasks / total_tasks * 100), 2) if total_tasks > 0 else 0
        
        return {
            "success": True,
            "user_id": user_id,
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "pending_tasks": pending_tasks,
            "in_progress_tasks": in_progress_tasks,
            "completion_rate": completion_rate,
            "priority_distribution": priority_distribution,
            "status_distribution": status_distribution
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user statistics: {str(e)}")

@app.get("/api/analytics/productivity/{user_id}")
async def get_productivity_analysis(
    user_id: str,
    days: Optional[int] = 30
):
    """
    Get productivity analysis and task completion trends
    - Task completion trends over specified time period
    - Daily/weekly productivity metrics
    """
    try:
        user_object_id = validate_object_id(user_id)
        
        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        # Get tasks within date range
        tasks = list(db.tasks.find({
            "user": user_object_id,
            "createdAt": {"$gte": start_date, "$lte": end_date}
        }))
        
        # Get completed tasks in the period
        completed_tasks = [task for task in tasks if task.get('status') == 'Completed']
        
        # Calculate daily completion data
        daily_completions = {}
        for task in completed_tasks:
            created_date = task.get('createdAt')
            if created_date:
                date_key = created_date.strftime('%Y-%m-%d')
                daily_completions[date_key] = daily_completions.get(date_key, 0) + 1
        
        # Calculate trends
        total_created = len(tasks)
        total_completed = len(completed_tasks)
        
        # Average tasks per day
        avg_tasks_per_day = round(total_created / days, 2) if days > 0 else 0
        avg_completions_per_day = round(total_completed / days, 2) if days > 0 else 0
        
        # Overdue tasks
        overdue_tasks = sum(1 for task in tasks 
                           if task.get('status') != 'Completed' 
                           and task.get('dueDate') 
                           and task.get('dueDate') < datetime.now())
        
        return {
            "success": True,
            "user_id": user_id,
            "period_days": days,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "total_tasks_created": total_created,
            "total_tasks_completed": total_completed,
            "overdue_tasks": overdue_tasks,
            "avg_tasks_per_day": avg_tasks_per_day,
            "avg_completions_per_day": avg_completions_per_day,
            "daily_completion_trend": [
                {"date": date, "count": count} 
                for date, count in sorted(daily_completions.items())
            ],
            "productivity_score": round((total_completed / total_created * 100), 2) if total_created > 0 else 0
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching productivity analysis: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv('PORT', 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
