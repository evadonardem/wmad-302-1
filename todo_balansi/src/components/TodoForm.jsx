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
    setItem({ description: "", completed: false });
  };

  return (
    <Card
      style={{
        backgroundColor: "#F7F7F7",
        border: "none",
        borderRadius: 16,
        boxShadow: "0 8px 24px rgba(133,72,54,0.08)",
        border: "1px solid rgba(133,72,54,0.06)",
      }}
    >
      <Card.Body style={{ padding: 24 }}>
        <Card.Title style={{ color: "#000000", fontWeight: 700, fontSize: 20, alignItems: "center", marginBottom: 12 }}>
          Let’s make today productive. What do you want to accomplish?
        </Card.Title>
        <Card.Text style={{ color: "#000000", marginBottom: 16 }}>
          Think of something for your personal development, well-being, or skills.
        </Card.Text>

        <FloatingLabel
          label={item.description ? "" : "Todo"}
          style={{ marginBottom: 12 }}
        >
          <FormControl
            placeholder=" "
            value={item.description}
            onChange={(e) =>
              setItem({
                ...item,
                description: e.target.value,
              })
            }
            style={{
              borderColor: "rgba(133,72,54,0.08)",
              backgroundColor: "#ffffff",
              borderRadius: 12,
              padding: "12px 14px",
              boxShadow: "inset 0 2px 6px rgba(0,0,0,0.04)",
              color: "#000000",
            }}
          />
        </FloatingLabel>

        <br />
        <Button
          variant="light"
          onClick={handleAdd}
          style={{
            backgroundColor: "#FFB22C",
            border: "none",
            color: "#000000",
            fontWeight: 600,
            borderRadius: 12,
            padding: "10px 20px",
            boxShadow: "0 8px 18px rgba(133,72,54,0.12)",
          }}
        >
          Line this up!
        </Button>
      </Card.Body>
    </Card>
  );
};

export default TodoForm;