import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TodoService from '../services/TodoService'

const ListTodoComponent = () => {

    const [todos, setTodos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login')
            return
        }
        listTodos()
    }, [isAuthenticated, navigate])

    function listTodos() {
        setLoading(true)
        TodoService.getAllTodos().then((response) => {
            setTodos(response.data)
            setLoading(false)
        }).catch(error => {
            console.log(error)
            setError('Failed to load todos. Please try again.')
            setLoading(false)
        })
    }

    function removeTodo(id) {
        TodoService.deleteTodo(id).then(() => {
            setTodos(todos.filter((todo) => todo.id !== id))
        }).catch(error => {
            console.log(error)
        })
    }

    function completeTodo(id) {
        TodoService.completeTodo(id).then((response) => {
            setTodos(
                todos.map((todo) =>
                    todo.id === id ? response.data : todo
                )
            )
        }).catch(error => {
            console.log(error)
        })
    }

    function addTodo() {
        navigate('/add-todo')
    }

    function updateTodo(id) {
        navigate(`/update-todo/${id}`)
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <div className='container'>
            <h2 className='text-center'>List of Todos</h2>
            <button className='btn btn-primary mb-2' onClick={addTodo}>
                Add Todo
            </button>

            {loading && (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div>
                    <table className='table table-bordered table-striped'>
                        <thead>
                            <tr>
                                <th>Todo Title</th>
                                <th>Todo Description</th>
                                <th>Todo Completed</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                todos.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center">
                                            No todos found. Create your first todo!
                                        </td>
                                    </tr>
                                ) : (
                                    todos.map(todo => (
                                        <tr key={todo.id}>
                                            <td>{todo.title}</td>
                                            <td>{todo.description}</td>
                                            <td>{todo.completed ? 'YES' : 'NO'}</td>
                                            <td>
                                                <button
                                                    className='btn btn-info'
                                                    onClick={() => updateTodo(todo.id)}
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    className='btn btn-danger'
                                                    style={{ marginLeft: 10 }}
                                                    onClick={() => removeTodo(todo.id)}
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    className='btn btn-success'
                                                    style={{ marginLeft: 10 }}
                                                    onClick={() => completeTodo(todo.id)}
                                                    disabled={todo.completed}
                                                >
                                                    Complete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )
                            }
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default ListTodoComponent