import { useState } from "react";
import { Button, Card, FloatingLabel, FormControl } from "react-bootstrap";

const TodoForm = ({     
    onAddTodoItem = () => false,
}) => {
    const [item, setItem] = useState({
        description:"",
        completed: false,
    });

    return (
        <Card className="shadow-sm">
            <Card.Body>
                <Card.Title className="text-primary mb-3">Add New Task</Card.Title>
                <Card.Text className="text-muted mb-4">
                "The finest work you will ever do is on yourself. Make time each day for your well-being, your personal development, and the mastery of a new technical skill."
                </Card.Text>
                <FloatingLabel label="New Task">
                    <FormControl 
                        placeholder="Enter your task"
                        value={item.description}
                        onChange={(e) => {
                            setItem({
                                ...item,
                                description: e.target.value,
                            })
                        }}
                    />
                </FloatingLabel>
                <div className="d-grid gap-2 mt-4">
                    <Button 
                        variant="primary"
                        size="lg"
                        onClick={() => {
                            if (item.description.trim()) {
                                onAddTodoItem(item);
                                setItem({ description: "", completed: false });
                            }
                        }}
                    >
                        ➕ Add Task
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );

};

export default TodoForm;
