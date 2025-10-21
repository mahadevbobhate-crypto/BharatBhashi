
import React from 'react';
import { User, Language } from '../types';
import { INDIAN_LANGUAGES } from '../constants';

interface LanguageSelectorProps {
  user: User;
  onLanguageChange: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ user, onLanguageChange }) => {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = INDIAN_LANGUAGES.find(
      lang => lang.code === event.target.value
    );
    if (selectedLanguage) {
      onLanguageChange(selectedLanguage);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor={`lang-select-${user.id}`} className="text-sm font-medium text-gray-700">
        {user.name}:
      </label>
      <select
        id={`lang-select-${user.id}`}
        value={user.language.code}
        onChange={handleSelectChange}
        className="block w-full pl-3 pr-8 py-1.5 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md shadow-sm"
      >
        {INDIAN_LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
