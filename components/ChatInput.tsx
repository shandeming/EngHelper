import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-300 to-indigo-300 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-300 blur"></div>
        <form
          onSubmit={handleSubmit}
          className="relative flex items-end gap-2 bg-white rounded-xl shadow-lg border border-slate-100 p-2"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type in English or Chinese..."
            className="flex-1 max-h-[150px] py-3 px-4 bg-transparent border-none focus:ring-0 resize-none text-slate-700 placeholder:text-slate-400 text-base"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-xl flex items-center justify-center transition-all duration-200 ${
              input.trim() && !isLoading
                ? 'bg-brand-600 text-white shadow-md hover:bg-brand-700 hover:scale-105 active:scale-95'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <Sparkles className="animate-spin" size={20} />
            ) : (
              <Send size={20} className={input.trim() ? 'ml-0.5' : ''} />
            )}
          </button>
        </form>
      </div>
      <p className="text-center text-xs text-slate-400 mt-2">
        Type <span className="font-medium text-slate-500">Chinese</span> to translate & answer, or <span className="font-medium text-slate-500">English</span> to check grammar.
      </p>
    </div>
  );
};