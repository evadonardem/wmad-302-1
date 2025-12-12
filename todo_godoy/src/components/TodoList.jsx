import { Alert } from "react-bootstrap";
import TodoItem from "./TodoItem";  

const TodoList = ({
    list =[],
    onToggle
}) => {
    
    if (list.length === 0) {
        return <Alert variant="danger">You're too lazy today!!!</Alert>;
    }

    return (
        <>
        {list.map((x, i) => <TodoItem key={i} item={x} onToggle={() => onToggle(i)} />)}
        </>
       
    );
};

export default TodoList;