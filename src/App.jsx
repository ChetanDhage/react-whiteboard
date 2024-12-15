import React, { useState } from "react";
import Draggable from "react-draggable";

const Whiteboard = () => {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const saveHistory = () => {
    setHistory((prev) => [...prev, elements]);
    setRedoStack([]); // Clear redo stack on any new change
  };

  const addTextElement = () => {
    saveHistory();
    const newElement = {
      id: Date.now(),
      text: "New Text",
      x: 100,
      y: 100,
      fontSize: 16,
      fontStyle: "normal",
      fontWeight: "normal",
    };
    setElements((prev) => [...prev, newElement]);
    setSelectedElement(newElement.id);
  };

  const moveElement = (id, x, y) => {
    saveHistory();
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x, y } : el))
    );
  };

  const updateStyle = (property, value) => {
    saveHistory();
    setElements((prev) =>
      prev.map((el) =>
        el.id === selectedElement ? { ...el, [property]: value } : el
      )
    );
  };

  const handleElementClick = (id) => {
    setSelectedElement(id);
  };

  const updateText = (id, value) => {
    saveHistory();
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, text: value } : el))
    );
  };

  const undo = () => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setRedoStack((prev) => [elements, ...prev]);
    setElements(previousState);
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setSelectedElement(null);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[0];
    setHistory((prev) => [...prev, elements]);
    setElements(nextState);
    setRedoStack((prev) => prev.slice(1));
    setSelectedElement(null);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ marginBottom: "10px", textAlign: "center" }}>
        <button onClick={addTextElement} style={buttonStyle}>
          Add Text
        </button>
        <button onClick={undo} style={{ ...buttonStyle, marginLeft: "10px" }}>
          Undo
        </button>
        <button onClick={redo} style={{ ...buttonStyle, marginLeft: "10px" }}>
          Redo
        </button>
      </div>
      <div
        style={{
          border: "1px solid black",
          height: "500px",
          width: "800px",
          margin: "0 auto",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
        }}
      >
        {elements.map((el) => (
          <Draggable
            key={el.id}
            position={{ x: el.x, y: el.y }}
            onStop={(e, data) => moveElement(el.id, data.x, data.y)}
          >
            <div
              onClick={() => handleElementClick(el.id)}
              style={{
                position: "absolute",
                fontSize: el.fontSize,
                fontStyle: el.fontStyle,
                fontWeight: el.fontWeight,
                padding: "5px",
                border: selectedElement === el.id ? "2px solid blue" : "1px dashed gray",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              {selectedElement === el.id ? (
                <input
                  type="text"
                  value={el.text}
                  onChange={(e) => updateText(el.id, e.target.value)}
                  style={{
                    fontSize: el.fontSize,
                    fontStyle: el.fontStyle,
                    fontWeight: el.fontWeight,
                    border: "none",
                    background: "transparent",
                    width: "100%",
                    outline: "none",
                  }}
                  autoFocus
                />
              ) : (
                el.text
              )}
            </div>
          </Draggable>
        ))}
      </div>
      <div style={controlsContainer}>
        {selectedElement && (
          <>
            <div style={controlItem}>
              <label>
                Font Size:{" "}
                <input
                  type="number"
                  min="8"
                  max="72"
                  onChange={(e) => updateStyle("fontSize", parseInt(e.target.value, 10))}
                  placeholder="16"
                  style={inputStyle}
                />
              </label>
            </div>
            <div style={controlItem}>
              <label>
                Font Style:{" "}
                <select
                  onChange={(e) => updateStyle("fontStyle", e.target.value)}
                  style={inputStyle}
                >
                  <option value="normal">Normal</option>
                  <option value="italic">Italic</option>
                </select>
              </label>
            </div>
            <div style={controlItem}>
              <label>
                Font Weight:{" "}
                <select
                  onChange={(e) => updateStyle("fontWeight", e.target.value)}
                  style={inputStyle}
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                </select>
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  border: "1px solid #ccc",
  borderRadius: "4px",
  backgroundColor: "#007BFF",
  color: "white",
  marginBottom: "10px",
};

const controlsContainer = {
  display: "flex",
  justifyContent: "center",
  gap: "20px",
  marginTop: "20px",
  flexWrap: "wrap",
};

const controlItem = {
  textAlign: "center",
};

const inputStyle = {
  padding: "5px",
  fontSize: "14px",
  border: "1px solid #ccc",
  borderRadius: "4px",
};

export default Whiteboard;
