
import React, { useState } from 'react';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import LanguageSelector from './components/LanguageSelector';
import { User, Message, Language } from './types';
import { INDIAN_LANGUAGES } from './constants';

const USER_A: User = {
  id: 'user_a',
  name: 'Mahadev',
  avatar: 'https://picsum.photos/seed/mahadev/100/100',
  language: INDIAN_LANGUAGES[0], // English
};

const USER_B: User = {
  id: 'user_b',
  name: 'inquiry',
  avatar: 'https://picsum.photos/seed/inquiry/100/100',
  language: INDIAN_LANGUAGES[3], // Malayalam
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>(USER_A);
  const [otherUser, setOtherUser] = useState<User>(USER_B);
  const [messages, setMessages] = useState<Message[]>([]);

  const switchUser = () => {
    setCurrentUser(otherUser);
    setOtherUser(currentUser);
  };

  const handleSendMessage = (newMessage: Message) => {
    setMessages(prev => [...prev, newMessage]);
  };

  const handleUpdateMessage = (updatedMessage: Message) => {
    setMessages(prev =>
      prev.map(msg => (msg.id === updatedMessage.id ? updatedMessage : msg))
    );
  };
  
  const handleLanguageChange = (userId: string, newLanguage: Language) => {
      if (currentUser.id === userId) {
          setCurrentUser(prev => ({ ...prev, language: newLanguage }));
      } else {
          setOtherUser(prev => ({ ...prev, language: newLanguage }));
      }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-orange-100 via-white to-green-100 p-4">
      <div className="w-full max-w-md h-full max-h-[800px] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white">
        <div className="py-3">
            <h1 className="text-xl font-bold text-black text-center">BhashaBharti</h1>
        </div>
        <Header currentUser={currentUser} otherUser={otherUser} onSwitchUser={switchUser} />
        <div className="p-4 border-b border-gray-200 bg-gray-50">
           <h2 className="text-sm font-semibold text-center text-gray-600 mb-2">Language Settings</h2>
            <div className="flex justify-around items-center">
                <LanguageSelector user={currentUser} onLanguageChange={(lang) => handleLanguageChange(currentUser.id, lang)} />
                <LanguageSelector user={otherUser} onLanguageChange={(lang) => handleLanguageChange(otherUser.id, lang)} />
            </div>
        </div>
        <ChatWindow
          currentUser={currentUser}
          otherUser={otherUser}
          messages={messages}
          onSendMessage={handleSendMessage}
          onUpdateMessage={handleUpdateMessage}
        />
      </div>
    </div>
  );
};

export default App;
