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
    <Container className="mt-4">
      <TodoList list={todos} onToggle={handleToggle} />
      <br />
      <TodoForm onAddTodoItem={handleAddTodo} />
    </Container>
  );
};

export default App;
