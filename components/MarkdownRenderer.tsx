import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  // A very basic parser to handle bolding and newlines for the chat.
  // In a production app with full markdown needs, we might use a library like react-markdown,
  // but for this specific instruction set (headers, bolding), manual parsing keeps it lightweight.
  
  const processText = (text: string) => {
    return text.split('\n').map((line, lineIndex) => {
        // Handle Headers (User defined in system prompt as **Header**)
        const parts = line.split(/(\*\*.*?\*\*)/g);
        
        return (
            <div key={lineIndex} className={`${line.trim() === '' ? 'h-2' : 'min-h-[1.5em]'}`}>
                {parts.map((part, partIndex) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={partIndex} className="font-bold text-brand-700 dark:text-brand-300">{part.slice(2, -2)}</strong>;
                    }
                    return <span key={partIndex}>{part}</span>;
                })}
            </div>
        );
    });
  };

  return (
    <div className={`text-sm md:text-base leading-relaxed ${className}`}>
      {processText(content)}
    </div>
  );
};