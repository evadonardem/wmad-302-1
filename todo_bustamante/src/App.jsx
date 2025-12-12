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
        backgroundColor: "#fffaf0", // cream background
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#fefcf6",
          border: "2px solid #8b0000",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 4px 10px rgba(139, 0, 0, 0.15)",
        }}
      >
        <h3
          style={{
            color: "#8b0000",
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          Tasks for the Day
        </h3>

        <TodoList list={todos} onToggle={handleToggle} />

        <hr style={{ border: "1px solid #8b0000", margin: "25px 0" }} />

        <TodoForm onAddTodoItem={handleAddTodo} list={todos} onToggle={handleToggle} />
      </div>
    </Container>
  );
};

export default App;
