export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
  status?: MessageStatus;
}

export interface ChatStorage {
  version: number;
  messages: Message[];
}

export interface StorageManager {
  getMessages: () => Promise<Message[]>;
  saveMessage: (message: Message) => Promise<void>;
  clearOldMessages: () => Promise<void>;
  setStorage: (storage: ChatStorage) => Promise<void>;
}

export interface SoundSettings {
  enabled: boolean;
  volume: number;
}

export interface Settings {
  sounds: SoundSettings;
  darkMode: boolean;
  compactMessages: boolean;
  notifications: boolean;
  profilePhoto?: string;
}

export interface ProfilePhotoState {
  photo: string | null;
  isUploading: boolean;
  error: string | null;
}

export interface ConversationStarter {
  id: number;
  text: string;
}