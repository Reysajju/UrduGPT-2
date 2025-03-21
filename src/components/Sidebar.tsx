import React from 'react';
import { Menu, X, MessageSquare, Settings, Trash2 } from 'lucide-react';
import { Message } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  messages: Message[];
  onClearHistory: () => void;
  onOpenSettings: () => void;
}

export function Sidebar({ isOpen, onToggle, messages, onClearHistory, onOpenSettings }: SidebarProps) {
  // Group messages by date
  const groupedMessages = messages.reduce((groups: Record<string, Message[]>, message) => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <>
      {/* Toggle Button - Always visible */}
      <button
        onClick={onToggle}
        className="fixed left-4 top-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        aria-expanded={isOpen}
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-navy-900/30 backdrop-blur-sm transition-opacity z-30"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full transition-transform duration-300 ease-in-out z-40 w-80
          bg-gradient-to-br from-[#001F3F] to-[#87CEEB] text-white shadow-xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-hidden={!isOpen}
        role="complementary"
        aria-label="Chat history sidebar"
      >
        {/* Sidebar Header */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-4">
          <button
            onClick={onToggle}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="font-semibold">Chat History</h2>
        </div>

        {/* Sidebar Content */}
        <div className="p-4 space-y-6">
          {/* Navigation */}
          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-3 py-2 bg-white/10 rounded-lg">
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </button>
            <button 
              onClick={onOpenSettings}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Chat History */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Recent Chats</h3>
              <button
                onClick={onClearHistory}
                className="text-red-300 hover:text-red-400 p-1 transition-colors"
                aria-label="Clear chat history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 max-h-[calc(100vh-240px)] overflow-y-auto custom-scrollbar">
              {Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date}>
                  <div className="text-sm text-white/70 mb-2">{date}</div>
                  {msgs.map((msg) => (
                    <div
                      key={msg.id}
                      className="text-sm py-2 px-3 hover:bg-white/10 rounded cursor-pointer transition-colors"
                    >
                      <div className="truncate">{msg.text}</div>
                      {msg.status && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-white/70">
                          <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                          <MessageStatus status={msg.status} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function MessageStatus({ status }: { status: Message['status'] }) {
  switch (status) {
    case 'sending':
      return <span className="text-gray-300">✓</span>;
    case 'sent':
      return <span className="text-gray-300">✓✓</span>;
    case 'delivered':
      return <span className="text-gray-300">✓✓</span>;
    case 'read':
      return <span className="text-sky-400">✓✓</span>;
    case 'failed':
      return <span className="text-red-400">Failed</span>;
    default:
      return null;
  }
}