'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import Image from 'next/image';
import LeadCaptureForm from './LeadCaptureForm';
import FinancingCalculator from './FinancingCalculator';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  showLeadForm?: boolean;
  showCalculator?: boolean;
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI assistant for IQ Auto Deals. I can help you find the perfect car, explain how our platform works, or answer any questions. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [userInfo, setUserInfo] = useState<{name: string; email: string; phone: string} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    // Use setTimeout to ensure DOM has updated before scrolling (helps with mobile keyboards)
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        showCalculator: data.showCalculator,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Detect high-intent keywords and show lead form after 3+ messages
      if (!leadCaptured && messages.length >= 4) {
        const highIntentKeywords = ['price', 'cost', 'buy', 'purchase', 'interested', 'dealer', 'offer', 'quote', 'specific car', 'suv', 'sedan', 'truck'];
        const recentMessages = [...messages, userMessage, assistantMessage].slice(-5).map(m => m.content.toLowerCase()).join(' ');

        if (highIntentKeywords.some(keyword => recentMessages.includes(keyword))) {
          setTimeout(() => {
            setShowLeadCapture(true);
            setMessages((prev) => [...prev, {
              role: 'assistant',
              content: "I'd love to help you get connected with local dealers who can provide competitive offers! May I get your contact information?",
              timestamp: new Date(),
              showLeadForm: true,
            }]);
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "I'm experiencing high demand right now! Please wait a few seconds and try again. Or feel free to call us at (555) 123-4567 for immediate assistance!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Refocus input after response (helps on mobile)
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  };

  const handleLeadCapture = (data: { name: string; email: string; phone: string }) => {
    setUserInfo(data);
    setLeadCaptured(true);
    setShowLeadCapture(false);

    setMessages((prev) => [...prev, {
      role: 'assistant',
      content: `Thanks ${data.name}! I've saved your information. Our team will reach out to you soon, and I'll continue to help you find the perfect vehicle. What specific features are you looking for?`,
      timestamp: new Date(),
    }]);
  };

  const handleLeadCancel = () => {
    setShowLeadCapture(false);
    setMessages((prev) => [...prev, {
      role: 'assistant',
      content: "No problem! Feel free to ask me anything, and you can provide your info anytime you're ready.",
      timestamp: new Date(),
    }]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full p-4 shadow-2xl hover:from-orange-600 hover:to-red-600 transition-all hover:scale-110 z-50 flex items-center gap-2 animate-pulse"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="hidden md:inline font-semibold">Chat with AI</span>
        </button>
      )}

      {/* Chat Window - Full screen on mobile, floating on desktop */}
      {isOpen && (
        <div
          className="fixed z-[100] bg-[#1a1a2e] flex flex-col overflow-hidden
            inset-0
            md:inset-auto md:bottom-6 md:right-6 md:w-[400px] md:h-[600px] md:rounded-xl md:shadow-2xl"
        >
          {/* Header */}
          <div
            className="bg-primary text-white p-4 flex justify-between items-center shrink-0 md:rounded-t-xl"
            style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
          >
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6" />
              <div>
                <h3 className="font-bold text-lg">IQ Auto Deals Assistant</h3>
                <p className="text-xs text-blue-100">Powered by AI</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 rounded p-1 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 space-y-6">
            {messages.map((message, index) => (
              <div key={index} className="w-full overflow-hidden">
                {message.role === 'assistant' ? (
                  // Assistant message with avatar
                  <div className="flex items-start gap-3">
                    <div className="shrink-0">
                      <Image
                        src="/chat-avatar.png"
                        alt="AI Assistant"
                        width={48}
                        height={48}
                        className="rounded-full border-2 border-blue-400"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-200 text-sm whitespace-pre-wrap break-words leading-relaxed">
                        {message.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ) : (
                  // User message
                  <div className="flex justify-end">
                    <div className="max-w-[85%] bg-primary text-white rounded-2xl px-4 py-3">
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70 text-right">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                )}
                {/* Show Lead Capture Form */}
                {message.showLeadForm && showLeadCapture && !leadCaptured && (
                  <div className="mt-3 ml-14">
                    <LeadCaptureForm
                      onSubmit={handleLeadCapture}
                      onCancel={handleLeadCancel}
                    />
                  </div>
                )}
                {/* Show Financing Calculator */}
                {message.showCalculator && message.role === 'assistant' && (
                  <div className="mt-3 ml-14 w-full overflow-hidden">
                    <FinancingCalculator />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="shrink-0">
                  <Image
                    src="/chat-avatar.png"
                    alt="AI Assistant"
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-blue-400"
                  />
                </div>
                <div className="bg-[#2a2a4a] rounded-lg p-3">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className="p-4 bg-[#1a1a2e] shrink-0 border-t border-gray-700"
            style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
          >
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 min-w-0 bg-white border border-gray-300 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 text-base"
                disabled={isLoading}
                autoComplete="off"
                style={{ fontSize: '16px' }}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              AI-powered assistance for your car search
            </p>
          </div>
        </div>
      )}
    </>
  );
}
