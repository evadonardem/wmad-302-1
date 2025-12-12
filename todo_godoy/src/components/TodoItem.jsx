import {Form} from "react-bootstrap";

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
        <>
        <Form.Check label={description} checked={completed} onChange={handleChange} />
        </>
    );
};
export default TodoItem;