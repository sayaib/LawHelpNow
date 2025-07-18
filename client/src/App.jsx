import React, { useState } from "react";
import axios from "axios";

const TABS = [
  "Indian Law Assistant",
  "Contract Explainer",
  "Case Law Finder",
  "Bail Eligibility Checker",
];

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [input, setInput] = useState("");
  const [pdf, setPdf] = useState(null);
  const [response, setResponse] = useState("");

  const handleSend = async () => {
    setResponse("Loading...");
    try {
      if (activeTab === "Contract Explainer") {
        const formData = new FormData();
        formData.append("pdf", pdf);
        const res = await axios.post("/api/explain-pdf", formData);
        setResponse(res.data.reply);
      } else {
        const res = await axios.post("/api/chat", {
          query: input,
          type: activeTab,
        });
        setResponse(res.data.reply);
      }
    } catch (err) {
      setResponse("❌ Something went wrong.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚖️ Indian Law Legal Tools</h1>

      <div style={styles.tabRow}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setInput("");
              setResponse("");
              setPdf(null);
            }}
            style={{
              ...styles.tabButton,
              backgroundColor: tab === activeTab ? "#0a74da" : "#eee",
              color: tab === activeTab ? "#fff" : "#000",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={styles.box}>
        {activeTab === "Contract Explainer" ? (
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setPdf(e.target.files[0])}
          />
        ) : (
          <textarea
            rows="6"
            placeholder="Type your legal query..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={styles.textarea}
          />
        )}

        <button onClick={handleSend} style={styles.button}>
          Submit
        </button>

        {response && (
          <div style={styles.responseBox}>
            <h3>🧾 Result:</h3>
            <pre style={{ whiteSpace: "pre-wrap" }}>{response}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    fontFamily: "sans-serif",
    maxWidth: "800px",
    margin: "auto",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  tabRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "10px",
  },
  tabButton: {
    flex: "1",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  box: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fafafa",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#0a74da",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "10px",
  },
  responseBox: {
    backgroundColor: "#f2f2f2",
    padding: "15px",
    borderRadius: "8px",
    whiteSpace: "pre-wrap",
  },
};
