import React, { useState } from "react";
import axios from "axios";

function ChatBox() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        userMessage: input,
      });
      setResponse(res.data.reply);
    } catch (error) {
      setResponse("⚠️ Something went wrong. Please try again later.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>⚖️ Ask a Legal Question</h2>

      <textarea
        rows="5"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="E.g. What is the punishment for theft?"
        style={styles.textarea}
      />

      <button onClick={handleSend} style={styles.button}>
        🚀 Ask the Lawyer AI
      </button>

      {response && (
        <div style={styles.responseBox}>
          <h3 style={styles.responseHeading}>💡 AI Reply</h3>
          <div style={styles.responseScroll}>
            <pre style={styles.responseText}>{response}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    margin: "40px auto",
    padding: "30px",
    borderRadius: "20px",
    background: "#ffffff",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    fontFamily: "'Segoe UI', sans-serif",
  },
  heading: {
    fontSize: "26px",
    marginBottom: "20px",
    color: "#222",
    textAlign: "center",
  },
  textarea: {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    outline: "none",
    marginBottom: "20px",
    resize: "vertical",
    minHeight: "100px",
  },
  button: {
    backgroundColor: "#0066cc",
    color: "#fff",
    padding: "12px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    display: "block",
    margin: "0 auto 30px",
  },
  responseBox: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    whiteSpace: "pre-wrap",
  },
  responseHeading: {
    margin: "0 0 12px 0",
    fontSize: "20px",
    color: "#222",
    borderBottom: "1px solid #ddd",
    paddingBottom: "8px",
  },
  responseScroll: {
    maxHeight: "400px",
    overflowY: "auto",
    paddingRight: "10px",
  },
  responseText: {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#333",
    fontFamily: "monospace",
    backgroundColor: "#fefefe",
    padding: "10px",
    borderRadius: "8px",
    whiteSpace: "pre-wrap",
  },
};

export default ChatBox;
