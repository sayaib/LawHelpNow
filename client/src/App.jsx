import React, { useState, useRef } from "react";
import axios from "axios";
import "./App.css";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

export default function App() {
  const [activeTab, setActiveTab] = useState("Indian Law Assistant");
  const [input, setInput] = useState("");
  const [pdf, setPdf] = useState(null);
  const [response, setResponse] = useState("");
  const [isListening, setIsListening] = useState(false);

  const handleSend = async () => {
    setResponse("⏳ Processing...");
    try {
      if (activeTab === "Contract Explainer") {
        const formData = new FormData();
        formData.append("pdf", pdf);
        const res = await axios.post("/api/explain-pdf", formData);
        setResponse(res.data.reply);
      } else {
        const res = await axios.post("http://localhost:5000/api/chat/", {
          query: input,
          type: activeTab,
        });
        setResponse(res.data.reply);
      }
    } catch (err) {
      console.log(err);
      setResponse("❌ Something went wrong.");
    }
  };

  const startListening = () => {
    if (!recognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }
    setIsListening(true);
    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => `${prev} ${transcript}`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-blue-800 mb-10">
          ⚖️ LawHelpNow - Indian Legal Assistant
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            "Indian Law Assistant",
            "Contract Explainer",
            "Case Law Finder",
            "Bail Eligibility Checker",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setInput("");
                setResponse("");
                setPdf(null);
              }}
              className={`px-5 py-2 rounded-full text-sm font-semibold shadow transition-all duration-200 ${
                tab === activeTab
                  ? "bg-blue-700 text-white scale-105"
                  : "bg-white text-blue-700 border border-blue-300 hover:bg-blue-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100 transition">
          {activeTab === "Contract Explainer" ? (
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Upload PDF
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setPdf(e.target.files[0])}
                className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none file:py-2 file:px-4 file:bg-blue-700 file:text-white file:border-0 hover:file:bg-blue-800"
              />
            </div>
          ) : (
            <div className="mb-6 relative">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Your Legal Query
              </label>
              <textarea
                rows="6"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="E.g. What is the punishment for theft under IPC?"
                className="w-full p-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={startListening}
                type="button"
                className="absolute top-10 right-4 text-blue-600 hover:text-blue-800"
                title="Speak"
              >
                🎤
              </button>
            </div>
          )}

          <button
            onClick={handleSend}
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-md font-medium shadow-md transition duration-200"
          >
            Submit
          </button>

          {response && (
            <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                🧾 Result
              </h3>
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                {response}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
