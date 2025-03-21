import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface MessageInputProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

export function MessageInput({ onSubmit, isLoading }: MessageInputProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    onSubmit(input);
    setInput('');
    
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-[#001F3F]/80 backdrop-blur-sm">
      <div className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full px-4 py-2 rounded-2xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-sky-400 resize-none min-h-[44px] max-h-[200px]"
            rows={1}
            disabled={isLoading}
            aria-label="Message input"
          />
          <div className="absolute right-3 bottom-2 text-white/50 text-sm pointer-events-none">
            {input.length > 0 && `${input.length}/1000`}
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-sky-500 text-white p-2 rounded-full hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-11 w-11 flex items-center justify-center flex-shrink-0"
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Send className="w-6 h-6" />
          )}
        </button>
      </div>
    </form>
  );
}