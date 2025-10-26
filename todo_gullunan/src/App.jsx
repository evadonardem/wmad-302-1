import { Card, Container, Row, Col } from "react-bootstrap";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";
import { useState } from "react";

function App() {
  const [list, setList] = useState([]);

  // ✅ Add new todo item
  const addTodoItemHandler = (item) => {
    setList([...list, item]);
  };

  // ✅ Toggle completion status
  const toggleTodoItemHandler = (idx) => {
    setList((list) =>
      list.map((item, i) =>
        i === idx ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // ✅ Clear all completed tasks
  const clearCompletedHandler = () => {
    setList((prevList) => prevList.filter((item) => !item.completed));
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #559dfcff, #f3e8ff, #fef9c3)",
        backgroundAttachment: "fixed",
      }}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={11} sm={8} md={6} lg={5}>
          <Card
            className="shadow-lg rounded-4 border-0"
            style={{
              backgroundColor: "rgba(255, 255, 255, 1)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Card.Body className="p-4">
             <Card.Title
              className="text-center fw-bold fs-3 mb-3 text-primary"
              style={{
                color: "#4f46e5",
                textShadow: "0 0 8px rgba(99,102,241,0.3)",
                fontFamily: "'Poppins', sans-serif",
              }}  
            >
              🌤️ My Tasks for the Day! ✨
            </Card.Title>

              <hr />
              <TodoList
                list={list}
                onToggle={toggleTodoItemHandler}
                onClearCompleted={clearCompletedHandler}
              />
              <hr />
              <TodoForm onAddTodoItem={addTodoItemHandler} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
