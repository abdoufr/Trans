import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, X, Landmark, RefreshCw } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface BahdjaGuideChatProps {
  onSelectStationByName: (name: string) => void;
}

export default function BahdjaGuideChat({ onSelectStationByName }: BahdjaGuideChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Marhaban ! Je suis l'assistant **Kifach Nro7** (كيفاش نروح), votre guide transport pour la Wilaya d'Alger. Métro, tramway, RER SNTF, Navette Aéroport, Téléphériques ou Bus ETUSA... posez-moi vos questions !",
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Suggested questions
  const SUGGESTED_QUERIES = [
    { label: '✈️ Aller à l\'Aéroport', query: 'Comment aller à l\'Aéroport d\'Alger Houari Boumediene en train SNTF ou Bus ?' },
    { label: '🚡 Téléphériques d\'Alger', query: 'Quelles sont les lignes de téléphériques et télécabines à Alger ?' },
    { label: '🚇 Horaires du métro', query: 'Quels sont les horaires et fréquences de passage du métro d\'Alger ?' },
    { label: '🎫 Tarifs & Tickets', query: 'Quels sont les tarifs des tickets du métro, tramway et RER SNTF ?' },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: messages.slice(-5).map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await response.json();
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: 'asst_' + Date.now(),
            sender: 'assistant',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error('No reply');
      }
    } catch (err) {
      // Offline / error fallback reply
      let fallbackText = "Désolé, je ne parviens pas à joindre le serveur. ";
      const lower = textToSend.toLowerCase();
      if (lower.includes('tarif') || lower.includes('ticket') || lower.includes('prix')) {
        fallbackText += "Le ticket unitaire du Métro d'Alger est à 50 DA. Le ticket de Tramway est à 40 DA. Pour les bus ETUSA, comptez 20 à 30 DA.";
      } else if (lower.includes('métro') || lower.includes('metro') || lower.includes('horaire')) {
        fallbackText += "Le métro fonctionne de 05h00 à 23h00 tous les jours avec une fréquence moyenne de 4 minutes aux heures de pointe.";
      } else {
        fallbackText += "Je reste disponible en mode hors-ligne pour les infos basiques : Métro (50 DA, 05h-23h), Tram (40 DA, 05h30-23h15).";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'asst_error_' + Date.now(),
          sender: 'assistant',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        id="btn-bahdja-chat"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-rose-600 hover:bg-rose-700 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all z-[1500]"
      >
        <Sparkles className="w-5 h-5 animate-pulse" />
        <span className="font-semibold text-sm pr-1">Bahdja Guide AI</span>
      </button>

      {/* Chat Sidebar Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-[2000] animate-fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col relative transition-transform duration-300 transform translate-x-0">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="bg-rose-500/30 p-2 rounded-xl">
                  <Sparkles className="w-5 h-5 text-rose-100" />
                </div>
                <div>
                  <h3 className="font-bold text-base tracking-tight">Bahdja Guide AI</h3>
                  <p className="text-[10px] text-rose-100/80">Assistant intelligent Transports Alger</p>
                </div>
              </div>
              <button
                id="close-bahdja-chat"
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat History Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col max-w-[85%] ${
                    m.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl text-sm ${
                      m.sender === 'user'
                        ? 'bg-rose-600 text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-100 shadow-xs rounded-bl-none'
                    }`}
                  >
                    {/* Render basic bold text from markdown format */}
                    {m.text.split('**').map((chunk, i) => (i % 2 === 1 ? <strong key={i}>{chunk}</strong> : chunk))}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-slate-400 text-xs py-2 bg-white px-3 border border-slate-100 rounded-xl shadow-xs w-max mr-auto">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-600" />
                  <span>Bahdja réfléchit à votre trajet...</span>
                </div>
              )}
            </div>

            {/* Quick Suggestions Chips */}
            <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100/50">
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2">Questions fréquentes :</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_QUERIES.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(item.query)}
                    className="text-xs bg-white hover:bg-rose-50 hover:text-rose-700 text-slate-600 px-2.5 py-1.5 rounded-lg border border-slate-100 transition shadow-2xs"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 border-t border-slate-100 flex gap-2 bg-white"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ex: Quel itinéraire pour aller d'Alger Gare à l'USTHB ?"
                className="flex-1 bg-slate-50 border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl px-4 py-2 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="bg-rose-600 hover:bg-rose-700 text-white p-2.5 rounded-xl flex items-center justify-center transition hover:scale-105 active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
