import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ListTodoComponent from './components/ListTodoComponent'
import TodoComponent from './components/TodoComponent'
import RegisterComponent from './components/RegisterComponent'  // ✅ Import Register
import LoginComponent from './components/LoginComponent'        // ✅ Import Login
import Header from './components/Header'
import Footer from './components/Footer'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {
    return (
        <div className='app-wrapper'>
            <BrowserRouter>
                <Header />
                <main className='app-main'>
                    <Routes>
                        <Route path='/' element={<Navigate to='/todos' />} />
                        <Route path='/todos' element={<ListTodoComponent />} />
                        <Route path='/add-todo' element={<TodoComponent />} />
                        <Route path='/update-todo/:id' element={<TodoComponent />} />
                        {/* ✅ Add Registration and Login Routes */}
                        <Route path='/register' element={<RegisterComponent />} />
                        <Route path='/login' element={<LoginComponent />} />
                    </Routes>
                </main>
                <Footer />
            </BrowserRouter>
        </div>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)

export default App