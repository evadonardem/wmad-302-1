import React from 'react';
import { ListGroup, Alert } from 'react-bootstrap';
import TodoItem from './TodoItem'; 

const TodoList = ({ todos, toggleComplete, deleteTask }) => {
    if (todos.length === 0) {
        return <Alert variant="info" className="text-center">No task yet! Add one above.</Alert>;
    }

    return (
        <ListGroup className="mb-3">
            {todos.map((task) => (
                <TodoItem
                    key={task.id}
                    task={task}
                    toggleComplete={toggleComplete}
                    deleteTask={deleteTask}
                />
            ))}
        </ListGroup>
    );
};

export default TodoList;