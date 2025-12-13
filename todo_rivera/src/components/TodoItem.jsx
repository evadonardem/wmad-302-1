import { Form } from "react-bootstrap";

const TodoItem = ({
    item = {},
    onToggle
}) => {
    const {description, completed} = item;

    const handleChange = () => {
        if (onToggle) {
            onToggle(item);
        }
    };

    return (
        <div className="mb-2">
            <Form.Check
                type="checkbox"
                id={`todo-${description}`}
                label={description}
                checked={completed}
                onChange={handleChange}
                className={`${completed ? 'text-muted text-decoration-line-through' : ''}`}
                style={{ fontSize: '1.1rem' }}
            />
        </div>
    );
};
export default TodoItem;