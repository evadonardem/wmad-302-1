import { Card, Container } from "react-bootstrap"
import { useState } from "react"
import TodoList from "./components/TodoList"
import TodoForm from "./components/TodoForm"
import { useEffect } from "react"

function App() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Creepster&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    document.body.style.backgroundColor = '#1a1a1a';
  }, []);
  const [list, setList] = useState([]);
  
  const addTodoItemHandler = (item) => {
    const newItem = {
      ...item,
      id: Date.now()
    };
    setList([...list, newItem]);
  };

  const deleteTodoItemHandler = (itemId) => {
    setList(list.filter(item => item.id !== itemId));
  };

  const toggleTodoItemHandler = (itemId) => {
    setList(list.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
  };

  return (
    <>
      <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center" style={{
        backgroundColor: '#2d1b1b'
      }}>
        <Card className="shadow" style={{ 
          flex: 1, 
          width: "80%", 
          maxWidth: 600,
          backgroundColor: '#1a1a1a',
          border: '1px solid #ff6b00'
        }}>
          <Card.Body className="text-light">
            <Card.Title className="mb-3 text-center" style={{ 
              fontFamily: 'Creepster, cursive',
              fontSize: '2rem',
              color: '#ff6b00'
            }}>🎃 Todo List</Card.Title>
            <hr style={{ borderColor: '#ff6b00', opacity: 0.5 }}/>
            <TodoList 
              list={list} 
              onDeleteItem={deleteTodoItemHandler}
              onToggleItem={toggleTodoItemHandler}
            />
            <hr style={{ borderColor: '#ff6b00', opacity: 0.5 }}/>
            <TodoForm onAddTodoItem={addTodoItemHandler} />
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

export default App
