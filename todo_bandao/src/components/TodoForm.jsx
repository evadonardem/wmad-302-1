import { useState } from "react";
import { Button, Card, FloatingLabel, FormControl } from "react-bootstrap";

const TodoForm = ({ onAddTodoItem = () => false }) => {
  const [item, setItem] = useState({
    description: "",
    completed: false,
  });

  return (
    <Card style={{ backgroundColor: "ivory" }}>
      <Card.Body>
        <Card.Title>What do you want to do for this day?</Card.Title>
        <Card.Text>
          Think something for your personal development, well-being, or upgrading your skills.
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
        <Button
          onClick={() => {
            onAddTodoItem(item);
            setItem({ description: "", completed: false });
          }}
        >
          Line this up!
        </Button>
      </Card.Body>
    </Card>
  );
};

export default TodoForm;
