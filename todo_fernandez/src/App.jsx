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
      <Container style={{ maxWidth: "800px", marginTop: "2rem" }}>
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title className="text-center mb-4" style={{ fontSize: "1.8rem", color: "#2c3e50" }}>
              📝 My Tasks for the Day
            </Card.Title>
            <TodoList list={list} onToggle={toggleTodoItemHandler} />
            <hr className="my-4"/>
            <TodoForm onAddTodoItem={addTodoItemHandler} />
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

export default App