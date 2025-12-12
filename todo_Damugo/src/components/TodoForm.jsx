import { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';

const TodoForm = ({ addTask }) => {
    const [task, setTask] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (task.trim()) {
            addTask(task.trim()); 
            setTask(''); 
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="mb-3">
            <InputGroup>
                <Form.Control
                    type="text"
                    placeholder="Enter a new task..."
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                />
                <Button variant="primary" type="submit" >
                    Add
                </Button>
            </InputGroup>
        </Form>
    );
};

export default TodoForm;