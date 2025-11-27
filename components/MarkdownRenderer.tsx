import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  
  const parseInline = (text: string): React.ReactNode => {
    // Split by bold markers
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
      <>
        {parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            // Remove the ** delimiters
            return <strong key={index} className="font-bold text-brand-700">{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
      </>
    );
  };

  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) {
        elements.push(<div key={i} className="h-3" />);
        continue;
      }

      // Headers (### Header)
      if (trimmed.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-base font-bold text-slate-900 mt-4 mb-2">
            {parseInline(trimmed.replace(/^###\s+/, ''))}
          </h3>
        );
        continue;
      }
      
      if (trimmed.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-lg font-bold text-slate-900 mt-5 mb-3">
            {parseInline(trimmed.replace(/^##\s+/, ''))}
          </h2>
        );
        continue;
      }

      // Bullet points (- or *)
      if (trimmed.match(/^[-*]\s/)) {
        elements.push(
          <div key={i} className="flex items-start ml-2 mb-1.5">
            <span className="text-brand-400 mr-2 mt-1.5 text-[0.6rem]">●</span>
            <span className="flex-1">{parseInline(trimmed.replace(/^[-*]\s+/, ''))}</span>
          </div>
        );
        continue;
      }

      // Numbered lists (1. )
      const numberedMatch = trimmed.match(/^(\d+)\.\s/);
      if (numberedMatch) {
        elements.push(
          <div key={i} className="flex items-start ml-1 mb-1.5">
            <span className="font-medium text-brand-600 mr-2 min-w-[1.2em]">{numberedMatch[1]}.</span>
            <span className="flex-1">{parseInline(trimmed.replace(/^\d+\.\s+/, ''))}</span>
          </div>
        );
        continue;
      }

      // Standard paragraph
      elements.push(
        <div key={i} className="mb-1.5 leading-relaxed">
          {parseInline(line)}
        </div>
      );
    }
    return elements;
  };

  return (
    <div className={`text-sm md:text-base text-slate-700 ${className}`}>
      {parseMarkdown(content)}
    </div>
  );
};