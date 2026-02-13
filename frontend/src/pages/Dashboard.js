import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Grid,
    Paper,
    Typography,
    AppBar,
    Toolbar,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Assignment as AssignmentIcon,
    CheckCircle as CheckCircleIcon,
    PendingActions as PendingIcon,
    TrendingUp as TrendingUpIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI } from '../services/api';
import { toast } from 'react-toastify';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [stats, setStats] = useState(null);
    const [productivity, setProductivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError('');

            const [statsResponse, productivityResponse] = await Promise.all([
                analyticsAPI.getUserStats(user.id),
                analyticsAPI.getProductivityAnalysis(user.id, 30)
            ]);

            setStats(statsResponse.data);
            setProductivity(productivityResponse.data);
        } catch (err) {
            console.error('Analytics fetch error:', err);
            setError('Failed to load analytics. Analytics service may not be running.');
            toast.error('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        toast.info('Logged out successfully');
        navigate('/login');
    };

    const StatCard = ({ title, value, icon, color }) => (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography color="text.secondary" variant="body2" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h4" component="div" sx={{ color }}>
                            {value}
                        </Typography>
                    </Box>
                    <Box sx={{ color, opacity: 0.7 }}>
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const priorityData = stats?.priority_distribution ? [
        { name: 'Low', value: stats.priority_distribution.Low },
        { name: 'Medium', value: stats.priority_distribution.Medium },
        { name: 'High', value: stats.priority_distribution.High }
    ] : [];

    const statusData = stats?.status_distribution ? [
        { name: 'Todo', value: stats.status_distribution.Todo },
        { name: 'In Progress', value: stats.status_distribution['In Progress'] },
        { name: 'Completed', value: stats.status_distribution.Completed }
    ] : [];

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Task Management Dashboard
                    </Typography>
                    <Button color="inherit" onClick={() => navigate('/tasks')}>
                        My Tasks
                    </Button>
                    <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Welcome, {user?.name}!
                </Typography>

                {error && (
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {stats && (
                    <>
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard
                                    title="Total Tasks"
                                    value={stats.total_tasks}
                                    icon={<AssignmentIcon sx={{ fontSize: 40 }} />}
                                    color="#1976d2"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard
                                    title="Completed"
                                    value={stats.completed_tasks}
                                    icon={<CheckCircleIcon sx={{ fontSize: 40 }} />}
                                    color="#4caf50"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard
                                    title="Pending"
                                    value={stats.pending_tasks}
                                    icon={<PendingIcon sx={{ fontSize: 40 }} />}
                                    color="#ff9800"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard
                                    title="Completion Rate"
                                    value={`${stats.completion_rate}%`}
                                    icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
                                    color="#9c27b0"
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Task Priority Distribution
                                    </Typography>
                                    {priorityData.some(d => d.value > 0) ? (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={priorityData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {priorityData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 5 }}>
                                            No tasks yet. Create your first task!
                                        </Typography>
                                    )}
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Task Status Overview
                                    </Typography>
                                    {statusData.some(d => d.value > 0) ? (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={statusData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="value" fill="#1976d2" name="Tasks" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 5 }}>
                                            No tasks yet. Create your first task!
                                        </Typography>
                                    )}
                                </Paper>
                            </Grid>
                        </Grid>

                        {productivity && (
                            <Paper sx={{ p: 3, mt: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    30-Day Productivity Summary
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="body2" color="text.secondary">
                                            Tasks Created
                                        </Typography>
                                        <Typography variant="h6">{productivity.total_tasks_created}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="body2" color="text.secondary">
                                            Tasks Completed
                                        </Typography>
                                        <Typography variant="h6">{productivity.total_tasks_completed}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="body2" color="text.secondary">
                                            Productivity Score
                                        </Typography>
                                        <Typography variant="h6">{productivity.productivity_score}%</Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        )}
                    </>
                )}
            </Container>
        </Box>
    );
};

export default Dashboard;
