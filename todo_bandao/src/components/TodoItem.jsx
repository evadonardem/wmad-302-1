import { Form } from "react-bootstrap";

const TodoItem = ({ item = {}, onToggle }) => {
  const { description, completed } = item;

  return (
    <Form.Check
      label={description}
      checked={completed}
      onChange={onToggle}
      type="checkbox"
    />
  );
};

export default TodoItem;
