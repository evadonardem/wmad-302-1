import { Alert } from "react-bootstrap";
import TodoItem from "./TodoItem";  

const TodoList = ({
    list =[],
    onToggle
}) => {
    
    if (list.length === 0) {
        return (
            <Alert variant="info" className="text-center">
                <Alert.Heading>No tasks yet! 📝</Alert.Heading>
                <p className="mb-0">Add some tasks to get started with your day! Don't be Lazy!!</p>
            </Alert>
        );
    }

    return (
        <div className="mb-3">
            {list.map((x, i) => (
                <TodoItem key={i} item={x} onToggle={() => onToggle(i)} />
            ))}
        </div>
    );
};

export default TodoList;