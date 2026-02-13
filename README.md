# Task Management Application

A full-stack task management application built with the MERN stack and Python microservice for analytics.

## 🎯 Features

### User Authentication
- Secure user registration and login with JWT tokens
- Protected routes accessible only to authenticated users
- Logout functionality with session management

### Task Management
- **Create, Read, Update, Delete (CRUD)** operations for tasks
- Each task contains:
  - Title (required)
  - Description (optional)
  - Priority (Low, Medium, High)
  - Status (Todo, In Progress, Completed)
  - Due date
- **Filter tasks** by status and priority
- **Search tasks** by title
- **Sort tasks** by creation date, due date, priority, or title
- Responsive and intuitive Material-UI interface

### Dashboard & Analytics
- Real-time task statistics:
  - Total task count
  - Completed vs pending tasks
  - Task distribution by priority (pie chart)
  - Task status overview (bar chart)
  - Completion rate percentage
- 30-day productivity analysis:
  - Tasks created and completed
  - Daily completion trends
  - Productivity score

## 🛠️ Technology Stack

### Frontend
- **React.js** (v18) with Hooks
- **Material-UI** for UI components
- **React Router** for navigation
- **Axios** for API calls
- **Recharts** for data visualization
- **react-toastify** for notifications
- **date-fns** for date formatting

### Backend
- **Node.js** + **Express.js**
- **MongoDB** with Mongoose ODM
- **JWT** (JSON Web Tokens) for authentication
- **bcrypt** for password hashing
- **express-validator** for request validation
- **CORS** middleware

### Analytics Service
- **Python** (FastAPI)
- **PyMongo** for MongoDB connection
- **Uvicorn** ASGI server

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** (comes with Node.js)

## 🚀 Installation & Setup

### 1. Clone or Download the Project

Navigate to the project directory:
```bash
cd "MERN Python"
```

### 2. Backend Setup (Node.js + Express)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env file with your configuration
# MONGODB_URI=mongodb://localhost:27017/taskmanagement
# JWT_SECRET=your_secret_key_here
# PORT=5000
```

### 3. Analytics Service Setup (Python)

```bash
# Navigate to analytics service directory
cd ../analytics-service

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env

# Edit .env file with your configuration
# MONGODB_URI=mongodb://localhost:27017/taskmanagement
# PORT=8000
```

### 4. Frontend Setup (React)

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

### 5. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Windows (if installed as service):
# MongoDB should start automatically

# On macOS (using Homebrew):
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod
```

## ▶️ Running the Application

You need to run all three services simultaneously:

### Terminal 1 - Backend (Node.js)
```bash
cd backend
npm start
```
Backend will run on: `http://localhost:5000`

### Terminal 2 - Analytics Service (Python)
```bash
cd analytics-service
# Activate virtual environment first
venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On macOS/Linux

# Run the server
python main.py
# OR
uvicorn main:app --reload
```
Analytics service will run on: `http://localhost:8000`

### Terminal 3 - Frontend (React)
```bash
cd frontend
npm start
```
Frontend will run on: `http://localhost:3000`

The application will automatically open in your default browser at `http://localhost:3000`

## 📡 API Endpoints

### Authentication Endpoints (Backend)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Task Endpoints (Backend)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | Get all user tasks (with filters) | Yes |
| GET | `/api/tasks/:id` | Get single task | Yes |
| POST | `/api/tasks` | Create new task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |

**Query Parameters for GET /api/tasks:**
- `status` - Filter by status (Todo, In Progress, Completed)
- `priority` - Filter by priority (Low, Medium, High)
- `search` - Search by title
- `sortBy` - Sort by field (createdAt, dueDate, priority, title)
- `order` - Sort order (asc, desc)

### Analytics Endpoints (Python Service)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/user-stats/:userId` | Get user statistics |
| GET | `/api/analytics/productivity/:userId` | Get productivity analysis |

**Query Parameters for Productivity:**
- `days` - Number of days to analyze (default: 30)

## 📂 Project Structure

```
task-management-app/
├── backend/                    # Node.js Express backend
│   ├── models/                # Mongoose models
│   │   ├── User.js           # User model
│   │   └── Task.js           # Task model
│   ├── routes/               # API routes
│   │   ├── auth.js          # Authentication routes
│   │   └── tasks.js         # Task routes
│   ├── middleware/          # Custom middleware
│   │   └── auth.js         # JWT authentication
│   ├── server.js           # Express server
│   ├── package.json        # Dependencies
│   └── .env.example       # Environment variables template
│
├── analytics-service/         # Python FastAPI service
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── .env.example        # Environment variables template
│
├── frontend/                  # React frontend
│   ├── public/              # Public assets
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── PrivateRoute.js
│   │   │   ├── TaskItem.js
│   │   │   └── TaskForm.js
│   │   ├── context/        # React context
│   │   │   └── AuthContext.js
│   │   ├── pages/          # Page components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   └── Tasks.js
│   │   ├── services/       # API services
│   │   │   └── api.js
│   │   ├── App.js         # Main app component
│   │   ├── index.js       # Entry point
│   │   └── index.css      # Global styles
│   ├── package.json       # Dependencies
│   └── .env.example      # Environment variables template
│
├── .gitignore              # Git ignore file
└── README.md              # This file
```

## 🔐 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/taskmanagement
JWT_SECRET=your_jwt_secret_key_change_in_production
PORT=5000
NODE_ENV=development
```

### Analytics Service (.env)
```
MONGODB_URI=mongodb://localhost:27017/taskmanagement
PORT=8000
```

## 🎨 Usage Guide

1. **Register**: Create a new account with email and password
2. **Login**: Sign in with your credentials
3. **Dashboard**: View your task statistics and productivity analytics
4. **My Tasks**: 
   - Create new tasks using the blue "+" button
   - Filter and sort tasks using the controls
   - Edit tasks by clicking the edit icon
   - Delete tasks by clicking the delete icon
   - Search tasks by title

## 🧪 Testing the Application

### Test User Registration and Login
1. Navigate to `http://localhost:3000`
2. Click "Sign Up" and create an account
3. Login with your credentials

### Test Task Management
1. After login, go to "My Tasks"
2. Create a new task with the "+" button
3. Try filtering by status or priority
4. Edit and delete tasks
5. Search for tasks

### Test Analytics
1. Go to "Dashboard"
2. View task statistics and charts
3. Check the productivity summary

### Test API Directly

Using curl or Postman:

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get analytics (replace USER_ID with actual user ID)
curl http://localhost:8000/api/analytics/user-stats/USER_ID
```

## ⚠️ Known Limitations

- Analytics service requires backend data to be present
- Date validation is basic (no past date prevention)
- No task categories or tags implemented
- No file attachments for tasks
- No email verification for registration
- No password reset functionality
- Single database for all services (no microservice separation)

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check the connection string in `.env` files
- Verify MongoDB is listening on port 27017

### Port Already in Use
- Backend (5000), Analytics (8000), or Frontend (3000) port may be occupied
- Change ports in respective `.env` files or configuration

### Analytics Service Not Loading
- Ensure Python virtual environment is activated
- Install all requirements: `pip install -r requirements.txt`
- Check if MongoDB is accessible from Python service

### CORS Errors
- Ensure all three services are running
- Check if frontend proxy is configured correctly in `package.json`

## 🤝 Contributing

This is a learning project. Feel free to fork and modify as needed.

## 📄 License

ISC License

## 👨‍💻 Authors

Built as a full-stack MERN + Python demonstration project.

---

**Enjoy managing your tasks! 📝✅**
