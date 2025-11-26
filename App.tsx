import React, { useState, useRef, useEffect } from 'react';
import { Message } from './types';
import { sendMessageStream, resetChatSession } from './services/geminiService';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { BookOpen, RefreshCw, Trash2 } from 'lucide-react';

const INITIAL_MESSAGE: Message = {
  id: 'init-1',
  role: 'model',
  content: "**Hello!** I'm LingoLift. 👋\n\nI can help you practice English. \n\n🔹 **Send Chinese:** I'll translate it first, then answer.\n🔹 **Send English:** I'll check your grammar, then answer.\n\nLet's get started!",
  timestamp: new Date(),
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const userMessageId = Date.now().toString();
    const newUserMessage: Message = {
      id: userMessageId,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    const botMessageId = (Date.now() + 1).toString();
    // Initialize bot message placeholder
    setMessages((prev) => [
      ...prev,
      {
        id: botMessageId,
        role: 'model',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      },
    ]);

    try {
      await sendMessageStream(text, (streamText) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? { ...msg, content: streamText }
              : msg
          )
        );
      });
    } catch (error) {
      console.error("Failed to send message", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? { ...msg, content: "**Error:** Something went wrong. Please try again." }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId ? { ...msg, isStreaming: false } : msg
        )
      );
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to clear the conversation history?")) {
      resetChatSession();
      setMessages([INITIAL_MESSAGE]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="flex-none bg-white border-b border-slate-200 shadow-sm z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-2 rounded-lg">
              <BookOpen size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-800 tracking-tight">LingoLift</h1>
              <p className="text-xs text-brand-600 font-medium">AI English Tutor</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear Chat"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
        <div className="max-w-4xl mx-auto flex flex-col min-h-full">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* Input Area */}
      <footer className="flex-none bg-white/80 backdrop-blur-md border-t border-slate-200">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </footer>
    </div>
  );
};

export default App;