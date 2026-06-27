import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    {
      sender: "AI",
      text: "Hello! I'm your AI assistant. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  async function sendMessage() {
    const messageText = input.trim();
    if (messageText === "") return;

    const userMessage = {
      sender: "You",
      text: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    try {
      const { getAIResponse } = await import("./api");
      const reply = await getAIResponse(messageText);

      setMessages((prev) => [
        ...prev,
        {
          sender: "AI",
          text: reply,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "AI",
          text: "Sorry, I couldn't respond right now.",
        },
      ]);
    } finally {
      setTyping(false);
    }
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      void sendMessage();
    }
  }

  return (
    <div className="app">
      <div className="header">🤖 AI Chat Assistant</div>

      <div className="chat">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "You" ? "message user" : "message ai"}
          >
            <div className="avatar">{msg.sender === "You" ? "👤" : "🤖"}</div>

            <div className="bubble">{msg.text}</div>
          </div>
        ))}

        {typing && (
          <div className="message ai">
            <div className="avatar">🤖</div>
            <div className="bubble typing">AI is typing...</div>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      <div className="inputBox">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
        />

        <button onClick={() => void sendMessage()}>Send</button>
      </div>
    </div>
  );
}

export default App;
