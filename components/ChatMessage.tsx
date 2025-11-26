import React from 'react';
import { Message } from '../types';
import { Bot, User } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] lg:max-w-[65%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
          isUser ? 'bg-brand-600 text-white' : 'bg-white text-brand-600 border border-brand-100'
        }`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Message Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`px-5 py-3.5 rounded-2xl shadow-sm text-sm md:text-base ${
              isUser
                ? 'bg-brand-600 text-white rounded-tr-none'
                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
            }`}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <MarkdownRenderer content={message.content} />
            )}
            
            {message.isStreaming && (
               <span className="inline-block w-2 h-4 ml-1 align-middle bg-brand-400 animate-pulse"></span>
            )}
          </div>
          
          <span className="text-xs text-slate-400 mt-1 px-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};