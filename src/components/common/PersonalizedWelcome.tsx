// Personalized welcome section with editable name

import React, { useState, useRef, useEffect } from 'react';
import { Edit3, Check, X } from 'lucide-react';

interface PersonalizedWelcomeProps {
  userName: string;
  greeting: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onSaveName: (name: string) => void;
  onCancelEdit: () => void;
}

export const PersonalizedWelcome: React.FC<PersonalizedWelcomeProps> = ({
  userName,
  greeting,
  isEditing,
  onStartEdit,
  onSaveName,
  onCancelEdit,
}) => {
  const [editValue, setEditValue] = useState(userName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(userName);
  }, [userName]);

  const handleSave = () => {
    if (editValue.trim()) {
      onSaveName(editValue.trim());
    } else {
      onCancelEdit();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onCancelEdit();
      setEditValue(userName);
    }
  };

  return (
    <div className="text-center py-8">
      {/* Greeting */}
      <p className="text-xl text-white/90 mb-2 font-medium">
        {greeting}!
      </p>

      {/* Welcome with editable name */}
      <div className="flex items-center justify-center space-x-3 mb-4">
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-white">Welcome, </span>
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyPress}
              className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-1 text-3xl font-bold text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-center min-w-[200px]"
              placeholder="Your name..."
              maxLength={50}
            />
            <span className="text-3xl font-bold text-white">!</span>
            
            {/* Edit action buttons */}
            <div className="flex space-x-1 ml-2">
              <button
                onClick={handleSave}
                className="p-1 rounded-full bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors"
                title="Save"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  onCancelEdit();
                  setEditValue(userName);
                }}
                className="p-1 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="group flex items-center space-x-2">
            <h1 
              className="text-4xl font-bold text-white cursor-pointer hover:text-white/90 transition-colors"
              onClick={onStartEdit}
              title="Click to edit your name"
            >
              Welcome, {userName}!
            </h1>
            <Edit3 
              className="w-5 h-5 text-white/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={onStartEdit}
            />
          </div>
        )}
      </div>

      {/* Subtitle */}
      <p className="text-xl text-white/80 max-w-2xl mx-auto">
        Transform your dreams into achievable milestones with our intelligent planning system
      </p>
    </div>
  );
};
