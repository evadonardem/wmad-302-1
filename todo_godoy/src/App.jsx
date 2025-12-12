import { Card, Container } from "react-bootstrap"
import TodoList from "./components/TodoList"
import TodoForm from "./components/TodoForm"
import { useState } from "react"

function App() {
  const[list, setlist] = useState([])

  const addTodoItemHandler = (item) => {
    setlist([
      ...list,
      item,
    ])
  };

  const toggleTodoItemHandler = (idx) => {
    setlist(list => list.map((item, i) =>
      i === idx ? { ...item, completed: !item.completed } : item
    ));
  };

  return (
    <>
      <Container style={{ alignItems: "center", display: "flex", height: "100vh" }}>
        <Card style={{ flex: 1, width: "80%"}}>
          <Card.Body>
            <Card.Title>My Tasks for the Day</Card.Title>
            <hr/>
            <TodoList list={list} onToggle={toggleTodoItemHandler} />
            <hr/>
            <TodoForm onAddTodoItem={addTodoItemHandler} />
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

export default App
