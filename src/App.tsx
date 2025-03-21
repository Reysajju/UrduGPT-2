import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Message } from './types';
import { storageManager } from './utils/storage';
import { soundManager } from './utils/sound';
import { generateResponse } from './utils/gemini';
import { useSettingsStore } from './stores/settingsStore';
import { Sidebar } from './components/Sidebar';
import { SettingsMenu } from './components/SettingsMenu';
import { MessageStatus } from './components/MessageStatus';
import { ConversationStarters } from './components/ConversationStarters';
import { conversationStarters } from './utils/conversationStarters';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const { sounds } = useSettingsStore();

  // Get 3 random conversation starters
  const getRandomStarters = () => {
    const shuffled = [...conversationStarters].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const [randomStarters] = useState(getRandomStarters());

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const storedMessages = await storageManager.getMessages();
        setMessages(storedMessages);
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    loadMessages();
    storageManager.clearOldMessages();
  }, []);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const updateMessageStatus = async (messageId: string, status: Message['status']) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status } : msg
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const messageId = crypto.randomUUID();
    const userMessage: Message = {
      id: messageId,
      text: input.trim(),
      sender: 'user',
      timestamp: Date.now(),
      status: 'sending'
    };

    setInput('');
    setMessages(prev => [...prev, userMessage]);
    await storageManager.saveMessage(userMessage);

    if (sounds.enabled) {
      await soundManager.playSound('send', sounds.volume);
    }

    setIsLoading(true);

    try {
      await updateMessageStatus(messageId, 'sent');
      setTimeout(() => updateMessageStatus(messageId, 'delivered'), 1000);
      setTimeout(() => updateMessageStatus(messageId, 'read'), 2000);

      const responseText = await generateResponse(userMessage.text);
      
      const botMessage: Message = {
        id: crypto.randomUUID(),
        text: responseText,
        sender: 'bot',
        timestamp: Date.now()
      };

      if (sounds.enabled) {
        await soundManager.playSound('receive', sounds.volume);
      }

      setMessages(prev => [...prev, botMessage]);
      await storageManager.saveMessage(botMessage);
    } catch (error) {
      console.error('Error:', error);
      await updateMessageStatus(messageId, 'failed');
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        text: 'معاف کیجیے، کچھ گڑبڑ ہو گئی۔',
        sender: 'bot',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
      await storageManager.saveMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarterSelect = (text: string) => {
    setInput(text);
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001F3F] to-[#87CEEB]">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        messages={messages}
        onClearHistory={async () => {
          await storageManager.setStorage({ version: 1, messages: [] });
          setMessages([]);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <SettingsMenu
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <main className="min-h-screen transition-all duration-300 ease-in-out">
        <div className="h-screen flex flex-col">
          <div className="bg-[#001F3F]/80 backdrop-blur-sm p-4 pl-20 flex items-center min-h-[4rem] border-b border-white/10">
            <h1 className="text-2xl font-bold text-white">UrduGPT</h1>
          </div>

          <div 
            ref={chatAreaRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.length === 0 && (
              <ConversationStarters
                starters={randomStarters}
                onSelect={handleStarterSelect}
              />
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-[#001F3F] text-white rounded-br-none'
                      : 'bg-white/90 backdrop-blur-sm text-gray-800 rounded-bl-none'
                  }`}
                >
                  <div className="mb-1">{message.text}</div>
                  <div className="text-xs opacity-75 flex items-center gap-1">
                    <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                    {message.sender === 'user' && message.status && (
                      <MessageStatus status={message.status} />
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 rounded-bl-none">
                  <Loader2 className="w-5 h-5 animate-spin text-[#001F3F]" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-[#001F3F]/80 backdrop-blur-sm">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-sky-400"
                aria-label="Message input"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-sky-500 text-white p-2 rounded-full hover:bg-sky-600 transition-colors disabled:opacity-50"
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
        </div>
      </main>
    </div>
  );
}

export default App;