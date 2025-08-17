import React, { useEffect, useRef } from 'react';
import { X, Image, Quote, Target, StickyNote, CheckSquare } from 'lucide-react';
import { CardTypeOption, DashboardCard } from '../../types/dashboard';
import { Button } from '../common/Button';

interface CustomizationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCardTypeSelect: (type: DashboardCard['type']) => void;
}

const cardTypeOptions: CardTypeOption[] = [
  {
    id: 'photo',
    type: 'photo',
    name: 'Photo Card',
    description: 'Add personal images with captions',
    icon: 'Image',
    category: 'personal',
  },
  {
    id: 'quote',
    type: 'quote',
    name: 'Motivational Quote',
    description: 'Inspirational quotes to keep you motivated',
    icon: 'Quote',
    category: 'personal',
  },
  {
    id: 'progress',
    type: 'progress',
    name: 'Goal Progress',
    description: 'Track your goal completion and statistics',
    icon: 'Target',
    category: 'project',
  },
  {
    id: 'notes',
    type: 'notes',
    name: 'Quick Notes',
    description: 'Jot down important thoughts and reminders',
    icon: 'StickyNote',
    category: 'productivity',
  },
  {
    id: 'tasks',
    type: 'tasks',
    name: 'Task Summary',
    description: 'Overview of your upcoming and completed tasks',
    icon: 'CheckSquare',
    category: 'productivity',
  },
];

const getIcon = (iconName: string) => {
  const icons = {
    Image,
    Quote,
    Target,
    StickyNote,
    CheckSquare,
  };
  return icons[iconName as keyof typeof icons] || Image;
};

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  isOpen,
  onClose,
  onCardTypeSelect,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle escape key and focus management
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    // Focus the panel for accessibility
    if (panelRef.current) {
      panelRef.current.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCardTypeClick = (type: DashboardCard['type']) => {
    onCardTypeSelect(type);
    onClose();
  };

  const categorizedOptions = {
    personal: cardTypeOptions.filter(option => option.category === 'personal'),
    productivity: cardTypeOptions.filter(option => option.category === 'productivity'),
    project: cardTypeOptions.filter(option => option.category === 'project'),
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300" />
      
      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-l border-white/20 dark:border-gray-700/50 z-50 transform transition-transform duration-300 ease-out shadow-2xl sm:right-0 sm:top-0 sm:h-full max-sm:bottom-0 max-sm:top-auto max-sm:left-0 max-sm:right-0 max-sm:max-w-none max-sm:rounded-t-2xl max-sm:max-h-[80vh] customization-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customization-panel-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-gray-700/50">
          <h2 
            id="customization-panel-title"
            className="text-xl font-semibold text-gray-900 dark:text-white"
          >
            Add Dashboard Card
          </h2>
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="bg-transparent border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close customization panel"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-full pb-20">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Choose a card type to add to your dashboard. You can customize and rearrange cards after adding them.
          </p>

          {/* Personal Cards */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Personal
            </h3>
            <div className="space-y-3">
              {categorizedOptions.personal.map((option) => {
                const IconComponent = getIcon(option.icon);
                return (
                  <button
                    key={option.id}
                    onClick={() => handleCardTypeClick(option.type)}
                    className="w-full p-4 bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-700/50 rounded-xl hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-200 text-left group hover:scale-[1.02] hover:shadow-lg"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg group-hover:scale-110 transition-transform duration-200">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {option.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Productivity Cards */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Productivity
            </h3>
            <div className="space-y-3">
              {categorizedOptions.productivity.map((option) => {
                const IconComponent = getIcon(option.icon);
                return (
                  <button
                    key={option.id}
                    onClick={() => handleCardTypeClick(option.type)}
                    className="w-full p-4 bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-700/50 rounded-xl hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-200 text-left group hover:scale-[1.02] hover:shadow-lg"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg group-hover:scale-110 transition-transform duration-200">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {option.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Project Cards */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Project
            </h3>
            <div className="space-y-3">
              {categorizedOptions.project.map((option) => {
                const IconComponent = getIcon(option.icon);
                return (
                  <button
                    key={option.id}
                    onClick={() => handleCardTypeClick(option.type)}
                    className="w-full p-4 bg-white/50 dark:bg-gray-800/50 border border-white/30 dark:border-gray-700/50 rounded-xl hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-200 text-left group hover:scale-[1.02] hover:shadow-lg"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg group-hover:scale-110 transition-transform duration-200">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                          {option.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};