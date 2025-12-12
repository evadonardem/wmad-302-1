import { useState } from "react";
import { Button, Card, FloatingLabel, FormControl } from "react-bootstrap";

const TodoForm = ({ onAddTodoItem = () => false }) => {
  const [item, setItem] = useState({
    description: "",
    completed: false,
  });

  const handleAdd = () => {
    if (item.description.trim() === "") return; 

    onAddTodoItem(item);
    setItem({
      description: "",
      completed: false,
    });
  };

  return (
    <Card style={{ backgroundColor: "ivory" }}>
      <Card.Body>
        <Card.Title>What do you want to do for this day?</Card.Title>
        <Card.Text>
          Think something for your personal development, well-being, upgrading,
          technical skills, and more.
        </Card.Text>
        <FloatingLabel label="Enter your task here>>>">
          <FormControl
            value={item.description} 
            placeholder="Enter your task here>>>"
            onChange={(e) =>
              setItem({
                ...item,
                description: e.target.value,
              })
            }
          />
        </FloatingLabel>
        <br />
        <Button variant="primary" className="w-100 fw-semibold" onClick={handleAdd}>
          Line this up!
        </Button>
      </Card.Body>
    </Card>
  );
};

export default TodoForm;

