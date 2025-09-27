// src/components/GeminiModal.jsx
import React, { useContext, useState } from "react";
import "../styles/modal.css";
import { LanguageContext } from "../Context/LanguageContext";
import { translations } from "../TranslationsOfLanguages/translations";


const GeminiModal = ({
  isOpen,
  onClose,
  query,
  setQuery,
  response,
  setResponse,
  onSetPomodoro,
}) => {
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
      let text = data.plan || "❌ No response from AI";

      // 🔍 Look for minutes in the AI text
      const match = text.match(/(\d+)\s*(?:min|minutes|m)/i);
      if (match) {
        const minutes = parseInt(match[1], 10);
        onSetPomodoro(minutes);

        // Add confirmation message
        text += `\n\n✅ I have changed your timer to ${minutes} minutes.`;
      }

      setResponse(text);
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
        <div className="chat-footer">
          <img
            src="../public/gemini.png"
            alt="Gemini Logo"
            style={{
              height: "18px",
              verticalAlign: "middle",
              marginRight: "6px",
            }}
          />
          <small style={{ color: "#777", fontSize: "0.75rem" }}>
            Powered by Google Gemini AI — Beta feature. Responses may be
            inaccurate.
          </small>
        </div>
      </div>
    </div>
  );
};

export default GeminiModal;
