import { useState } from "react";
import { Card, Container, Row, Col, Badge } from "react-bootstrap";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";

function App() {
  const [todos, setTodos] = useState([]);

  const handleAddTodoItem = (item) => {
    if (!item.description.trim()) return;
    setTodos([...todos, item]);
  };

  const handleToggle = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const handleDelete = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const pendingTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  return (
    <>
      {/* 🎨 Inline CSS Style Block */}
      <style>{`
        body {
          background: linear-gradient(to right, #dfe9f3 0%, #ffffff 100%);
          font-family: 'Poppins', sans-serif;
          margin: 0;
          padding: 0;
        }
        .card {
          border: none !important;
          border-radius: 20px !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover {
          transform: scale(1.01);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
        }
        h5 {
          font-weight: 600;
          margin-bottom: 15px;
        }
        .list-group-item {
          border-radius: 10px !important;
          margin-bottom: 10px;
          border: none !important;
          background-color: #fdfdfd !important;
          transition: 0.3s ease;
        }
        .list-group-item:hover {
          background-color: #e7f3ff !important;
          transform: translateX(3px);
        }
        button.btn-outline-danger {
          border-radius: 50%;
          padding: 5px 8px;
        }
        button.btn-outline-danger:hover {
          background-color: #ff6666;
          color: white;
        }
        .todo-priority-high {
          background-color: #ff4b5c !important;
          color: white !important;
        }
        .todo-priority-medium {
          background-color: #ffcc00 !important;
          color: #333 !important;
        }
        .todo-priority-low {
          background-color: #7fd18b !important;
          color: white !important;
        }
        .todo-input {
          border-radius: 10px !important;
        }
        hr {
          border-top: 2px solid rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <Container
        fluid
        className="d-flex align-items-center justify-content-center min-vh-100"
      >
        <Card
          style={{
            width: "80%",
            maxWidth: "900px",
            padding: "20px",
            borderRadius: "20px",
          }}
        >
          <Card.Body>
            <Card.Title className="text-center mb-3 fs-3 fw-bold text-primary">
              My Tasks for the Day
            </Card.Title>

            <p className="text-center text-muted">
              You have{" "}
              <Badge bg="warning" text="dark">
                {pendingTodos.length}
              </Badge>{" "}
              pending and{" "}
              <Badge bg="success">{completedTodos.length}</Badge> completed tasks.
            </p>

            <hr />
            <Row>
              <Col md={6}>
                <h5 className="text-warning">Pending Tasks</h5>
                <TodoList
                  list={pendingTodos}
                  onToggle={(i) => handleToggle(todos.indexOf(pendingTodos[i]))}
                  onDelete={(i) => handleDelete(todos.indexOf(pendingTodos[i]))}
                />
              </Col>
              <Col md={6}>
                <h5 className="text-success">Completed Tasks</h5>
                <TodoList
                  list={completedTodos}
                  onToggle={(i) => handleToggle(todos.indexOf(completedTodos[i]))}
                  onDelete={(i) => handleDelete(todos.indexOf(completedTodos[i]))}
                />
              </Col>
            </Row>
            <hr />
            <TodoForm onAddTodoItem={handleAddTodoItem} />
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default App;
