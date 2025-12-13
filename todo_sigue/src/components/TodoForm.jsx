import { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';

const TodoForm = ({ addTodo }) => { 
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    
    addTodo(value); 
    
    setValue('');
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-3">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Enter a new task for the day..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button variant="primary" type="submit">
          Add
        </Button>
      </InputGroup>
    </Form>
  );
};

export default TodoForm;