"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type Language = "en" | "fr" | "es" | "it" | "pt" | "ar";

const LANGUAGE_LABELS: Record<Language, string> = {
  en: "EN",
  fr: "FR",
  es: "ES",
  it: "IT",
  pt: "PT",
  ar: "AR",
};

const PLACEHOLDERS: Record<Language, string> = {
  en: "Type your message...",
  fr: "Tapez votre message...",
  es: "Escribe tu mensaje...",
  it: "Scrivi il tuo messaggio...",
  pt: "Digite sua mensagem...",
  ar: "اكتب رسالتك...",
};

const SUBTITLES: Record<Language, string> = {
  en: "Ask us anything",
  fr: "Posez-nous vos questions",
  es: "Pregúntanos lo que quieras",
  it: "Chiedici qualsiasi cosa",
  pt: "Pergunte-nos qualquer coisa",
  ar: "اسألنا أي شيء",
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Detect browser language on mount
  useEffect(() => {
    const browserLang = navigator.language.split("-")[0].toLowerCase();
    if (browserLang in LANGUAGE_LABELS) {
      setLanguage(browserLang as Language);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Send initial greeting when chat opens for the first time
  useEffect(() => {
    if (isOpen && !hasGreeted && messages.length === 0) {
      setHasGreeted(true);
      // Fetch greeting from API
      fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "hello", language }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.response) {
            setMessages([{ role: "assistant", content: data.response }]);
          }
        })
        .catch(() => {
          setMessages([{ 
            role: "assistant", 
            content: "Welcome to Riad di Siena. How can I help you today?" 
          }]);
        });
    }
  }, [isOpen, hasGreeted, messages.length, language]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage,
          language,
          history: messages 
        }),
      });

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response || "I apologize, I didn't understand that." },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm having trouble responding right now. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isRTL = language === "ar";

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-foreground text-sand rounded-full shadow-lg hover:bg-foreground/90 transition-all flex items-center justify-center"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] bg-background border border-foreground/10 shadow-2xl flex flex-col" 
          style={{ height: "500px", maxHeight: "calc(100vh - 140px)" }}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Header */}
          <div className="p-4 border-b border-foreground/10 bg-sand/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg">Riad di Siena</h3>
                <p className="text-xs text-muted-foreground">{SUBTITLES[language]}</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Language Selector */}
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="text-xs bg-transparent border border-foreground/20 px-2 py-1 focus:outline-none focus:border-foreground/40"
                >
                  {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => (
                    <option key={lang} value={lang}>{LANGUAGE_LABELS[lang]}</option>
                  ))}
                </select>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 6l12 12M6 18L18 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-foreground text-sand rounded-t-2xl rounded-bl-2xl"
                      : "bg-sand/50 text-foreground rounded-t-2xl rounded-br-2xl"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-sand/50 text-foreground rounded-t-2xl rounded-br-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-foreground/10">
            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={PLACEHOLDERS[language]}
                className="flex-1 px-4 py-3 text-sm border border-foreground/10 bg-background focus:outline-none focus:border-foreground/30 transition-colors"
                disabled={isLoading}
                dir={isRTL ? "rtl" : "ltr"}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="px-4 py-3 bg-foreground text-sand hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
