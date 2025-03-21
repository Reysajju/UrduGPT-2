import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { ConversationStarter } from '../types';
import { useFloatingAnimation } from '../hooks/useFloatingAnimation';

interface ConversationStartersProps {
  starters: ConversationStarter[];
  onSelect: (text: string) => void;
}

export function ConversationStarters({ starters, onSelect }: ConversationStartersProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { floatingRefs } = useFloatingAnimation(starters.length);

  const handleSelect = (starter: ConversationStarter) => {
    setSelectedId(starter.id);
    // Add a small delay for the animation to complete
    setTimeout(() => onSelect(starter.text), 300);
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-[1200px] mx-auto p-6">
      <h2 className="text-2xl font-bold text-white/90 mb-8 text-center">
        بات چیت شروع کریں
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {starters.map((starter, index) => (
          <div
            key={starter.id}
            ref={floatingRefs[index]}
            className={`
              group relative transform transition-all duration-300 ease-out
              hover:translate-y-[-4px] hover:scale-[1.02]
              ${selectedId === starter.id ? 'scale-[0.98] opacity-75' : ''}
            `}
          >
            <button
              onClick={() => handleSelect(starter)}
              className={`
                relative w-full max-w-[300px] mx-auto
                bg-white/10 backdrop-blur-[10px]
                border border-white/20 rounded-xl
                p-6 text-right
                overflow-hidden
                transition-all duration-300
                hover:bg-white/15
                group-hover:border-white/30
                group-hover:shadow-lg group-hover:shadow-white/5
                active:scale-95
              `}
              style={{ direction: 'rtl' }}
            >
              {/* Ripple effect container */}
              <div className="absolute inset-0 overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ripple" />
              </div>

              {/* Content */}
              <div className="relative flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-sky-400/70 flex-shrink-0 mt-1" />
                <span className="text-white/90 text-lg font-medium leading-relaxed">
                  {starter.text}
                </span>
              </div>

              {/* Hover pulse effect */}
              <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}