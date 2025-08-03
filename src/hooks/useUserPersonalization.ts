// Custom hook for managing user name and personalized greetings

import { useState, useEffect } from 'react';

export const useUserPersonalization = () => {
  const [userName, setUserName] = useState<string>('');
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false);
  const [isEditingName, setIsEditingName] = useState<boolean>(false);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    } else {
      setIsFirstTime(true);
    }
  }, []);

  const getTimeBasedGreeting = (): string => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  };

  const saveName = (name: string) => {
    const trimmedName = name.trim();
    if (trimmedName) {
      setUserName(trimmedName);
      localStorage.setItem('userName', trimmedName);
      setIsFirstTime(false);
      setIsEditingName(false);
    }
  };

  const startEditingName = () => {
    setIsEditingName(true);
  };

  const cancelEditingName = () => {
    setIsEditingName(false);
  };

  return {
    userName,
    isFirstTime,
    isEditingName,
    getTimeBasedGreeting,
    saveName,
    startEditingName,
    cancelEditingName,
  };
};
