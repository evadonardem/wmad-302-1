import React from "react";
import { Button, Form } from "react-bootstrap";

const TodoItem = ({ item, onToggle = () => {}, onRemove = () => {} }) => {
  return (
    <div className="d-flex align-items-center justify-content-between py-2">
      <div className="d-flex align-items-center" style={{ gap: 12, flex: 1 }}>
        <Form.Check
          type="checkbox"
          checked={!!item.completed}
          onChange={() => onToggle(item.id)}
          aria-label={`Toggle ${item.description}`}
        />
        <div style={{ flex: 1 }}>
          <div style={{ textDecoration: item.completed ? "line-through" : "none", fontWeight: 500 }}>
            {item.description}
          </div>
          <div className="text-muted" style={{ fontSize: 12 }}>
            {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
          </div>
        </div>
      </div>
      <Button variant="outline-danger" size="sm" onClick={() => onRemove(item.id)}>
        Delete
      </Button>
    </div>
  );
};

export default TodoItem;