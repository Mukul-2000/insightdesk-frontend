import type { Message } from "../types/chat";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const chatService = {
  /**
   * Fetch chat history for a specific user (Protected Route)
   */
  async getChatHistory(): Promise<Message[]> { // ⬅️ Removed userId parameter
    const token = localStorage.getItem('token'); 
  
    // URL is clean now: no exposed user IDs
    const response = await fetch(`${API_BASE_URL}/chat/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      }
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch chat history');
    }
    return response.json();
  },

  /**
   * Send a new message to the RAG pipeline (Protected Route)
   */
  async sendMessage( content: string): Promise<{ reply: string }> {
    const token = localStorage.getItem('token'); // 🔑 Grab token dynamically

    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // ⬅️ Attached Bearer token
      },
      body: JSON.stringify({ question: content }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message to the assistant');
    }
    return response.json();
  }
};