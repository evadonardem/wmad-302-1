import { Form } from "react-bootstrap";

const TodoItem = ({ item = {}, onToggle = () => {} }) => {
  const { description, completed } = item;

  return (
    <div className="mb-2">
      <Form.Check
        type="checkbox"
        label={
          <span
            style={{
              textDecoration: completed ? "line-through" : "none",
              color: completed ? "#888" : "#2e2e2e",
            }}
          >
            {description}
          </span>
        }
        checked={completed}
        onChange={onToggle}
      />
    </div>
  );
};

export default TodoItem;
