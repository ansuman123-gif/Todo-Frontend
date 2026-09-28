import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TodoService from '../services/TodoService';
import 'bootstrap/dist/css/bootstrap.min.css';

const TodoComponent = () => {
    const [title, setTitle] = useState('');  // ✅ Changed from tittle to title
    const [description, setDescription] = useState('');
    const [completed, setCompleted] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            fetchTodoById();
        }
    }, [id]);

    const fetchTodoById = async () => {
        setLoading(true);
        try {
            const response = await TodoService.getTodoById(id);
            const todo = response.data;
            setTitle(todo.title || todo.tittle);  // Handle both field names
            setDescription(todo.description);
            setCompleted(todo.completed);
        } catch (error) {
            console.error('Error fetching todo:', error);
            setErrorMessage('Failed to load todo details');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!title.trim()) {
            newErrors.title = 'Title is required';
        }
        
        if (!description.trim()) {
            newErrors.description = 'Description is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        const todoData = {
            title: title,  // ✅ Changed from tittle to title
            description: description,
            completed: completed
        };

        try {
            let response;
            if (isEditMode) {
                // Update existing todo
                response = await TodoService.updateTodo(id, todoData);
                setSuccessMessage('Todo updated successfully!');
            } else {
                // Create new todo
                response = await TodoService.createTodo(todoData);
                setSuccessMessage('Todo created successfully!');
            }
            
            console.log('Todo saved:', response.data);
            
            // Redirect to todos list after 2 seconds
            setTimeout(() => {
                navigate('/todos');
            }, 2000);
            
        } catch (error) {
            console.error('Error saving todo:', error);
            
            if (error.response) {
                if (error.response.status === 401) {
                    setErrorMessage('Session expired. Please login again.');
                    localStorage.removeItem('isAuthenticated');
                    setTimeout(() => navigate('/login'), 2000);
                } else if (error.response.status === 400) {
                    setErrorMessage('Invalid data. Please check your inputs.');
                } else {
                    setErrorMessage('Failed to save todo. Please try again.');
                }
            } else {
                setErrorMessage('Network error. Please check your connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/todos');
    };

    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4">
                                {isEditMode ? 'Update Todo' : 'Add Todo'}
                            </h2>

                            {errorMessage && (
                                <div className="alert alert-danger" role="alert">
                                    {errorMessage}
                                </div>
                            )}

                            {successMessage && (
                                <div className="alert alert-success" role="alert">
                                    {successMessage}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Title Field */}
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">
                                        Todo Title:
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                        id="title"
                                        name="title"
                                        value={title}
                                        onChange={(e) => {
                                            setTitle(e.target.value);
                                            if (errors.title) {
                                                setErrors({ ...errors, title: '' });
                                            }
                                        }}
                                        placeholder="Enter todo title"
                                        disabled={loading}
                                    />
                                    {errors.title && (
                                        <div className="invalid-feedback">{errors.title}</div>
                                    )}
                                </div>

                                {/* Description Field */}
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">
                                        Todo Description:
                                    </label>
                                    <textarea
                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                        id="description"
                                        name="description"
                                        value={description}
                                        onChange={(e) => {
                                            setDescription(e.target.value);
                                            if (errors.description) {
                                                setErrors({ ...errors, description: '' });
                                            }
                                        }}
                                        placeholder="Enter todo description"
                                        rows="4"
                                        disabled={loading}
                                    />
                                    {errors.description && (
                                        <div className="invalid-feedback">{errors.description}</div>
                                    )}
                                </div>

                                {/* Completed Checkbox (only for edit mode) */}
                                {isEditMode && (
                                    <div className="mb-3 form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="completed"
                                            checked={completed}
                                            onChange={(e) => setCompleted(e.target.checked)}
                                            disabled={loading}
                                        />
                                        <label className="form-check-label" htmlFor="completed">
                                            Completed
                                        </label>
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="d-flex gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary flex-grow-1"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                {isEditMode ? 'Updating...' : 'Submitting...'}
                                            </>
                                        ) : (
                                            isEditMode ? 'Update' : 'Submit'
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleCancel}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodoComponent;