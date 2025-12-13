import { Button, Form } from "react-bootstrap";

const TodoItem = ({ item = {}, onToggle, onRemove }) => {
  const { description, completed } = item;

  return (
    <div
      className="d-flex align-items-center justify-content-between p-2 rounded-3 mb-2 shadow-sm bg-light"
      style={{ transition: "all 0.2s ease-in-out" }}
    >
      <Form.Check
        type="checkbox"
        id={`todo-${description}`}
        label={description}
        checked={completed}
        onChange={onToggle}
        className={`${completed ? "text-muted text-decoration-line-through" : ""}`}
        style={{
          fontSize: "1.1rem",
          flex: 1,
          cursor: "pointer",
        }}
      />
      <Button
        variant="outline-danger"
        size="sm"
        onClick={onRemove}
        className="ms-2 fw-bold"
        style={{
          width: "2rem",
          height: "2rem",
          borderRadius: "50%",
          lineHeight: "1rem",
          transition: "all 0.2s ease-in-out",
        }}
      >
        ×
      </Button>
    </div>
  );
};

export default TodoItem;