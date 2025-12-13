import { useState, useRef } from "react";
import { Button, Card, Form, FormControl } from "react-bootstrap";

const TodoForm = ({ onAddTodoItem = () => false }) => {
    const [item, setItem] = useState({
        description: "",
        completed: false,
    });

    const [focused, setFocused] = useState(false);
    const inputRef = useRef(null);

    const labelStyle = {
        color: '#fff',
        transition: 'text-shadow 200ms ease',
        textShadow: focused ? '0 0 10px #ff6b00, 0 0 20px rgba(255,107,0,0.6)' : 'none'
    };

    const inputStyle = {
        backgroundColor: '#333',
        color: '#fff',
        border: '1px solid #ff6b00',
        transition: 'box-shadow 200ms ease, border-color 200ms ease',
        boxShadow: focused ? '0 0 8px rgba(255,107,0,0.45)' : 'none'
    };

    return (
        <Card style={{ 
                backgroundColor: "#262626",
                border: 'none',
                borderRadius: '8px',
            }}>
            <Card.Body>
                <Card.Title style={{ 
                    color: '#ff6b00',
                    marginBottom: '15px'
                }}>Add New Task 🎃</Card.Title>
                <Form.Group controlId="todoInput">
                    <Form.Label
                        style={{ ...labelStyle, cursor: 'text', marginBottom: '6px',color: '#ff6b00' }}
                        onClick={() => inputRef.current && inputRef.current.focus()}
                    >
                        Enter your task(Training, Personal Development, Work, etc.)
                    </Form.Label>
                    <FormControl
                        ref={inputRef}
                        style={inputStyle}
                        value={item.description}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        onChange={(e) => {
                            setItem({
                                ...item,
                                description: e.target.value,
                            });
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                if (item.description.trim() !== "") {
                                    onAddTodoItem(item);
                                    setItem({ ...item, description: "" });
                                }
                            }
                        }}
                    />
                </Form.Group>
                <br />
                <Button 
                    onClick={() => {
                        if (item.description.trim() !== "") {
                            onAddTodoItem(item);
                            setItem({ ...item, description: "" });
                        }
                    }}
                    style={{
                        backgroundColor: '#ff6b00',
                        border: 'none',
                        marginTop: '10px'
                    }}
                >
                    Add Task 🎃</Button>
            </Card.Body>
        </Card>
    );
};

export default TodoForm;