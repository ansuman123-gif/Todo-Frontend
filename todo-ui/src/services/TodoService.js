import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

class TodoService {
    // Get auth header for Basic Auth
    getAuthHeader() {
        const username = localStorage.getItem('username');
        const password = localStorage.getItem('password');
        
        if (username && password) {
            const credentials = btoa(`${username}:${password}`);
            return {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/json'
            };
        }
        return {
            'Content-Type': 'application/json'
        };
    }

    // Get all todos
    getAllTodos() {
        return axios.get(`${API_BASE_URL}/Todos/GetAll`, {
            headers: this.getAuthHeader()
        });
    }

    // Get todo by ID
    getTodoById(id) {
        return axios.get(`${API_BASE_URL}/Todos/${id}`, {
            headers: this.getAuthHeader()
        });
    }

    // Create new todo
    createTodo(todo) {
        // Make sure the field name matches backend
        const todoData = {
            title: todo.title || todo.tittle,  // Handle both
            description: todo.description,
            completed: todo.completed || false
        };
        return axios.post(`${API_BASE_URL}/Todos/Create`, todoData, {
            headers: this.getAuthHeader()
        });
    }

    // Update todo
    updateTodo(id, todo) {
        const todoData = {
            title: todo.title || todo.tittle,
            description: todo.description,
            completed: todo.completed || false
        };
        return axios.put(`${API_BASE_URL}/Todos/Update/${id}`, todoData, {
            headers: this.getAuthHeader()
        });
    }

    // Delete todo
    deleteTodo(id) {
        return axios.delete(`${API_BASE_URL}/Todos/Delete/${id}`, {
            headers: this.getAuthHeader()
        });
    }

    // Complete todo
    completeTodo(id) {
        return axios.patch(`${API_BASE_URL}/Todos/${id}`, {}, {
            headers: this.getAuthHeader()
        });
    }

    // Authentication APIs
    register(userData) {
        return axios.post(`${API_BASE_URL}/auth/register`, userData);
    }

    login(loginData) {
        return axios.post(`${API_BASE_URL}/auth/login`, loginData);
    }
}

export default new TodoService();