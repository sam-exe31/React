import { useState, useEffect } from 'react'
import { TodoProvider } from './Context/Todocontext' 
import './App.css'
import { Todoform, Todoitem } from './component'

function App() {
  // 1. THE FIX: Lazy initialize the state directly from local storage
  const [todos, settodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      return JSON.parse(savedTodos);
    }
    return []; // Return empty array if nothing is in local storage
  });

  const addtodo = (todo) => {
    settodos((prev) => [{id: Date.now(), ...todo}, ...prev])
  }

  const updatetodo = (id, todo) => {
    settodos((prev) => prev.map((prevtodo) => prevtodo.id === id ? todo : prevtodo))
  }

  const deletetodo = (id) => {
    settodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const togglecomplete = (id) => {
    settodos((prev) => prev.map((prevtodo) => prevtodo.id === id ? {...prevtodo, completed: !prevtodo.completed} : prevtodo))
  }

  // 2. THE FIX: We deleted the old useEffect that was causing the error!
  // We ONLY need this one to save items when the todos change.
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])
  
  return (
    <TodoProvider value={{todos, updatetodo, deletetodo, addtodo, togglecomplete}}>
      <div className="bg-[#172842] min-h-screen py-8">
        <div className="w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-3 text-white">
          <h1 className="text-2xl font-bold text-center mb-8 mt-2">Manage Your Todos</h1>
          <div className="mb-4">
            <Todoform />
          </div>
          <div className="flex flex-wrap gap-y-3">
            {todos.map((todo) => (
              <div key={todo.id} className='w-full'>
                <Todoitem todo={todo} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </TodoProvider>
  )
}

export default App