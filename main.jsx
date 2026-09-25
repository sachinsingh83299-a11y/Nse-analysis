import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const starter = {
  id: crypto.randomUUID(),
  role: "assistant",
  text: "Namaste! 👋 Main Nova AI hoon. Aap mujhse coding, study, ideas, writing, planning ya general questions pooch sakte ho."
};

function App() {
  const [messages, setMessages] = useState([starter]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMessage = { id: crypto.randomUUID(), role: "user", text };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const history = [...messages, userMessage]
        .filter(m => m.role === "user" || m.role === "assistant")
        .map(m => ({ role: m.role, content: m.text }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI request failed.");

      setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", text: data.reply }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: `Sorry, connection problem: ${err.message}`
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function newChat() {
    setMessages([starter]);
    setInput("");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">N</div>
          <div>
            <strong>Nova AI</strong>
            <span>Smart assistant</span>
          </div>
        </div>

        <button className="new-chat" onClick={newChat}>＋ New chat</button>

        <div className="side-info">
          <div className="status-dot" />
          <div>
            <b>AI Online</b>
            <span>Internet connected</span>
          </div>
        </div>

        <div className="side-footer">Built for fast, helpful conversations.</div>
      </aside>

      <main className="chat">
        <header className="topbar">
          <div>
            <h1>Nova AI</h1>
            <p>Your intelligent assistant</p>
          </div>
          <div className="online-pill"><i /> Online</div>
        </header>

        <section className="messages">
          {messages.map(m => (
            <div key={m.id} className={`row ${m.role}`}>
              {m.role === "assistant" && <div className="avatar">N</div>}
              <div className="bubble">{m.text}</div>
              {m.role === "user" && <div className="avatar user-avatar">You</div>}
            </div>
          ))}

          {loading && (
            <div className="row assistant">
              <div className="avatar">N</div>
              <div className="bubble typing"><span/><span/><span/></div>
            </div>
          )}
          <div ref={bottomRef} />
        </section>

        <form className="composer" onSubmit={sendMessage}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Message Nova AI..."
            disabled={loading}
            autoComplete="off"
          />
          <button type="submit" disabled={loading || !input.trim()} aria-label="Send">
            ➤
          </button>
        </form>
        <div className="hint">AI responses can be inaccurate. Verify important information.</div>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);