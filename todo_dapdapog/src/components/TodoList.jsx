import React from "react";
import TodoItem from "./TodoItem";
import { Badge, Card } from "react-bootstrap";

const TodoList = ({ list = [], onToggle = () => {}, onRemove = () => {} }) => {
  const total = list.length;
  const completed = list.filter((t) => t.completed).length;

  if (!total) {
    return (
      <Card className="text-center border-0">
        <Card.Body className="text-muted py-3">No tasks yet — add your first todo below.</Card.Body>
      </Card>
    );
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div>
          <strong>Tasks</strong>
        </div>
        <div>
          <Badge bg="secondary" className="me-2">{total} total</Badge>
          <Badge bg={completed === total ? "success" : "info"}>{completed} done</Badge>
        </div>
      </div>
      <div className="list-group">
        {list.map((it) => (
          <div key={it.id} className="list-group-item">
            <TodoItem item={it} onToggle={onToggle} onRemove={onRemove} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;