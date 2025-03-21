import { ChatStorage, Message, StorageManager } from '../types';

const STORAGE_KEY = 'chat_history';
const STORAGE_VERSION = 1;
const MAX_MESSAGES = 100; // Maximum number of messages to store
const MESSAGE_RETENTION_DAYS = 30; // Number of days to keep messages

class LocalStorageManager implements StorageManager {
  private async getStorage(): Promise<ChatStorage> {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return { version: STORAGE_VERSION, messages: [] };
      }

      const storage: ChatStorage = JSON.parse(data);
      
      // Handle version updates if needed
      if (storage.version < STORAGE_VERSION) {
        // Implement migration logic here when needed
        storage.version = STORAGE_VERSION;
      }

      return storage;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return { version: STORAGE_VERSION, messages: [] };
    }
  }

  private async setStorage(storage: ChatStorage): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
    } catch (error) {
      console.error('Error writing to storage:', error);
      throw new Error('Failed to save to storage');
    }
  }

  async getMessages(): Promise<Message[]> {
    const storage = await this.getStorage();
    return storage.messages;
  }

  async saveMessage(message: Message): Promise<void> {
    const storage = await this.getStorage();
    
    storage.messages.push(message);
    
    // Trim messages if exceeding maximum
    if (storage.messages.length > MAX_MESSAGES) {
      storage.messages = storage.messages.slice(-MAX_MESSAGES);
    }

    await this.setStorage(storage);
  }

  async clearOldMessages(): Promise<void> {
    const storage = await this.getStorage();
    const cutoffDate = Date.now() - (MESSAGE_RETENTION_DAYS * 24 * 60 * 60 * 1000);
    
    storage.messages = storage.messages.filter(msg => msg.timestamp >= cutoffDate);
    await this.setStorage(storage);
  }
}

export const storageManager = new LocalStorageManager();