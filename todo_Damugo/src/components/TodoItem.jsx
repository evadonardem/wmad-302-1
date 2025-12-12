import React from 'react';
import { ListGroup, Form, Button } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';


const TodoItem = ({ task, toggleComplete, deleteTask }) => {
   
    const bgColor = task.completed ? '#e5f3e7ff' : 'white'; 

    return (
        <ListGroup.Item 
            className="d-flex justify-content-between align-items-center"
            style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                backgroundColor: bgColor
            }}
        >
            <div className="d-flex align-items-center">
                <Form.Check
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                    className="me-3"
                />
                <span className="lead mb-0">{task.text}</span>
            </div>
            
            <Button 
                variant="danger" 
                size="sm" 
                onClick={() => deleteTask(task.id)}
               
            > 
                <Trash size={16} /> {
                }
            </Button>
        </ListGroup.Item>
    );
};

export default TodoItem;