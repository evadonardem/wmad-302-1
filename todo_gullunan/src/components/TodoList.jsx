import { Alert, Card, ListGroup, Button } from "react-bootstrap";
import TodoItem from "./TodoItem";

const TodoList = ({ list = [], onToggle, onClearCompleted }) => {
  if (list.length === 0) {
    return (
      <Alert variant="danger" className="text-center fw-semibold">
        You're too lazy today!!! 😴 Add some tasks to get started.
      </Alert>
    );
  }

  // Map each task with its original index
  const tasksWithIndex = list.map((item, index) => ({ ...item, index }));

  // Separate pending and completed tasks
  const pendingTasks = tasksWithIndex.filter((task) => !task.completed);
  const completedTasks = tasksWithIndex.filter((task) => task.completed);

  return (
    <>
      {/* Pending Tasks */}
      <Card className="mb-3 shadow-sm border-0">
        <Card.Header className="bg-primary text-white fw-semibold">
          Pending Tasks!
        </Card.Header>
        <ListGroup variant="flush">
          {pendingTasks.length === 0 ? (
            <ListGroup.Item className="text-center text-muted">
              All tasks are completed! 🎉
            </ListGroup.Item>
          ) : (
            pendingTasks.map((task) => (
              <ListGroup.Item
                key={task.index}
                className="d-flex justify-content-between align-items-center"
              >
                <TodoItem
                  item={task}
                  onToggle={() => onToggle(task.index)}
                />
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      </Card>

      {/* Completed Tasks */}
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-success text-white fw-semibold d-flex justify-content-between align-items-center">
          <span>Completed Tasks</span>
          {/* Show button only if there are completed tasks */}
          {completedTasks.length > 0 && (
            <Button
              variant="light"
              size="sm"
              className="fw-semibold"
              onClick={onClearCompleted}
            >
              Clear All
            </Button>
          )}
        </Card.Header>
        <ListGroup variant="flush">
          {completedTasks.length === 0 ? (
            <ListGroup.Item className="text-center text-muted">
              No completed tasks yet.
            </ListGroup.Item>
          ) : (
            completedTasks.map((task) => (
              <ListGroup.Item
                key={task.index}
                className="d-flex justify-content-between align-items-center"
              >
                <TodoItem
                  item={task}
                  onToggle={() => onToggle(task.index)}
                />
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      </Card>
    </>
  );
};

export default TodoList;
