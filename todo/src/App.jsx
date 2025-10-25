import { Card, Container } from "react-bootstrap"
import TodoList from "./components/TodoList"
import TodoForm from "./components/TodoForm"

function App() {
  return (
    <>
      <Container style={{ alignItems: "center", display: "flex", height: "100vh" }}>
        <Card style={{ flex: 1, width: "80%"}}>
          <Card.Body>
            <Card.Title>My Tasks for the Day</Card.Title>
            <hr/>
            <TodoList />
            <hr/>
            <TodoForm />
          </Card.Body>
        </Card>

      </Container>
    </>
  )
}

export default App
