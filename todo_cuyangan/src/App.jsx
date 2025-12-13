import { Card, Container, Button, Collapse, Badge } from "react-bootstrap";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";
import { useState } from "react";
import "./App.css";

function App() {

  const [list, setList] = useState([]);
  const [open, setOpen] = useState(true);

  const addTodoItemHandler = (item) => {
    if (item.description.trim() === "") return;
    setList([...list, item]);
  };

  const toggleTodoItemHandler = (idx) => {
    setList((list) =>
      list.map((item, i) =>
        i === idx ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const pendingTasks = list.filter((item) => !item.completed);
  const doneTasks = list.filter((item) => item.completed);
  const totalTasks = list.length;

  return (
    <Container
      style={{
        alignItems: "center",
        display: "flex",
        height: "100vh",
        justifyContent: "center",
      }}
    >
      <Card style={{ flex: 1, width: "80%" }}>
        <Card.Body>
          <Card.Title className="text-center mb-3">
            MY TASKS FOR THE DAY
          </Card.Title>
          <hr />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h5 style={{ color: "#007bff", margin: 0 }}>
              Pending Tasks{" "}
              <Badge bg="primary">{pendingTasks.length}</Badge>
            </h5>
            <span style={{ fontSize: "0.9rem", color: "#555" }}>
              Total Pending: {pendingTasks.length}
            </span>
          </div>
          <TodoList list={pendingTasks} onToggle={toggleTodoItemHandler} />

          <hr />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h5 style={{ color: "green", margin: 0 }}>
              Done Tasks <Badge bg="success">{doneTasks.length}</Badge>
            </h5>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "0.9rem", color: "#555" }}>
                Total Done: {doneTasks.length}
              </span>
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => setOpen(!open)}
                aria-controls="done-tasks-collapse"
                aria-expanded={open}
              >
                {open ? "Hide" : "Show"}
              </Button>
            </div>
          </div>

          <Collapse in={open}>
            <div id="done-tasks-collapse">
              <TodoList list={doneTasks} onToggle={toggleTodoItemHandler} />
            </div>
          </Collapse>

          <hr />
          <TodoForm onAddTodoItem={addTodoItemHandler} />
        </Card.Body>
      </Card>
    </Container>
  );
}

export default App;
