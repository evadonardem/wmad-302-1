import { useState } from "react";
import { Button, Card, FloatingLabel, FormControl } from "react-bootstrap";

const TodoForm = ({ onAddTodoItem = () => false }) => {
  const [item, setItem] = useState({
    description: "",
    completed: false,
  });

  const handleChange = (e) => {
    setItem({
      ...item,
      description: e.target.value,
    });
  };

  const handleAdd = () => {
    if (item.description.trim()) {
      onAddTodoItem(item);
      setItem({ description: "", completed: false });
    }
  };

  return (
    <Card className="shadow-sm border-0 rounded-4">
      <Card.Body className="p-4">
        <Card.Title className="text-primary fw-semibold mb-3">
          Add New Task
        </Card.Title>

        <Card.Text className="text-muted mb-4 fst-italic small">
          “The finest work you will ever do is on yourself. Make time each day
          for your well-being, your personal development, and the mastery of a
          new technical skill.”
        </Card.Text>

        <FloatingLabel label="New Task" className="mb-3">
          <FormControl
            placeholder="Enter your task"
            value={item.description}
            onChange={handleChange}
          />
        </FloatingLabel>

        <div className="d-grid gap-2 mt-3">
          <Button
            variant="primary"
            size="lg"
            onClick={handleAdd}
            disabled={!item.description.trim()}
          >
            ➕ Add Task
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TodoForm;