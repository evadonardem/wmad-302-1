import { Alert } from "react-bootstrap";
import TodoItem from "./TodoItem";

const TodoList = ({ list = [], onToggle = () => {} }) => {
  if (list.length === 0) {
    return (
      <Alert
        variant="light"
        style={{
          backgroundColor: "#ffe4e1",
          color: "#8b0000",
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        You're lazy today!!!
      </Alert>
    );
  }

  return (
    <>
      {list.map((item, index) => (
        <TodoItem key={index} item={item} onToggle={() => onToggle(index)} />
      ))}
    </>
  );
};

export default TodoList;
