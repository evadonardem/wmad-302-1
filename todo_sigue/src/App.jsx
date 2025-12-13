import { useState } from 'react';
import { Card, Container } from "react-bootstrap";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

function App() {
  const [todos, setTodos] = useState([]);


  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
    };
    
    setTodos([...todos, newTodo]); 
  };

  return (
    <Container style={{ alignItems: "center", display: "flex", height: "100vh", flexDirection: "column", paddingTop: "50px" }}>
      <Card style={{ width: "90%", maxWidth: "500px" }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">My Tasks for the Day</Card.Title>
          
          { }
          <TodoForm addTodo={addTodo} />
          
          <hr />

          { }
          <TodoList todos={todos} />

        </Card.Body>
      </Card>
    </Container>
  );
}

export default App;