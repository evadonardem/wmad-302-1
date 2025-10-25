import { Form } from "react-bootstrap";

const TodoItem = ({ item = {}, onToggle = () => {} }) => {
  const { description, completed } = item;

  return (
    <div className="mb-2">
      <Form.Check
        type="checkbox"
        label={description}
        checked={completed}
        onChange={onToggle}
      />
    </div>
  );
};

export default TodoItem;