export type MessageRole = 'user' | 'model';

export interface Message {
  _id?: string;        // Optional, matching MongoDB's default id string
  userId: string;
  role: MessageRole;
  content: string;
  createdAt?: string;
}

export interface ChatSessionProps {
  userId: string;
}