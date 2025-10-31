import { ListGroup } from 'react-bootstrap';

// It receives a single todo object as a prop
const TodoItem = ({ todo }) => { 
  return (
    <ListGroup.Item
      className="d-flex justify-content-between align-items-center"
      
      style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
    >
      {todo.text}
    </ListGroup.Item>
  );
};

export default TodoItem;