import { io } from 'socket.io-client';
import { Message } from '../types';

const SOCKET_URL = 'wss://your-websocket-server.com'; // Replace with your WebSocket server URL

class SocketManager {
  private socket: ReturnType<typeof io> | null = null;
  private messageCallbacks: ((message: Message) => void)[] = [];
  private statusCallbacks: ((messageId: string, status: Message['status']) => void)[] = [];

  connect() {
    if (this.socket) return;

    this.socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('message', (message: Message) => {
      this.messageCallbacks.forEach(callback => callback(message));
    });

    this.socket.on('messageStatus', ({ messageId, status }: { messageId: string, status: Message['status'] }) => {
      this.statusCallbacks.forEach(callback => callback(messageId, status));
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(message: Message) {
    if (!this.socket?.connected) {
      throw new Error('Not connected to WebSocket server');
    }
    this.socket.emit('message', message);
  }

  onMessage(callback: (message: Message) => void) {
    this.messageCallbacks.push(callback);
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }

  onMessageStatus(callback: (messageId: string, status: Message['status']) => void) {
    this.statusCallbacks.push(callback);
    return () => {
      this.statusCallbacks = this.statusCallbacks.filter(cb => cb !== callback);
    };
  }
}

export const socketManager = new SocketManager();