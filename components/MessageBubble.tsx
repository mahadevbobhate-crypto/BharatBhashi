
import React, { useState } from 'react';
import { Message, MessageStatus } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { DoubleCheckIcon } from './icons/DoubleCheckIcon';
import { EyeIcon } from './icons/EyeIcon';
import { TranslateIcon } from './icons/TranslateIcon';

interface MessageBubbleProps {
  message: Message;
  isSender: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isSender }) => {
  const [showSecondary, setShowSecondary] = useState(false);

  const alignment = isSender ? 'items-end' : 'items-start';
  const bubbleColor = isSender
    ? 'bg-gradient-to-br from-green-400 to-green-600 text-white'
    : 'bg-white text-gray-800 shadow-md';
  const borderRadius = isSender ? 'rounded-br-none' : 'rounded-bl-none';

  const StatusIcon = () => {
    switch (message.status) {
      case MessageStatus.SENDING:
        return <span className="text-xs animate-pulse">...</span>;
      case MessageStatus.SENT:
        return <CheckIcon />;
      case MessageStatus.DELIVERED:
        return <DoubleCheckIcon />;
      case MessageStatus.SEEN:
        return <EyeIcon />;
      case MessageStatus.FAILED:
        return <span className="text-red-500 font-bold">!</span>;
      default:
        return null;
    }
  };
  
  const isTranslationAvailable = message.translatedText && message.translatedText !== message.originalText;

  let mainText: string;
  let secondaryText: string | undefined;
  let secondaryLabel: string = 'Original';

  if (isSender) {
    mainText = message.originalText;
    if (message.phoneticText) {
        secondaryText = message.phoneticText;
        secondaryLabel = 'You typed';
    } else if (isTranslationAvailable) {
        secondaryText = message.translatedText;
        secondaryLabel = 'Translated';
    }
  } else { // Receiver
    mainText = isTranslationAvailable ? message.translatedText! : message.originalText;
    if (isTranslationAvailable) {
      secondaryText = message.originalText;
    }
  }

  const canToggle = !!secondaryText;

  return (
    <div className={`flex flex-col ${alignment}`}>
      <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${bubbleColor} ${borderRadius}`}>
        <p className="text-base break-words">
          {mainText}
        </p>
        {canToggle && (
            <>
                <div className={`border-t my-2 transition-all duration-300 ${isSender ? 'border-white/30' : 'border-gray-200'} ${showSecondary ? 'opacity-100' : 'opacity-0 h-0 border-none my-0'}`}></div>
                <div className={`text-xs transition-all duration-300 overflow-hidden ${isSender ? 'text-white/80' : 'text-gray-500'} ${showSecondary ? 'max-h-40' : 'max-h-0'}`}>
                    <span className="font-semibold italic">{secondaryLabel}:</span>
                    <p className='mt-1'>{secondaryText}</p>
                </div>
            </>
        )}
      </div>
      <div className="flex items-center mt-1.5 space-x-2">
         {canToggle && (
            <button onClick={() => setShowSecondary(!showSecondary)} className={`p-1 rounded-full transition-colors ${showSecondary ? (isSender ? 'bg-white/25' : 'bg-gray-200') : ''} ${isSender ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:bg-gray-200'}`} title="Toggle Original Text">
                <TranslateIcon />
            </button>
        )}
        <span className="text-xs text-gray-500">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        {isSender && (
          <div className="w-4 h-4 flex items-center justify-center text-white">
            <StatusIcon />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
