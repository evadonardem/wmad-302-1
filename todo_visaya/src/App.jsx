import { useState } from "react";
import { Button, Card, Collapse, Container } from "react-bootstrap";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

function App() {
  const [list, setList] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const addTodoItem = (item) => {
    setList([...list, item]);
    setHistory([...history, { ...item, action: "Added", time: new Date() }]);
  };

  const toggleTodoItem = (idx) => {
    const updatedList = list.map((item, i) =>
      i === idx ? { ...item, completed: !item.completed } : item
    );
    setList(updatedList);

    const toggled = list[idx];
    setHistory([
      ...history,
      { 
        ...toggled, 
        action: toggled.completed ? "Marked Incomplete" : "Completed", 
        time: new Date() 
      }
    ]);
  };

  const removeTodoItem = (idx) => {
    const removed = list[idx];
    setList(list.filter((_, i) => i !== idx));
    setHistory([...history, { ...removed, action: "Removed", time: new Date() }]);
  };

  const getHistoryColor = (action) => {
    switch(action) {
      case "Completed": return "green";
      case "Marked Incomplete": return "orange";
      case "Removed": return "red";
      default: return "black";
    }
  };

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: "2rem 0" }}>
      <Container style={{ maxWidth: "800px" }}>
        <Card className="shadow-sm">
          <Card.Body>
            <TodoList list={list} onToggle={toggleTodoItem} onRemove={removeTodoItem} />
            <hr className="my-4" />
            <TodoForm onAddTodoItem={addTodoItem} />
            <hr className="my-4" />
            <div className="text-center mb-2">
              <Button variant="secondary" onClick={() => setShowHistory(!showHistory)}>
                {showHistory ? "Hide Task History" : "Show Task History"}
              </Button>
            </div>

            <Collapse in={showHistory}>
              <div className="mt-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
                {history.length === 0 ? (
                  <p className="text-muted text-center">No history yet.</p>
                ) : (
                  history.map((h, i) => (
                    <div key={i} className="mb-2">
                      <strong style={{ color: getHistoryColor(h.action) }}>{h.action}</strong>: {h.description}
                      <span className="text-muted" style={{ fontSize: "0.85rem", marginLeft: "0.5rem" }}>
                        ({h.time.toLocaleTimeString()})
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Collapse>

          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default App;