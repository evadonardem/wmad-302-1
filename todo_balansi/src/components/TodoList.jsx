import { Alert } from "react-bootstrap";
import TodoItem from "./TodoItem";

const TodoList = ({ list = [], onToggle = () => {} }) => {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    padding: 8,
    backgroundColor: "transparent",
  };

  const emptyAlertStyle = {
    backgroundColor: "#F7F7F7",
    color: "#000000",
    fontWeight: 600,
    textAlign: "center",
    borderRadius: 12,
    border: "1px solid rgba(255,178,44,0.18)",
    boxShadow: "0 6px 18px rgba(133,72,54,0.08)",
    padding: "14px 16px",
  };

  if (list.length === 0) {
    return (
      <Alert variant="light" style={emptyAlertStyle}>
        Focus on what matters today.
      </Alert>
    );
  }

  return (
    <div style={containerStyle}>
      {list.map((item, index) => (
        <TodoItem key={index} item={item} onToggle={() => onToggle(index)} />
      ))}
    </div>
  );
};

export default TodoList;