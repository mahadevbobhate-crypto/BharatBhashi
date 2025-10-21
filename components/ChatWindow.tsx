import React, { useState, useRef, useEffect } from 'react';
import { User, Message, MessageStatus } from '../types';
import MessageBubble from './MessageBubble';
import { processMessage } from '../services/geminiService';
import { SendIcon } from './icons/SendIcon';

interface ChatWindowProps {
  currentUser: User;
  otherUser: User;
  messages: Message[];
  onSendMessage: (message: Message) => void;
  onUpdateMessage: (message: Message) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  currentUser,
  otherUser,
  messages,
  onSendMessage,
  onUpdateMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (inputText.trim() === '' || isSending) return;

    setIsSending(true);
    const tempId = `temp_${Date.now()}`;
    const rawInputText = inputText;
    
    const isPhonetic =
      currentUser.language.code !== 'en' &&
      /^[a-zA-Z0-9\s.,?!']+$/.test(rawInputText);

    const optimisticMessage: Message = {
      id: tempId,
      senderId: currentUser.id,
      receiverId: otherUser.id,
      originalText: isPhonetic ? '...' : rawInputText, // Show ellipsis for phonetic conversion
      phoneticText: isPhonetic ? rawInputText : undefined,
      timestamp: Date.now(),
      status: MessageStatus.SENDING,
    };

    onSendMessage(optimisticMessage);
    setInputText('');

    try {
      const { native_script_text, translated_text } = await processMessage(
        rawInputText,
        currentUser.language,
        otherUser.language
      );
      
      const confirmedMessage: Message = {
        ...optimisticMessage,
        id: tempId, 
        originalText: native_script_text,
        translatedText: translated_text,
        status: MessageStatus.SENT,
      };
      onUpdateMessage(confirmedMessage);
      
      // Simulate delivery and seen status
      setTimeout(() => {
        onUpdateMessage({ ...confirmedMessage, status: MessageStatus.DELIVERED });
        setTimeout(() => {
            onUpdateMessage({ ...confirmedMessage, status: MessageStatus.SEEN });
        }, 1500);
      }, 1000);

    } catch (error) {
      console.error("Failed to send message:", error);
      onUpdateMessage({
        ...optimisticMessage,
        originalText: rawInputText, // Restore original text on failure
        status: MessageStatus.FAILED
      });
    } finally {
      setIsSending(false);
    }
  };

  const placeholderText = `Chat in ${currentUser.language.name}... ${
    currentUser.language.code !== 'en' ? 'Try phonetic typing!' : ''
  }`;

  return (
    <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} isSender={msg.senderId === currentUser.id} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder={placeholderText}
            className="flex-1 bg-transparent focus:outline-none text-gray-800"
            disabled={isSending}
          />
          <button
            onClick={handleSend}
            className="ml-3 p-2 rounded-full bg-gradient-to-r from-orange-500 to-green-600 text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center h-9 w-9"
            disabled={!inputText.trim() || isSending}
          >
            {isSending ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <SendIcon />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;