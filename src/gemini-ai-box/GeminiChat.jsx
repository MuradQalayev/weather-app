// src/components/GeminiModal.jsx
import React, { useContext, useState } from "react";
import '../styles/modal.css';
import {LanguageContext} from "../Context/LanguageContext"
import {translations } from "../translationsOfLanguages/translations";

const GeminiModal = ({ isOpen, onClose, query, setQuery,response, setResponse }) => {
  const [loading, setLoading] = useState(false);
  const { language } = useContext(LanguageContext);

  if (!isOpen) return null; 

  const handleSend = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:3000/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: query }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Request failed");
      }

      const data = await res.json();
      setResponse(data.plan || "❌ No response from AI");
    } catch (err) {
      console.error("Frontend fetch error:", err);
      setResponse("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
        <h2>{translations[language].smartPomodoro}</h2>

        <div className="chat-input">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend}>{translations[language].ask}</button>
        </div>

        <div className="chat-response">
          {loading ? (
            <p>⏳ {translations[language].loading}...</p>
          ) : (
            <p>{response}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeminiModal;
