import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FiArrowUp, FiCpu, FiX } from "react-icons/fi";
import { AI_API } from "../ai/ai.api";

interface AIAssistantProps {
  onSuggestion: (suggestion: string) => void;
  onNewMessage?: () => void;
  currentStep?: number;
  selectedFramework?: string | null;
  selectedFeatures?: string[];
  selectedTemplate?: string | null;
  className?: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  onSuggestion,
  onNewMessage = () => {},
  currentStep = 1,
  selectedFramework = null,
  selectedFeatures = [],
  selectedTemplate = null,
  className = ""
}) => {
  const [messages, setMessages] = useState<Array<{ 
    role: string; 
    content: string; 
    timestamp?: Date;
    modelInfo?: {
      model: string;
      provider?: string;
    };
  }>>([
    {
      role: "assistant",
      content: "Здравствуйте! Я ваш виртуальный помощник на базе GigaChat. Как я могу помочь с настройкой вашего проекта?",
      timestamp: new Date(),
      modelInfo: {
        model: "GigaChat",
        provider: "Sberbank"
      }
    }
  ]);
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
    if (messages[messages.length - 1].role === "assistant" && onNewMessage) {
      onNewMessage();
    }
  }, [messages, onNewMessage, scrollToBottom]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await AI_API.getRecommendation(
        input,
        {
          currentStep,
          framework: selectedFramework,
          features: selectedFeatures,
          template: selectedTemplate
        }
      );

      const aiMessage = {
        role: "assistant",
        content: response.suggestion,
        timestamp: new Date(),
        modelInfo: {
          model: response.details?.model || "GigaChat",
          provider: "Sberbank"
        }
      };

      setMessages((prev) => [...prev, aiMessage]);
      onSuggestion(response.suggestion);
    } catch (err) {
      console.error("GigaChat API Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Извините, произошла ошибка при подключении к GigaChat. Попробуйте еще раз позже.",
          timestamp: new Date()
        }
      ]);
      setError("Не удалось подключиться к GigaChat. Проверьте соединение и попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`flex max-h-[min(640px,calc(100vh-6rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 shadow-2xl shadow-black/50 backdrop-blur-xl ${className}`}>
      <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-3.5 pr-12">
        <div className="relative">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-fuchsia-500 text-white">
            <FiCpu size={16} />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-zinc-950 bg-emerald-400" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">AI помощник</h2>
          <p className="text-xs text-zinc-500">GigaChat · шаг {currentStep} из 6</p>
        </div>
      </div>

      <div className="min-h-[240px] flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <motion.div
            key={`msg-${index}-${message.timestamp?.getTime()}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                message.role === "assistant"
                  ? "rounded-tl-md border border-white/[0.06] bg-white/[0.04] text-zinc-200"
                  : "rounded-tr-md bg-brand-500 text-white"
              }`}
              aria-label={`${message.role} message`}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
              {message.timestamp && (
                <p className={`mt-1 text-[11px] ${message.role === "assistant" ? "text-zinc-500" : "text-white/60"}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              )}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-1.5 rounded-2xl rounded-tl-md border border-white/[0.06] bg-white/[0.04] px-4 py-3.5">
              {[0, 0.15, 0.3].map((delay) => (
                <span
                  key={delay}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400"
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            <span className="flex-1">{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-red-300 hover:text-white"
              aria-label="Скрыть ошибку"
            >
              <FiX />
            </button>
          </div>
        )}

        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      <form onSubmit={handleSendMessage} className="border-t border-white/[0.08] p-3">
        <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-zinc-900/80 p-1.5 pl-3 transition focus-within:border-brand-500/60">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="max-h-[120px] min-h-[36px] flex-1 resize-none bg-transparent py-2 text-sm text-white placeholder-zinc-500 focus:outline-none"
            placeholder="Спросите о настройке проекта..."
            aria-label="Введите ваше сообщение"
            disabled={isLoading}
            rows={1}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white transition hover:bg-brand-600 disabled:bg-zinc-800 disabled:text-zinc-500"
            aria-label="Отправить сообщение"
          >
            <FiArrowUp />
          </button>
        </div>
      </form>
    </div>
  );
};
