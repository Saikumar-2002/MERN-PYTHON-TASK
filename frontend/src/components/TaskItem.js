import React from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Chip,
    IconButton,
    Box,
    Grid
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const TaskItem = ({ task, onEdit, onDelete }) => {
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High':
                return 'error';
            case 'Medium':
                return 'warning';
            case 'Low':
                return 'info';
            default:
                return 'default';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return 'success';
            case 'In Progress':
                return 'primary';
            case 'Todo':
                return 'default';
            default:
                return 'default';
        }
    };

    return (
        <Card className="card-elevation">
            <CardContent>
                <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12} sm={8}>
                        <Typography variant="h6" gutterBottom>
                            {task.title}
                        </Typography>
                        {task.description && (
                            <Typography variant="body2" color="text.secondary" paragraph>
                                {task.description}
                            </Typography>
                        )}
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                            <Chip
                                label={task.status}
                                color={getStatusColor(task.status)}
                                size="small"
                            />
                            <Chip
                                label={task.priority}
                                color={getPriorityColor(task.priority)}
                                size="small"
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                            <CalendarIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                                Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                            </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                            Created: {format(new Date(task.createdAt), 'MMM dd, yyyy')}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onEdit(task)}
                    aria-label="edit"
                >
                    <EditIcon />
                </IconButton>
                <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete(task._id)}
                    aria-label="delete"
                >
                    <DeleteIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
};

export default TaskItem;
