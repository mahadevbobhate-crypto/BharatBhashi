
export interface Language {
  code: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  language: Language;
}

export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  SEEN = 'seen',
  FAILED = 'failed',
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  originalText: string;
  phoneticText?: string;
  translatedText?: string;
  timestamp: number;
  status: MessageStatus;
}
