import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, X, RefreshCw, Mic, MicOff, MapPin, Bot, ChevronRight } from 'lucide-react';

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
      text: "Marhaban ! Je suis **Kifach Nro7 AI** (كيفاش نروح AI), votre assistant IA expert en transports pour la Wilaya d'Alger. Métro, tramway, RER SNTF, Navette Aéroport, Téléphériques ou Bus ETUSA / Privés... posez-moi toutes vos questions !",
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Suggested quick prompts
  const SUGGESTED_QUERIES = [
    { label: '✈️ Navette Aéroport', query: 'Comment aller à l\'Aéroport d\'Alger Houari Boumediene en train RER ou Bus Express ?' },
    { label: '🚇 Métro Place Martyrs', query: 'Quels sont les horaires et correspondances du Métro à la Place des Martyrs ?' },
    { label: '🚡 Téléphériques Alger', query: 'Quelles sont les lignes de téléphériques et télécabines actives à Alger ?' },
    { label: '🎫 Tarifs Tickets 2026', query: 'Quels sont les tarifs des tickets du métro, tramway, bus et RER SNTF ?' },
    { label: '🚌 Bus Privé Belfort - USTHB', query: 'Quels bus privés ou ETUSA passent par Bab Ezzouar et USTHB ?' },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Voice speech-to-text recognition
  const handleToggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("La reconnaissance vocale n'est pas supportée sur ce navigateur. Essayez sur Chrome, Edge ou Safari.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          handleSend(transcript);
        }
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

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
          chatHistory: messages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
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
        throw new Error('No reply from server');
      }
    } catch (err) {
      // Offline fallback smart response
      let fallbackText = "Marhaban ! ";
      const lower = textToSend.toLowerCase();

      if (lower.includes('tarif') || lower.includes('ticket') || lower.includes('prix')) {
        fallbackText += "Les tarifs officiels : **Métro (50 DA)**, **Tramway (40 DA)**, **Bus ETUSA (20-30 DA)**, **RER SNTF (à partir de 40 DA)**.";
      } else if (lower.includes('métro') || lower.includes('metro')) {
        fallbackText += "Le Métro d'Alger fonctionne de **05h00 à 23h00** tous les jours (4 min aux heures de pointe) entre **Place des Martyrs** et **El Harrach Gare / Aïn Naâdja**.";
      } else if (lower.includes('aéroport') || lower.includes('aeroport')) {
        fallbackText += "Pour l'Aéroport Houari Boumediene, prenez la **Navette Train Express SNTF** depuis Agha/Alger Gare ou les bus ETUSA depuis 1er Mai/Tafourah.";
      } else {
        fallbackText += "Je suis **Kifach Nro7 AI** (كيفاش نروح AI). Posez-moi vos questions sur les lignes de métro, tramway, bus et RER SNTF à Alger !";
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

  // List of key stations to render interactive station map action chips in chat
  const KEY_STATIONS = [
    'Place des Martyrs', 'Ruisseau', 'Tafourah', '1er Mai', 'Agha', 'El Harrach',
    'Bab Ezzouar', 'USTHB', 'Dergana', 'Chevalley', 'Ben Aknoun', 'Bordj El Kiffan',
    'Zéralda', 'Aïn Naâdja', 'Bachdjerrah', 'Haï El Badr'
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <button
        id="btn-kifach-ai-chat"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white px-4 py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all z-[1500] border border-rose-400/40"
      >
        <div className="relative">
          <Bot className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
        </div>
        <span className="font-black text-xs sm:text-sm tracking-tight">Kifach Nro7 AI <span className="font-arabic font-bold text-rose-200">كيفاش نروح</span></span>
      </button>

      {/* Chat Sidebar Drawer */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex justify-end z-[2000] animate-fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col relative transition-transform duration-300 transform translate-x-0 border-l border-slate-100">
            
            {/* Drawer Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-rose-600 p-2.5 rounded-xl shadow-md text-white">
                  <Bot className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                    <span>Kifach Nro7 AI</span>
                    <span className="text-xs text-rose-400 font-arabic font-bold">كيفاش نروح</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">Assistant IA Expert Transports Wilaya d'Alger</p>
                </div>
              </div>

              <button
                id="close-kifach-ai-chat"
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat History Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col max-w-[88%] ${
                    m.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-rose-600 text-white rounded-br-none shadow-sm'
                        : 'bg-white text-slate-800 border border-slate-200/80 shadow-xs rounded-bl-none'
                    }`}
                  >
                    {/* Render bold text from markdown */}
                    {m.text.split('**').map((chunk, i) => (i % 2 === 1 ? <strong key={i} className="font-extrabold">{chunk}</strong> : chunk))}

                    {/* Interactive Station Action Badges */}
                    {m.sender === 'assistant' && (
                      <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                        {KEY_STATIONS.filter(st => m.text.toLowerCase().includes(st.toLowerCase())).map((st, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              onSelectStationByName(st);
                              setIsOpen(false);
                            }}
                            className="text-[10px] font-extrabold bg-rose-50 hover:bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md border border-rose-200/60 transition flex items-center gap-1"
                          >
                            <MapPin className="w-3 h-3 text-rose-600" />
                            <span>Voir {st} sur la carte</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1 font-semibold">{m.timestamp}</span>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-slate-500 text-xs py-2.5 bg-white px-3.5 border border-slate-200/80 rounded-xl shadow-xs w-max mr-auto">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-600" />
                  <span>Kifach Nro7 AI analyse votre demande...</span>
                </div>
              )}
            </div>

            {/* Quick Suggestions Chips */}
            <div className="px-4 py-3 bg-slate-100/70 border-t border-slate-200/60">
              <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-2">Suggestions rapides :</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_QUERIES.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(item.query)}
                    className="text-[11px] font-bold bg-white hover:bg-rose-50 hover:text-rose-700 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/80 transition shadow-2xs"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar with Voice Support */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 border-t border-slate-200 flex gap-2 bg-white"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez une question en Darija ou Français..."
                className="flex-1 bg-slate-50 border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium focus:outline-none placeholder:text-slate-400"
              />

              <button
                type="button"
                onClick={handleToggleVoiceInput}
                className={`p-2.5 rounded-xl border transition flex items-center justify-center ${
                  isListening 
                    ? 'bg-rose-500 text-white border-rose-500 animate-pulse' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                }`}
                title="Microphone (Recherche vocale)"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-rose-600 hover:bg-rose-700 disabled:bg-slate-100 disabled:text-slate-400 text-white p-2.5 rounded-xl flex items-center justify-center transition hover:scale-105 active:scale-95 shadow-sm"
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
