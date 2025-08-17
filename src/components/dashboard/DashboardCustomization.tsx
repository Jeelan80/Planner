import React from 'react';
import { DashboardCard, CardConfig } from '../../types/dashboard';
import { Goal, Task } from '../../types';
import { useDashboardCustomization } from '../../hooks/useDashboardCustomization';
import { CustomizationButton } from './CustomizationButton';
import { CustomizationPanel } from './CustomizationPanel';
import { DashboardGrid } from './DashboardGrid';
import { DragDropContainer } from './DragDropContainer';
import { DashboardErrorBoundary } from './ErrorBoundary';
import { StorageNotification } from './StorageNotification';
import { MobileOptimizations } from './MobileOptimizations';

interface DashboardCustomizationProps {
  goals: Goal[];
  tasks: Task[];
  getTasksForGoal: (goalId: string) => Task[];
  getTodaysTasks: () => Task[];
  getOverdueTasks: () => Task[];
  onToggleTask: (taskId: string, completed: boolean) => void;
  className?: string;
}

export const DashboardCustomization: React.FC<DashboardCustomizationProps> = ({
  goals,
  tasks,
  getTasksForGoal,
  getTodaysTasks,
  getOverdueTasks,
  onToggleTask,
  className = '',
}) => {
  const {
    cards,
    isCustomizing,
    toggleCustomization,
    addCard,
    updateCard,
    deleteCard,
    reorderCards,
    storageInfo,
  } = useDashboardCustomization();

  const handleCardTypeSelect = (type: DashboardCard['type']) => {
    // Create default config based on card type
    const defaultConfig: CardConfig = {};
    
    switch (type) {
      case 'photo':
        defaultConfig.photo = {
          imageUrl: '',
          caption: '',
          altText: '',
        };
        break;
      case 'quote':
        defaultConfig.quote = {
          text: '',
          author: '',
          category: 'motivation',
        };
        break;
      case 'progress':
        defaultConfig.progress = {
          goalId: '',
          showTasks: true,
          showPercentage: true,
        };
        break;
      case 'notes':
        defaultConfig.notes = {
          title: '',
          content: '',
          color: 'default',
        };
        break;
      case 'tasks':
        defaultConfig.tasks = {
          filter: 'today',
          maxItems: 5,
        };
        break;
    }

    // Add the card
    addCard(type, defaultConfig);
  };

  return (
    <MobileOptimizations>
      <div className={`relative ${className}`}>
      {/* Header with Customization Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Your Dashboard</h2>
        <CustomizationButton
          isCustomizing={isCustomizing}
          onClick={toggleCustomization}
        />
      </div>

      {/* Customization Panel */}
      <CustomizationPanel
        isOpen={isCustomizing}
        onClose={toggleCustomization}
        onCardTypeSelect={handleCardTypeSelect}
      />

      {/* Dashboard Content */}
      <DashboardErrorBoundary>
        <DashboardGrid
          cards={cards}
          isCustomizing={isCustomizing}
          onCustomizeClick={toggleCustomization}
        >
          <DragDropContainer
            cards={cards}
            isCustomizing={isCustomizing}
            onReorderCards={reorderCards}
            onUpdate={updateCard}
            onDelete={deleteCard}
            onEdit={() => {}} // Not implemented yet
            goals={goals}
            tasks={tasks}
            getTasksForGoal={getTasksForGoal}
            getTodaysTasks={getTodaysTasks}
            getOverdueTasks={getOverdueTasks}
            onToggleTask={onToggleTask}
          />
        </DashboardGrid>
      </DashboardErrorBoundary>

      {/* Customization Instructions */}
      {isCustomizing && cards.length > 0 && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-500/30 rounded-lg px-4 py-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <p className="text-blue-200 text-sm">
              Drag cards to reorder • Click edit buttons to customize • Click "Done" when finished
            </p>
          </div>
        </div>
      )}

      {/* Storage Notifications */}
      <StorageNotification storageInfo={storageInfo} />
      </div>
    </MobileOptimizations>
  );
};