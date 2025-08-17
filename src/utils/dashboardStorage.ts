// Dashboard data persistence utilities

import { StoredDashboardData, DashboardCard } from '../types/dashboard';

const STORAGE_KEY = 'dashboard-layout';
const CURRENT_VERSION = 1;

// Default dashboard configuration
const getDefaultDashboardData = (): StoredDashboardData => ({
  layout: {
    cards: [],
    gridSize: { columns: 12, rows: 8 },
    version: CURRENT_VERSION,
  },
  cardData: {},
  preferences: {
    gridSize: 'comfortable',
    theme: 'auto',
    animations: true,
  },
});

// Save dashboard data to localStorage
export const saveDashboardData = (data: StoredDashboardData): boolean => {
  try {
    const serializedData = JSON.stringify({
      ...data,
      layout: {
        ...data.layout,
        cards: data.layout.cards.map(card => ({
          ...card,
          createdAt: card.createdAt.toISOString(),
          updatedAt: card.updatedAt.toISOString(),
        })),
      },
    });
    
    localStorage.setItem(STORAGE_KEY, serializedData);
    return true;
  } catch (error) {
    console.error('Failed to save dashboard data:', error);
    
    // Handle quota exceeded error
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded. Attempting to clear old data...');
      try {
        // Clear old data and try again with minimal data
        const minimalData = {
          ...getDefaultDashboardData(),
          layout: {
            ...data.layout,
            cards: data.layout.cards.slice(-5), // Keep only last 5 cards
          },
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(minimalData));
        return true;
      } catch (retryError) {
        console.error('Failed to save even minimal dashboard data:', retryError);
        return false;
      }
    }
    
    return false;
  }
};

// Load dashboard data from localStorage
export const loadDashboardData = (): StoredDashboardData => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    
    if (!storedData) {
      return getDefaultDashboardData();
    }
    
    const parsedData = JSON.parse(storedData);
    
    // Validate and migrate data if necessary
    const migratedData = migrateDashboardData(parsedData);
    
    // Convert date strings back to Date objects
    if (migratedData.layout.cards) {
      migratedData.layout.cards = migratedData.layout.cards.map((card: DashboardCard) => ({
        ...card,
        createdAt: new Date(card.createdAt),
        updatedAt: new Date(card.updatedAt),
      }));
    }
    
    return migratedData;
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
    console.warn('Using default dashboard configuration');
    return getDefaultDashboardData();
  }
};

// Migrate dashboard data between versions  
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const migrateDashboardData = (data: any): StoredDashboardData => {
  const defaultData = getDefaultDashboardData();
  
  // If no version, assume version 0 and migrate to current
  const version = data.layout?.version || 0;
  
  if (version < CURRENT_VERSION) {
    console.log(`Migrating dashboard data from version ${version} to ${CURRENT_VERSION}`);
    
    // Version 0 to 1 migration
    if (version === 0) {
      return {
        ...defaultData,
        layout: {
          cards: data.cards || [],
          gridSize: data.gridSize || defaultData.layout.gridSize,
          version: CURRENT_VERSION,
        },
        cardData: data.cardData || {},
        preferences: {
          ...defaultData.preferences,
          ...data.preferences,
        },
      };
    }
  }
  
  // Ensure all required fields exist
  return {
    layout: {
      cards: data.layout?.cards || [],
      gridSize: data.layout?.gridSize || defaultData.layout.gridSize,
      version: CURRENT_VERSION,
    },
    cardData: data.cardData || {},
    preferences: {
      ...defaultData.preferences,
      ...data.preferences,
    },
  };
};

// Clear all dashboard data
export const clearDashboardData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear dashboard data:', error);
  }
};

// Export dashboard data for backup
export const exportDashboardData = (): string => {
  const data = loadDashboardData();
  return JSON.stringify(data, null, 2);
};

// Import dashboard data from backup
export const importDashboardData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    const migratedData = migrateDashboardData(data);
    return saveDashboardData(migratedData);
  } catch (error) {
    console.error('Failed to import dashboard data:', error);
    return false;
  }
};

// Check if localStorage is available and has space
export const checkStorageAvailability = (): { available: boolean; quota?: number; used?: number } => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    
    // Try to estimate storage usage
    let used = 0;
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        used += localStorage[key].length + key.length;
      }
    }
    
    return {
      available: true,
      used: used,
      // Most browsers have 5-10MB limit, but we can't detect exact quota
      quota: undefined,
    };
  } catch {
    return { available: false };
  }
};