import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    AppBar,
    Toolbar,
    Typography,
    Button,
    Grid,
    Paper,
    TextField,
    InputAdornment,
    MenuItem,
    Fab,
    CircularProgress
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Dashboard as DashboardIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { tasksAPI } from '../services/api';
import { toast } from 'react-toastify';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';

const Tasks = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, [statusFilter, priorityFilter, searchTerm, sortBy, sortOrder]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const params = {};

            if (statusFilter) params.status = statusFilter;
            if (priorityFilter) params.priority = priorityFilter;
            if (searchTerm) params.search = searchTerm;
            if (sortBy) params.sortBy = sortBy;
            if (sortOrder) params.order = sortOrder;

            const response = await tasksAPI.getTasks(params);
            setTasks(response.data.tasks);
        } catch (error) {
            console.error('Fetch tasks error:', error);
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = () => {
        setEditingTask(null);
        setDialogOpen(true);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setDialogOpen(true);
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await tasksAPI.deleteTask(taskId);
                toast.success('Task deleted successfully');
                fetchTasks();
            } catch (error) {
                console.error('Delete task error:', error);
                toast.error('Failed to delete task');
            }
        }
    };

    const handleTaskSubmit = async (taskData) => {
        try {
            if (editingTask) {
                await tasksAPI.updateTask(editingTask._id, taskData);
                toast.success('Task updated successfully');
            } else {
                await tasksAPI.createTask(taskData);
                toast.success('Task created successfully');
            }
            setDialogOpen(false);
            setEditingTask(null);
            fetchTasks();
        } catch (error) {
            console.error('Task submit error:', error);
            toast.error(editingTask ? 'Failed to update task' : 'Failed to create task');
            throw error;
        }
    };

    const handleLogout = () => {
        logout();
        toast.info('Logged out successfully');
        navigate('/login');
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        My Tasks
                    </Typography>
                    <Button color="inherit" onClick={() => navigate('/dashboard')} startIcon={<DashboardIcon />}>
                        Dashboard
                    </Button>
                    <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                fullWidth
                                select
                                label="Status"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="Todo">Todo</MenuItem>
                                <MenuItem value="In Progress">In Progress</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                fullWidth
                                select
                                label="Priority"
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="Low">Low</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="High">High</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                fullWidth
                                select
                                label="Sort By"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <MenuItem value="createdAt">Created Date</MenuItem>
                                <MenuItem value="dueDate">Due Date</MenuItem>
                                <MenuItem value="priority">Priority</MenuItem>
                                <MenuItem value="title">Title</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                fullWidth
                                select
                                label="Order"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <MenuItem value="asc">Ascending</MenuItem>
                                <MenuItem value="desc">Descending</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                </Paper>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : tasks.length === 0 ? (
                    <Paper sx={{ p: 5, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary">
                            No tasks found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {searchTerm || statusFilter || priorityFilter
                                ? 'Try adjusting your filters'
                                : 'Create your first task to get started'}
                        </Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={2}>
                        {tasks.map((task) => (
                            <Grid item xs={12} key={task._id}>
                                <TaskItem
                                    task={task}
                                    onEdit={handleEditTask}
                                    onDelete={handleDeleteTask}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            <Fab
                color="primary"
                aria-label="add"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                onClick={handleCreateTask}
            >
                <AddIcon />
            </Fab>

            <TaskForm
                open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    setEditingTask(null);
                }}
                onSubmit={handleTaskSubmit}
                task={editingTask}
            />
        </Box>
    );
};

export default Tasks;
