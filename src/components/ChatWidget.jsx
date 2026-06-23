import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { parseCrisisMessage, geocodeLocationHint } from '../lib/geminiApi';

export default function ChatWidget({ userPosition, onOpenPinForm }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi! Describe your situation and I'll help you drop a pin on the map. Try: \"I'm near Central Park, no food, 2 elderly people, urgent\"",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const parsed = await parseCrisisMessage(text);

      let lat = userPosition?.[0] ?? 20;
      let lng = userPosition?.[1] ?? 0;

      if (parsed.locationHint) {
        const coords = await geocodeLocationHint(parsed.locationHint);
        if (coords) {
          lat = coords.lat;
          lng = coords.lng;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Got it! I've prepared a pin: ${parsed.category}, ${parsed.severity} severity. Review the form and drop your pin.`,
        },
      ]);

      onOpenPinForm({
        category: parsed.category,
        severity: parsed.severity,
        note: parsed.note,
        type: parsed.type,
        lat,
        lng,
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: "Could you be more specific? Try: 'I'm at [location], I need [help type], it's [urgent/critical]'",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[1500] w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 flex items-center justify-center transition-all hover:scale-105"
          aria-label="Open CrisisAI chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[1500] w-[calc(100vw-2rem)] max-w-sm glass-card flex flex-col overflow-hidden shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                <MessageCircle size={16} className="text-red-400" />
              </div>
              <div>
                <div className="font-semibold text-white text-sm">CrisisAI</div>
                <div className="text-xs text-slate-400">Powered by Gemini</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72 min-h-48">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm leading-relaxed px-3 py-2 rounded-xl max-w-[90%] ${
                  msg.role === 'user'
                    ? 'ml-auto bg-red-500/20 text-white'
                    : 'bg-white/5 text-slate-300'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-sm px-3">
                <Loader2 size={16} className="animate-spin" />
                Analyzing your message...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your situation..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/50"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 transition-colors"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
