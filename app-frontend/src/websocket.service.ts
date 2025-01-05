import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService implements OnDestroy {
  private socket!: WebSocket | null;
  private messageQueue: any[] = [];

  constructor() {
    const token = localStorage.getItem('userToken'); // Example: Retrieve token from localStorage
    this.socket = new WebSocket(`ws://localhost:5000?token=${token}`);
    this.setupWebSocketHandlers();
  }

  private setupWebSocketHandlers(): void {
    if (!this.socket) return;

    this.socket.onopen = () => {
      console.log('WebSocket connection established.');
      this.flushMessageQueue();
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not ready. Queueing message.');
      this.messageQueue.push(message);
    }
  }

  onMessage(callback: (message: any) => void): void {
    if (!this.socket) return;

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift();
      this.socket.send(JSON.stringify(message));
    }
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
