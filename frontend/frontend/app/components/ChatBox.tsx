"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "ai";
  text: string;
}

export default function ChatBox() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newHistory = [...history, { role: "user", content: input }];
    setHistory(newHistory);
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      });
      const data = await res.json();
      setHistory((prev) => [...prev, { role: "assistant", content: data.reply }]);
      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "Sorry, something went wrong." }]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {chatOpen && (
        <div className="mb-4 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-amber-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white text-lg">💬</span>
              <div>
                <p className="text-white font-semibold text-sm">Manverse Assistant</p>
                <p className="text-amber-200 text-xs">Ask about products & orders</p>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-white text-xl leading-none hover:text-amber-200 transition">×</button>
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-80 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center">
                <p className="text-gray-400 text-sm mt-4">👋 Hi! I'm your Manverse assistant.</p>
                <div className="mt-4 flex flex-col gap-2">
                  {["What's new?", "Help with sizing", "Track my order"].map((q) => (
                    <button key={q} onClick={() => setInput(q)} className="text-xs bg-white border border-gray-200 rounded-full px-4 py-2 text-gray-600 hover:border-amber-400 hover:text-amber-600 transition">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`px-4 py-2 rounded-2xl text-sm max-w-[85%] ${msg.role === "user" ? "bg-amber-600 text-white rounded-br-sm" : "bg-white text-gray-800 shadow-sm rounded-bl-sm"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white shadow-sm px-4 py-2 rounded-2xl rounded-bl-sm text-sm text-gray-400">Typing...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-gray-100 p-3 flex gap-2 bg-white">
            <input
              className="flex-1 bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-full px-4 py-2 outline-none focus:border-amber-400 placeholder-gray-400"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} className="bg-amber-600 hover:bg-amber-700 text-white w-9 h-9 rounded-full flex items-center justify-center text-sm transition">→</button>
          </div>
        </div>
      )}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="bg-amber-600 hover:bg-amber-700 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl transition ml-auto"
      >
        {chatOpen ? "×" : "💬"}
      </button>
    </div>
  );
}