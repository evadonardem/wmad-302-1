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
    <Card style={{ backgroundColor: "#fffaf0", border: "1px solid #8b0000" }}>
      <Card.Body>
        <Card.Title style={{ color: "#8b0000" }}>
          What do you want to do for this day?
        </Card.Title>
        <Card.Text style={{ color: "#5a5a5a" }}>
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
            style={{ borderColor: "#8b0000" }}
          />
        </FloatingLabel>

        <br />
        <Button
          variant="light"
          onClick={handleAdd}
          style={{
            backgroundColor: "#8b0000",
            border: "none",
            color: "white",
            fontWeight: "500",
            borderRadius: "8px",
            padding: "8px 18px",
          }}
        >
          Line this up!
        </Button>
      </Card.Body>
    </Card>
  );
};

export default TodoForm;
