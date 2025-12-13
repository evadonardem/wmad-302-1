import React, { useEffect, useState } from "react";
import { Card, Container } from "react-bootstrap";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";

function App() {
  const [list, setList] = useState(() => {
    try {
      const raw = localStorage.getItem("todos:v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("todos:v1", JSON.stringify(list));
  }, [list]);

  const addTodoItemHandler = (item) => {
    setList((prev) => [...prev, item]);
  };

  const toggleTodo = (id) => {
    setList((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const removeTodo = (id) => {
    setList((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", background: "#f6f7f9", padding: 24 }}>
      <Card style={{ width: 720 }} className="shadow-sm">
        <Card.Body>
          <Card.Title className="mb-3">Daily Tasks</Card.Title>
          <TodoList list={list} onToggle={toggleTodo} onRemove={removeTodo} />
          <hr />
          <TodoForm onAddTodoItem={addTodoItemHandler} />
        </Card.Body>
      </Card>
    </Container>
  );
}

export default App;