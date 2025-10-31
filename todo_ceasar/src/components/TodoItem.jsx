import { ListGroup, Form, Button } from "react-bootstrap";
const TodoItem = ({
    item = {},
    onDelete,
    onToggle
}) => {
    const {description, completed}=item;
    return (
       <ListGroup.Item 
         style={{
           position: 'relative',
           backgroundColor: '#262626',
           border: '1px solid #444',
           margin: '4px 0',
           borderRadius: '4px',
           padding: '8px',
           transition: 'background-color 0.2s'
         }}
       >
         <Form.Check
           label={description}
           aria-label={description}
           checked={completed}
           onChange={onToggle}
           style={{
             color: completed ? '#666' : '#fff',
             textDecoration: completed ? 'line-through' : 'none',
             '& input[type="checkbox"]': {
               borderColor: '#ff6b00'
             },
             '& input[type="checkbox"]:checked': {
               backgroundColor: '#ff6b00',
               borderColor: '#ff6b00'
             }
           }}
         />
         <Button 
           onClick={onDelete}
           variant="danger"
           size="sm"
           style={{
             position: 'absolute',
             right: '8px',
             top: '50%',
             transform: 'translateY(-50%)',
             backgroundColor: '#ff4d4d',
             border: 'none',
             padding: '4px 8px',
             opacity: 0.8
           }}
         >
           ×
         </Button>
       </ListGroup.Item>
    );
};

export default TodoItem;