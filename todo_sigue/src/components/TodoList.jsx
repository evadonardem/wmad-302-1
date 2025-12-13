import ListGroup from 'react-bootstrap/ListGroup';
import TodoItem from './TodoItem';


const TodoList = ({ todos }) => { 
  return (
    <ListGroup className="mt-3">
      {
        
      }
      {todos.length === 0 ? (
        <p className="text-muted text-center p-3 mb-0">
        Enter your task in the box above!
        </p>
      ) : (
        todos.map((todo) => (

          <TodoItem
            key={todo.id}
            todo={todo}
          />
        ))
      )}
    </ListGroup>
  );
};

export default TodoList;