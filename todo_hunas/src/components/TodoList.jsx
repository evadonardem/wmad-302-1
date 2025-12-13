import { Alert, Card } from "react-bootstrap";
import TodoItem from "./TodoItem";

const TodoList = ({ list = [], onToggle, onRemove }) => {
  if (!list.length) {
    return (
      <Alert
        variant="info"
        className="text-center shadow-sm rounded-4 py-4 mt-3 border-0"
      >
        <Alert.Heading className="fw-bold text-primary">
          Don't be Lazy! 💤
        </Alert.Heading>
        <p className="mb-0 text-muted">Add some tasks to your list.</p>
      </Alert>
    );
  }

  return (
    <Card className="shadow-sm border-0 rounded-4 mt-3">
      <Card.Body className="p-3">
        {list.map((x, i) => (
          <TodoItem
            key={i}
            item={x}
            onToggle={() => onToggle(i)}
            onRemove={() => onRemove(i)}
          />
        ))}
      </Card.Body>
    </Card>
  );
};

export default TodoList;