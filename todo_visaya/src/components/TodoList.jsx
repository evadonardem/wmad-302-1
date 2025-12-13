import { Alert } from "react-bootstrap";
import TodoItem from "./TodoItem";

const TodoList = ({ list = [], onToggle, onRemove }) => {
  if (!list.length) {
    return (
      <Alert variant="info" className="text-center">
        <Alert.Heading>Don't be Lazy!💤</Alert.Heading>
        <p className="mb-0">Add some tasks to your list.</p>
      </Alert>
    );
  }

  return (
    <div className="mb-3">
      {list.map((x, i) => (
        <TodoItem key={i} item={x} onToggle={() => onToggle(i)} onRemove={() => onRemove(i)} />
      ))}
    </div>
  );
};

export default TodoList;
