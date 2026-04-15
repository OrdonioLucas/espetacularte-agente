import { useState, useRef, useEffect } from "react";
import Head from "next/head";

const WELCOME = {
  role: "assistant",
  content: "Olá! 🎉 Eu sou a **Mágica**, assistente virtual da **Espetacularte**!\n\nEstou aqui para ajudar você a criar uma festa inesquecível com nossos personagens vivos! 🎭✨\n\nPosso te ajudar com:\n- 🎭 Catálogo de personagens\n- 💰 Preços e pacotes\n- 🎪 Show da Turma do Mickey\n- 🎁 Recomendações personalizadas\n- 📅 Informações sobre disponibilidade\n\nComo posso te ajudar hoje?",
};

const QUICK = [
  "📋 Ver catálogo completo",
  "💰 Quanto custa?",
  "🎪 Show do Mickey",
  "🎭 Me recomende um personagem",
];

function format(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .split("\n")
    .map((line, i) => {
      if (line.startsWith("- "))
        return `<li key="${i}" style="margin-left:16px;margin-bottom:3px">${line.slice(2)}</li>`;
      if (line === "") return `<br/>`;
      return `<p style="margin:0 0 3px">${line}</p>`;
    })
    .join("");
}

export default function Home() {
  const [msgs, setMsgs] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    const newMsgs = [...msgs, { role: "user", content: msg }];
    setMsgs(newMsgs);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMsgs }),
      });
      const data = await res.json();
      setMsgs((prev) => [...prev, { role: "assistant", content: data.reply || "Ops! Tente novamente 😊" }]);
    } catch {
      setMsgs((prev) => [...prev, { role: "assistant", content: "Ops! Problema técnico, tente novamente 😊" }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <>
      <Head>
        <title>Espetacularte — Atendimento</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: linear-gradient(135deg, #fdf4ff 0%, #ede9fe 50%, #fce7f3 100%); min-height: 100vh; font-family: 'Segoe UI', sans-serif; display: flex; align-items: center; justify-content: center; padding: 16px; }
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .msg { animation: fadeIn 0.3s ease; }
        .dot { width:7px;height:7px;border-radius:50%;background:#a855f7;animation:bounce 1.2s infinite; }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:#d8b4fe;border-radius:4px}
        textarea:focus { outline: none; }
        button:hover { opacity: 0.9; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 40px rgba(168,85,247,0.2)" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#d946a8,#a855f7,#6366f1)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, border: "2px solid rgba(255,255,255,0.4)" }}>🎭</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Mágica — Espetacularte</div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80" }} /> Online agora
            </div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 11 }}>⭐ 5 estrelas</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>São Paulo / SP</div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ background: "#fff", height: 420, overflowY: "auto", padding: "16px 14px 8px" }}>
          {msgs.map((m, i) => {
            const isUser = m.role === "user";
            return (
              <div key={i} className="msg" style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 14, flexDirection: isUser ? "row-reverse" : "row" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: isUser ? "#6366f1" : "linear-gradient(135deg,#d946a8,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                  {isUser ? "👤" : "M"}
                </div>
                <div style={{ maxWidth: "75%", background: isUser ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#f3e8ff", color: isUser ? "#fff" : "#2d1b4e", borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "10px 14px", fontSize: 14, lineHeight: 1.55, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                  dangerouslySetInnerHTML={{ __html: format(m.content) }} />
              </div>
            );
          })}

          {loading && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#d946a8,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700 }}>M</div>
              <div style={{ background: "#f3e8ff", borderRadius: "18px 18px 18px 4px", padding: "12px 16px" }}>
                <div style={{ display: "flex", gap: 5 }}>
                  {[0, 1, 2].map(i => <div key={i} className="dot" style={{ animationDelay: `${i * 0.2}s` }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick replies */}
        {msgs.length <= 1 && (
          <div style={{ background: "#fafafa", borderTop: "1px solid #f3e8ff", padding: "8px 12px", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {QUICK.map((q, i) => (
              <button key={i} onClick={() => send(q)} style={{ background: "linear-gradient(135deg,#fdf4ff,#ede9fe)", border: "1px solid #d8b4fe", borderRadius: 20, padding: "5px 11px", fontSize: 11, color: "#7c3aed", cursor: "pointer", fontWeight: 500 }}>{q}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ background: "#fff", borderTop: "1px solid #f3e8ff", padding: "10px 12px", display: "flex", gap: 8, alignItems: "flex-end" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Digite sua mensagem..."
            rows={1}
            style={{ flex: 1, border: "1.5px solid #e9d5ff", borderRadius: 20, padding: "8px 14px", fontSize: 14, resize: "none", fontFamily: "inherit", color: "#2d1b4e", background: "#fafafa", lineHeight: 1.4, maxHeight: 80, overflowY: "auto" }}
          />
          <button onClick={() => send()} disabled={loading || !input.trim()} style={{ width: 40, height: 40, borderRadius: "50%", border: "none", background: loading || !input.trim() ? "#e9d5ff" : "linear-gradient(135deg,#d946a8,#a855f7)", color: "#fff", fontSize: 18, cursor: loading || !input.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: loading || !input.trim() ? "none" : "0 2px 8px rgba(168,85,247,0.4)" }}>
            {loading ? "⏳" : "➤"}
          </button>
        </div>

        {/* Footer */}
        <div style={{ background: "#fff", textAlign: "center", padding: "6px 0 10px", fontSize: 11, color: "#a78bfa" }}>
          🎉 Espetacularte · Personagens Vivos para Festas · SP
        </div>

      </div>
    </>
  );
}
