import React, { useState } from 'react';
import { Card, Container } from 'react-bootstrap';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';

function App() {
    

  
    const [todos, setTodos] = useState([
        { id: 1, text: 'Design components with React-Bootstrap', completed: true },
        { id: 2, text: 'Implement state management logic', completed: false },
        { id: 3, text: 'Fix environment setup', completed: false },
    ]);


    const addTask = (text) => {
        const newTask = {
            id: Date.now(), 
            text: text,
            completed: false,
        };
        setTodos([...todos, newTask]);
    };

  
    const toggleComplete = (id) => {
        setTodos(
            todos.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

 
    const deleteTask = (id) => {
        setTodos(todos.filter((task) => task.id !== id));
    };

    return (
        <>
            <Container className="d-flex justify-content-center align-items-center " 
            
            style={{ 
              minHeight: '100vh',
              
            }}>
                <Card style={{ 
                  width: '100%', 
                  maxWidth: '600px', 
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  backgroundColor: 'rgba(243, 243, 228, 1)' 
                  }}>
                    <Card.Body>
                        <Card.Title className="text-center mb-4">
                            <h1>My Task Organizer</h1>
                        </Card.Title>
                        <hr />
                        
                        {}
                        <TodoForm addTask={addTask} />
                        <hr />
                        
                        {}
                        <TodoList
                            todos={todos}
                            toggleComplete={toggleComplete}
                            deleteTask={deleteTask}
                        />

                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}

export default App;