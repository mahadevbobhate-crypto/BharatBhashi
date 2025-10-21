
import React from 'react';
import { User } from '../types';
import { SwitchUserIcon } from './icons/SwitchUserIcon';

interface HeaderProps {
  currentUser: User;
  otherUser: User;
  onSwitchUser: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, otherUser, onSwitchUser }) => {
  return (
    <div className="bg-gradient-to-r from-orange-400 to-green-500 p-4 flex items-center justify-between text-white shadow-md">
      <div className="flex items-center">
        <img src={otherUser.avatar} alt={otherUser.name} className="w-10 h-10 rounded-full border-2 border-white" />
        <div className="ml-3">
          <h1 className="text-lg font-bold">{otherUser.name}</h1>
          <p className="text-xs opacity-80">Online</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
         <div className="text-right">
            <p className="text-xs opacity-80">You are:</p>
            <p className="font-semibold">{currentUser.name}</p>
        </div>
        <button onClick={onSwitchUser} className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200" title="Switch User">
            <SwitchUserIcon />
        </button>
      </div>
    </div>
  );
};

export default Header;
