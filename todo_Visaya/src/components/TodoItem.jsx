import { Button, Form } from "react-bootstrap";

const TodoItem = ({ item = {}, onToggle, onRemove }) => {
  const { description, completed } = item;

  return (
    <div className="d-flex align-items-center mb-2">
      <Form.Check
        type="checkbox"
        id={`todo-${description}`}
        label={description}
        checked={completed}
        onChange={onToggle}
        className={`${completed ? 'text-muted text-decoration-line-through' : ''}`}
        style={{ fontSize: '1.1rem', flex: 1 }}
      />
      <Button variant="outline-danger" size="sm" onClick={onRemove}>
        x
      </Button>
    </div>
  );
};

export default TodoItem;
