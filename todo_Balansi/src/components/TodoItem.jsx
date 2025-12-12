import React from "react";

const TodoItem = ({ item = {}, onToggle = () => {} }) => {
  const { description, completed } = item;

  const containerStyle = {
    backgroundColor: "#F7F7F7",
    borderRadius: 14,
    padding: "10px 12px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    boxShadow: "0 6px 18px rgba(133,72,54,0.06)",
  };

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "100%",
    cursor: "pointer",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    color: "#000000",
  };

  const checkboxWrapperStyle = {
    position: "relative",
    width: 22,
    height: 22,
    flex: "0 0 22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const hiddenInputStyle = {
    position: "absolute",
    width: 22,
    height: 22,
    margin: 0,
    padding: 0,
    opacity: 0,
    cursor: "pointer",
    zIndex: 2,
  };

  const boxStyle = {
    width: 22,
    height: 22,
    borderRadius: 6,
    border: `1px solid rgba(133,72,54,0.12)`,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: completed ? "#FFB22C" : "#ffffff",
    boxShadow: completed ? "0 6px 12px rgba(255,178,44,0.18)" : "inset 0 1px 2px rgba(133,72,54,0.03)",
    transition: "all 180ms ease",
    zIndex: 1,
  };

  const textStyle = {
    color: "#000000",
    textDecoration: completed ? "line-through" : "none",
    fontWeight: 600,
    fontSize: 15,
    flex: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const checkSvg = (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <path d="M1 5L5 9L13 1" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div style={containerStyle}>
      <label style={labelStyle}>
        <div style={checkboxWrapperStyle}>
          <input
            type="checkbox"
            checked={!!completed}
            onChange={onToggle}
            style={hiddenInputStyle}
          />
          <div style={boxStyle}>
            {completed ? checkSvg : null}
          </div>
        </div>
        <span style={textStyle}>{description}</span>
      </label>
    </div>
  );
};

export default TodoItem;