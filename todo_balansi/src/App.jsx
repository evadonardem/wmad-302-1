import { useState } from "react";
import { Container } from "react-bootstrap";
import TodoForm from "./components/TodoForm.jsx";
import TodoList from "./components/TodoList.jsx";

const App = () => {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = (item) => {
    if (!item.description.trim()) return;
    setTodos([...todos, item]);
  };

  const handleToggle = (index) => {
    const updated = [...todos];
    updated[index].completed = !updated[index].completed;
    setTodos(updated);
  };

  return (
    <Container
      className="mt-4"
      style={{
        backgroundColor: "#F7F7F7",
        minHeight: "100vh",
        padding: "32px",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 820,
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: 20,
          padding: "28px",
          boxShadow: "0 12px 30px rgba(133,72,54,0.12)",
          border: "1px solid rgba(133,72,54,0.16)",
        }}
      >
        <h3
          style={{
            color: "#000000",
            textAlign: "center",
            marginBottom: "18px",
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: 0.3,
          }}
        >
          Tasks for the Day
        </h3>

        <TodoList list={todos} onToggle={handleToggle} />

        <hr style={{ border: "none", height: 1, background: "#854836", opacity: 0.12, margin: "26px 0" }} />

        <TodoForm onAddTodoItem={handleAddTodo} list={todos} onToggle={handleToggle} />
      </div>
    </Container>
  );
};

export default App;