import { Alert } from "react-bootstrap";
import TodoItem from "./TodoItem";

const TodoList = ({ list = [], onToggle = () => {} }) => {
  if (list.length === 0) {
    return <Alert variant="danger">You're too lazy today!!!</Alert>;
  }

  return (
    <>
      {list.map((item, index) => (
        <TodoItem
          key={index}
          item={item}
          onToggle={() => onToggle(index)}
        />
      ))}
    </>
  );
};

export default TodoList;
