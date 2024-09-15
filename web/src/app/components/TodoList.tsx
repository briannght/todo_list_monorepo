import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Todo {
    id: number;
    description: string;
    assignee: string;
    completed: boolean;
}

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState<Todo>({ id: 0, description: '', assignee: '', completed: false });
    const [isEditing, setIsEditing] = useState(false);

    const fetchTodos = async () => {
        const response = await axios.get('http://localhost:3000/duties');
        setTodos(response.data);
    };

    const deleteTodo = async (id: number) => {
        await axios.delete(`http://localhost:3000/duties/${id}`);
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const addOrUpdateTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            await updateTodo(newTodo.id);
        } else {
            await addTodo();
        }
    };

    const addTodo = async () => {
        const response = await axios.post('http://localhost:3000/duties', newTodo);
        setTodos([...todos, response.data]);
        resetForm();
    };

    const updateTodo = async (id: number) => {
        const response = await axios.put(`http://localhost:3000/duties/${id}`, newTodo);
        setTodos(todos.map(todo => todo.id === id ? response.data : todo));
        resetForm();
    };

    const resetForm = () => {
        setNewTodo({ id: 0, description: '', assignee: '', completed: false });
        setIsEditing(false);
    };

    const editTodo = (todo: Todo) => {
        setNewTodo(todo);
        setIsEditing(true);
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1>To-Do List</h1>
            <form onSubmit={addOrUpdateTodo}>
                <input
                    type="text"
                    value={newTodo.description}
                    onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                    placeholder="Add a new task"
                />
                <input
                    type="text"
                    value={newTodo.assignee}
                    onChange={(e) => setNewTodo({ ...newTodo, assignee: e.target.value })}
                    placeholder="Assignee"
                />
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={newTodo.completed}
                            onChange={(e) => setNewTodo({ ...newTodo, completed: e.target.checked })}
                        />
                        Completed
                    </label>
                </div>
                <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
                {isEditing && <button onClick={resetForm}>Cancel</button>}
            </form>

            <ul>
                {todos.map(todo => (
                    <li key={todo.id} onClick={() => editTodo(todo)}>
                        <p>{todo.description} - {todo.assignee} - {todo.completed ? 'Completed' : 'Incomplete'}</p>
                        <button onClick={(e) => { e.stopPropagation(); deleteTodo(todo.id); }}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;