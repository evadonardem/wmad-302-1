import { useState } from "react";
import { Button, Card, FloatingLabel, FormControl } from "react-bootstrap";
import TodoList from "./TodoList.jsx";

const TodoForm = ({ onAddTodoItem = () => {}, list = [], onToggle = () => {} }) => {
  const [item, setItem] = useState({
    description: "",
    completed: false,
  });

  const handleAdd = () => {
    if (!item.description.trim()) return;
    onAddTodoItem(item);
    setItem({ description: "", completed: false }); // clear input
  };

  return (
    <Card style={{ backgroundColor: "Ivory" }}>
      <Card.Body>
        {/* --- Tasks Section --- */}
        <h5 className="mb-3">My tasks for the day</h5>
        <TodoList list={list} onToggle={onToggle} />

        <hr />

        {/* --- Input Section Below Tasks --- */}
        <Card.Title>What do you want to do for this day?</Card.Title>
        <Card.Text>
          Think of something for your personal development, well-being, or skills.
        </Card.Text>

        <FloatingLabel label="Todo">
          <FormControl
            value={item.description}
            onChange={(e) =>
              setItem({
                ...item,
                description: e.target.value,
              })
            }
          />
        </FloatingLabel>

        <br />
        <Button variant="primary" onClick={handleAdd}>
          Line this up!
        </Button>
      </Card.Body>
    </Card>
  );
};

export default TodoForm;
