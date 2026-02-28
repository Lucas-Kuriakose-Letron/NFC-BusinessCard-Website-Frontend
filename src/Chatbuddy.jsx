import { useState } from "react";
import { Link } from "react-router-dom";

var bgColor     = "rgb(255, 209, 134)";
var mainOrange  = "#ff6600";
var darkSlate   = "#2c2a27";
var borderColor = "#999999";
var bodyFont    = "'Lato', sans-serif";
var titleFont   = "'Times New Roman', serif";

var globalStyles = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    background: #ffaa00;
  }
  input, button {
    font-family: Arial;
  }
  a {
    text-decoration: none;
  }
  .navLink {
    color: #ff8000;
    font-size: 14px;
    padding: 4px 0;
  }
  .navLink:hover {
    color: #be5600;
  }
`;


export default function Chatbuddy() {
  var [currentMessage, setCurrentMessage] = useState("");
  var [messageHistory, setMessageHistory] = useState([]);
  var [isWaiting, setIsWaiting] = useState(false);

  async function sendMessage(event) {
    if (event) {
      event.preventDefault();
    }
    if (currentMessage.trim() === "") {
      return;
    }
    var textToSend = currentMessage;
    setCurrentMessage("");
    var historyWithUserMessage = messageHistory.concat({ who: "user", text: textToSend });
    setMessageHistory(historyWithUserMessage);
    setIsWaiting(true);
    var response = await fetch("https://nfc-businesscard-website-backend.onrender.com/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: textToSend }) });
    var responseData = await response.json();
    var botReplyText = responseData.reply;
    var historyWithBotReply = historyWithUserMessage.concat({ who: "bot", text: botReplyText });
    setMessageHistory(historyWithBotReply);
    setIsWaiting(false);
  }


  return (
    <div style={{ backgroundColor: bgColor, fontFamily: bodyFont, display: "flex", flexDirection: "column" }}>
      <style>{globalStyles}</style>

      <nav style={{ backgroundColor: bgColor, borderBottom: "1px solid " + borderColor, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: titleFont, fontSize: "17px", color: mainOrange }}>Chat</span>
        <div style={{ display: "flex", gap: "22px" }}>
          <Link to="/" className="navLink">Home</Link>
          <Link to="/appointments" className="navLink">Schedule</Link>
        </div>
      </nav>

      <main style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px 48px", gap: "14px", flex: 1 }}>
        <div style={{ backgroundColor: "#fff", padding: "22px", width: "100%", maxWidth: "480px", border: "1px solid " + borderColor, display: "flex", flexDirection: "column", gap: "14px" }}>
          <h1 style={{ fontFamily: titleFont, fontSize: "22px", color: mainOrange }}>Got a question?</h1>

          <div style={{ minHeight: "220px", maxHeight: "380px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", padding: "4px 0" }}>
            {messageHistory.length === 0 && (
              <p style={{ color: "#b0a898", fontSize: "14px", fontStyle: "italic", margin: "auto", textAlign: "center" }}>
                Type a message below to get started.
              </p>
            )}
            {messageHistory.map(function(message, index) {
              if (message.who === "user") {
                return (
                  <div key={index} style={{ alignSelf: "flex-end", backgroundColor: darkSlate, color: "#f5f0e8", padding: "10px 14px", borderRadius: "14px 14px 3px 14px", fontSize: "14px", maxWidth: "82%", lineHeight: "1.5" }}>
                    {message.text}
                  </div>
                );
              } else {
                return (
                  <div key={index} style={{ alignSelf: "flex-start", backgroundColor: "#f5f1eb", color: "#1c1917", padding: "10px 14px", borderRadius: "14px 14px 14px 3px", fontSize: "14px", maxWidth: "82%", lineHeight: "1.5" }}>
                    {message.text}
                  </div>
                );
              }
            })}
            {isWaiting && (
              <div style={{ alignSelf: "flex-start", backgroundColor: "#f5f1eb", color: "#1c1917", padding: "10px 14px", borderRadius: "14px 14px 14px 3px", fontSize: "14px" }}>
                Thinking...
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} style={{ display: "flex", gap: "8px" }}>
            <input
              value={currentMessage}
              onChange={function(e) { setCurrentMessage(e.target.value); }}
              placeholder="Ask something..."
              style={{ flex: 1, padding: "11px 13px", border: "1.5px solid " + borderColor, fontSize: "14px", color: "#1c1917", backgroundColor: "#fdfcfa" }}
            />
            <button
              type="submit"
              style={{ padding: "11px 18px", border: "none", backgroundColor: mainOrange, color: bgColor, fontSize: "14px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
            >
              Send
            </button>
          </form>

        </div>
      </main>
    </div>
  );
}
