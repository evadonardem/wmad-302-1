import React, { useState } from "react";
import { Button, Card, Form, InputGroup, FormControl } from "react-bootstrap";

const TodoForm = ({ onAddTodoItem = () => {} }) => {
  const [text, setText] = useState("");

  const submit = (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAddTodoItem({
      id: Date.now(),
      description: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
    });
    setText("");
  };

  return (
    <Card className="shadow-sm" style={{ background: "#fffef8" }}>
      <Card.Body>
        <Form onSubmit={submit}>
          <InputGroup>
            <FormControl
              placeholder="Add a clear, short task (press Enter to add)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-label="New todo"
            />
            <Button variant="primary" type="submit">
              Add
            </Button>
          </InputGroup>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default TodoForm;