"use client";

import { Icon } from "@/lib/constants";
import { askAIAssistant } from "@/services/geminiService";
import React, { useEffect, useRef, useState } from "react";

interface AIAssistantModalProps {
  onClose: () => void;
}

type Message = {
  text: string;
  sender: "user" | "ai";
};

const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === "" || isLoading) return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const aiResponse = await askAIAssistant(input);
      const aiMessage: Message = { text: aiResponse, sender: "ai" };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        text: "Sorry, I had trouble connecting. Please try again",
        sender: "ai",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-background rounded-2xl shadow-2xl w-full max-w-lg h-[80vh] flex flex-col">
        <div className="p-4 border-b border-brand-primary flex justify-between items-center">
          <h2 className="text-xl font-bold text-brand-text-primary">
            AI Assistant
          </h2>
          <button
            className="text-brand-text-secondary hover:text-brand-text-primary"
            onClick={onClose}
          >
            <Icon name="close" className="w-6 h-6 cursor-pointer" />
          </button>
        </div>
        <div className="flex-grow p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-lg p-3 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-brand-secondary text-white"
                      : "bg-brand-surface text-brand-text-primary"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg bg-brand-surface text-brand-text-primary">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 bg-brand-secondary rounded-full animate-bounce">
                      .
                    </div>
                    <div className="w-2 bg-brand-secondary rounded-full animate-bounce delay-150">
                      .
                    </div>
                    <div className="w-2 bg-brand-secondary rounded-full animate-bounce delay-300">
                      .
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="p-4 border-t border-brand-primary">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything..."
              className="flex-grow bg-brand-surface border border-brand-primary rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || input.trim() === ""}
              className="bg-brand-secondary text-white p-3 rounded-full disabled:bg-brand-primary disabled:cursor-not-allowed cursor-pointer"
            >
              <Icon name="send" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantModal;
