import { Alert, ListGroup } from "react-bootstrap";
import TodoItem from "./TodoItem";
const TodoList = ({
    list=[],
    onDeleteItem,
    onToggleItem
}) => {
    if (list.length === 0){
        return <Alert variant="dark" className="text-center" 
        style={{ 
                backgroundColor: '#262626', 
                borderColor: '#ff6b00',
                color: '#ff0000ff',
                fontFamily: 'cursive',
                fontSize: '1.2rem'
        }}>
                You're too lazy, get a life!!!</Alert>
    }
    return (
        <ListGroup variant="flush" className="mb-3">
            {list.map((item) => 
                <TodoItem 
                    key={item.id} 
                    item={item}
                    onDelete={() => onDeleteItem(item.id)}
                    onToggle={() => onToggleItem(item.id)}
                />)}
        </ListGroup>
    );
};

export default TodoList;