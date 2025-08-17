// Custom hook for dashboard customization state management

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  DashboardCard, 
  DashboardState, 
  StoredDashboardData, 
  CardConfig 
} from '../types/dashboard';
import { 
  saveDashboardData, 
  loadDashboardData, 
  checkStorageAvailability 
} from '../utils/dashboardStorage';

export const useDashboardCustomization = () => {
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    cards: [],
    isCustomizing: false,
    selectedCard: null,
    draggedCard: null,
  });

  const [storageInfo, setStorageInfo] = useState(checkStorageAvailability());

  // Load dashboard data on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const data = loadDashboardData();
        setDashboardState(prev => ({
          ...prev,
          cards: data.layout.cards,
        }));
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    loadData();
  }, []);

  // Save dashboard data whenever cards change
  const saveCurrentState = useCallback((cards: DashboardCard[]) => {
    try {
      const currentData = loadDashboardData();
      const updatedData: StoredDashboardData = {
        ...currentData,
        layout: {
          ...currentData.layout,
          cards,
        },
      };

      const success = saveDashboardData(updatedData);
      if (!success) {
        console.warn('Failed to save dashboard state');
        // Update storage info to reflect any quota issues
        setStorageInfo(checkStorageAvailability());
      }
    } catch (error) {
      console.error('Error saving dashboard state:', error);
    }
  }, []);

  // Add a new card to the dashboard
  const addCard = useCallback((type: DashboardCard['type'], config: CardConfig) => {
    const newCard: DashboardCard = {
      id: uuidv4(),
      type,
      position: { x: 0, y: 0 }, // Will be positioned by grid system
      size: { width: 1, height: 1 }, // Default size
      config,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setDashboardState(prev => {
      const updatedCards = [...prev.cards, newCard];
      saveCurrentState(updatedCards);
      return {
        ...prev,
        cards: updatedCards,
      };
    });

    return newCard.id;
  }, [saveCurrentState]);

  // Update an existing card
  const updateCard = useCallback((cardId: string, updates: Partial<DashboardCard>) => {
    setDashboardState(prev => {
      const updatedCards = prev.cards.map(card =>
        card.id === cardId
          ? { ...card, ...updates, updatedAt: new Date() }
          : card
      );
      saveCurrentState(updatedCards);
      return {
        ...prev,
        cards: updatedCards,
      };
    });
  }, [saveCurrentState]);

  // Delete a card
  const deleteCard = useCallback((cardId: string) => {
    setDashboardState(prev => {
      const updatedCards = prev.cards.filter(card => card.id !== cardId);
      saveCurrentState(updatedCards);
      return {
        ...prev,
        cards: updatedCards,
        selectedCard: prev.selectedCard === cardId ? null : prev.selectedCard,
      };
    });
  }, [saveCurrentState]);

  // Reorder cards (for drag and drop)
  const reorderCards = useCallback((cardIds: string[]) => {
    setDashboardState(prev => {
      const cardMap = new Map(prev.cards.map(card => [card.id, card]));
      const reorderedCards = cardIds
        .map(id => cardMap.get(id))
        .filter((card): card is DashboardCard => card !== undefined);
      
      saveCurrentState(reorderedCards);
      return {
        ...prev,
        cards: reorderedCards,
      };
    });
  }, [saveCurrentState]);

  // Toggle customization mode
  const toggleCustomization = useCallback(() => {
    setDashboardState(prev => ({
      ...prev,
      isCustomizing: !prev.isCustomizing,
      selectedCard: null, // Clear selection when toggling
    }));
  }, []);

  // Select a card for editing
  const selectCard = useCallback((cardId: string | null) => {
    setDashboardState(prev => ({
      ...prev,
      selectedCard: cardId,
    }));
  }, []);

  // Set dragged card (for drag and drop feedback)
  const setDraggedCard = useCallback((cardId: string | null) => {
    setDashboardState(prev => ({
      ...prev,
      draggedCard: cardId,
    }));
  }, []);

  // Get card by ID
  const getCard = useCallback((cardId: string): DashboardCard | undefined => {
    return dashboardState.cards.find(card => card.id === cardId);
  }, [dashboardState.cards]);

  // Get cards by type
  const getCardsByType = useCallback((type: DashboardCard['type']): DashboardCard[] => {
    return dashboardState.cards.filter(card => card.type === type);
  }, [dashboardState.cards]);

  // Clear all cards
  const clearAllCards = useCallback(() => {
    setDashboardState(prev => {
      saveCurrentState([]);
      return {
        ...prev,
        cards: [],
        selectedCard: null,
      };
    });
  }, [saveCurrentState]);

  return {
    // State
    cards: dashboardState.cards,
    isCustomizing: dashboardState.isCustomizing,
    selectedCard: dashboardState.selectedCard,
    draggedCard: dashboardState.draggedCard,
    storageInfo,

    // Actions
    addCard,
    updateCard,
    deleteCard,
    reorderCards,
    toggleCustomization,
    selectCard,
    setDraggedCard,
    getCard,
    getCardsByType,
    clearAllCards,
  };
};